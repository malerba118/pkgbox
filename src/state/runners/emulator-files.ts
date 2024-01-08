/** @satisfies {import('@webcontainer/api').FileSystemTree} */

export const files = {
  "index.js": {
    file: {
      contents: `import express from 'express';
          import cors from 'cors';
          import * as cp from 'child_process';
          import fs from 'fs'
          import os from 'os';
          import path from 'path';
  
          const DEBUG = false
  
          const printDir = (dir) => cp.spawnSync('ls', ['-a'], { cwd: dir, stdio: DEBUG ? 'inherit' : null });
          function printFile(filePath) {
            // Check if the file exists
            if (!fs.existsSync(filePath)) {
                return;
            }
        
            try {
                // Read the file content and print it
                const fileContent = fs.readFileSync(filePath, 'utf8');
                console.log(fileContent);
            } catch (error) {
                // Handle any errors during reading the file
            }
        }
          const cwd = process.cwd()
          const libraryDir = path.join(cwd, '.library');
          fs.mkdirSync(libraryDir);
          const appDir = path.join(cwd, '.app');
          fs.mkdirSync(appDir);
          const testsDir = path.join(cwd, '.tests');
          fs.mkdirSync(testsDir);
      
          const app = express();
          const port = 3000;
          
          app.use(express.json());
          app.use(cors());
      
          app.get('/', async (req, res) => {
              return res.send(\`<html>
              <head>
                <title>Inner iFrame Document</title>
                <script>
                  window.addEventListener('message', function(event) {
                    if (!event.data) return
                    if (!event.data.requestId) return 
                      fetch(
                        event.data.url, 
                        { 
                          method: event.data.method, 
                          body: JSON.stringify(event.data.body),
                          headers: {
                            'Content-Type': 'application/json'
                          },
                        }
                      )
                      .then((res) => res.json())
                      .then((data) => {
                        window.parent.postMessage({
                          requestId: event.data.requestId, 
                          body: data 
                        }, "*")
                      })
                      .catch(console.error)
                  });
                </script>
              </head>
              <body>
                iFrame Content
              </body>
            </html>
            \`);
          });
    
           function readIntoMemory(dir, baseDir = dir, obj = {}) {
              const files = fs.readdirSync(dir);
          
              files.forEach(file => {
                  const filePath = path.join(dir, file);
                  const relativePath = \`/\${path.relative(baseDir, filePath)}\`;
                  const stats = fs.statSync(filePath);
          
                  if (stats.isDirectory()) {
                    readIntoMemory(filePath, baseDir, obj);
                  } else {
                      const fileContents = fs.readFileSync(filePath, 'utf8');
                      obj[relativePath] = { code: fileContents };
                  }
              });
          
              return obj;
          }
    
          app.post('/library/files', async (req, res) => {           
            let packageJsonUpdated = false;
            let existingPackageJson = null;
            const packageJsonPath = path.join(libraryDir, 'package.json');
    
            if (fs.existsSync(packageJsonPath)) {
                existingPackageJson = fs.readFileSync(packageJsonPath, 'utf8')
            }
        
            try {
                const files = req.body
                for (const filePath in files) {
                    const normalizedPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
                    const fullPath = path.join(libraryDir, normalizedPath);
                    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
                    fs.writeFileSync(fullPath, files[filePath].code);
        
                    if (normalizedPath === 'package.json' && files[filePath].code !== existingPackageJson) {
                        packageJsonUpdated = true;
                    }
                }
        
                if (packageJsonUpdated) {
                    console.log('Updating dependencies...');
                    const result = cp.spawnSync('npm', ['install'], { cwd: libraryDir, stdio: DEBUG ? 'inherit' : null });
                    if (result.error) {
                        throw result.error;
                    }
                }
        
                res.send({ message: 'Files written to .library directory' });
            } catch (error) {
                res.status(500).send({ error: 'Error processing files', details: error.message });
            }
        });
    
    
        app.post('/library/build', async (req, res) => {   
            const distDir = path.join(libraryDir, 'dist')
     
            if (!fs.existsSync(distDir)) {
               fs.mkdirSync(distDir);
            }
        
            try {
                const packageJsonPath = path.join(libraryDir, 'package.json');
                if (!fs.existsSync(packageJsonPath)) {
                    return res.status(400).send({ error: 'package.json not found in .library directory' });
                }
        
                const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
                if (!packageJson.main) {
                    return res.status(400).send({ error: 'Main entry point not specified in package.json' });
                }
        
                // Determine the entry point for esbuild
                const entryPoint = path.join(libraryDir, packageJson.main);
    
                const buildResult = cp.spawnSync('npm', ['run', 'build'], { cwd: libraryDir, stdio: DEBUG ? 'inherit' : null });
                if (buildResult.error) {
                    throw result.error;
                }
                const packResult = cp.spawnSync('npm', ['pack', '--pack-destination', libraryDir], { cwd: distDir, stdio: DEBUG ? 'inherit' : null });
  
                const packedFileName = packageJson.name + "-" + packageJson.version + ".tgz"
                const outputFiles = readIntoMemory(distDir)
        
                res.send({ files: outputFiles, packageId: path.join(libraryDir, packedFileName) });
            } catch (error) {
                res.status(500).send({ error: 'Bundling failed', details: error.message });
            }
        });
  
        app.post('/app/files', async (req, res) => {     
          let packageJsonUpdated = false;
      
          try {
              const files = req.body
              for (const filePath in files) {
                  const normalizedPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
                  const fullPath = path.join(appDir, normalizedPath);
                  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      
                  const newContent = files[filePath].code;
                  let isFileChanged = true;
      
                  // Check if the file already exists and content is different
                  if (fs.existsSync(fullPath)) {
                      const existingContent = fs.readFileSync(fullPath, 'utf8');
                      if (existingContent === newContent) {
                          isFileChanged = false;
                      }
                  }
      
                  // Write the file only if there is a change
                  if (isFileChanged) {
                      fs.writeFileSync(fullPath, newContent);
      
                      if (normalizedPath === 'package.json') {
                          packageJsonUpdated = true;
                      }
                  }
              }
      
              if (packageJsonUpdated) {
                  console.log('Updating dependencies...');
                  const result = cp.spawnSync('npm', ['install'], { cwd: appDir, stdio: DEBUG ? 'inherit' : null });
                  if (result.error) {
                      throw result.error;
                  }
              }
      
              res.send({ message: 'Files written to .app directory' });
          } catch (error) {
              res.status(500).send({ error: 'Error processing files', details: error.message });
          }
      });
  
      app.post('/tests/files', async (req, res) => {    
          let packageJsonUpdated = false;
      
          try {
              const files = req.body
              for (const filePath in files) {
                  const normalizedPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
                  const fullPath = path.join(testsDir, normalizedPath);
                  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      
                  const newContent = files[filePath].code;
                  let isFileChanged = true;
      
                  if (fs.existsSync(fullPath)) {
                      const existingContent = fs.readFileSync(fullPath, 'utf8');
                      if (existingContent === newContent) {
                          isFileChanged = false;
                      }
                  }
      
                  if (isFileChanged) {
                      fs.writeFileSync(fullPath, newContent);
      
                      if (normalizedPath === 'package.json') {
                          packageJsonUpdated = true;
                      }
                  }
              }
      
              if (packageJsonUpdated) {
                  console.log('Updating dependencies...');
                  const result = cp.spawnSync('npm', ['install'], { cwd: testsDir, stdio: DEBUG ? 'inherit' : null });
                  if (result.error) {
                      throw result.error;
                  }
              }
      
              res.send({ message: 'Files written to .tests directory' });
          } catch (error) {
              res.status(500).send({ error: 'Error processing files', details: error.message });
          }
      });
    
          
        app.listen(port, () => {
            console.log("Server running");
        });`,
    },
  },
  "package.json": {
    file: {
      contents: JSON.stringify({
        name: "example-app",
        type: "module",
        dependencies: {
          express: "latest",
          //   nodemon: "latest",
          cors: "latest",
          //   pnpm: "latest",
        },
        scripts: {
          //   start: "nodemon index.js",
          start: "node index.js",
        },
      }),
    },
  },
};
