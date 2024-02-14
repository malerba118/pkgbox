Pkgbox is an experimental browser ide for building typescript libraries.

Play with a rudimentary version here => https://pkgbox.vercel.app/

It gives you a stackblitz/codesandbox-like experience with three apps per project:
- **library** - a typescript library that is bundled directly in the browser
- **example** - an example app that your library is installed into
- **tests** - a tests app that your library is installed into

Any time a change is made to the library, pkgbox builds/packs the lib and then installs it into both the example app and the tests app.

https://github.com/malerba118/pkgbox/assets/5760059/e651b36d-6886-4d86-bb4d-f1c624bcfaf9

Pkgbox uses stackblitz web containers to run multiple dev servers in the browser and the cool part is that everything from npm install to rollup happens directly in the browser.

Pkgbox uses monaco with full typescript support. 
Typescript declaration files for all dependencies and src files are provided to monaco which then performs type-checking. 
Auto-imports are also configured.
