import { TemplateOptions } from "../..";
import { LibraryTemplateType } from "../../library";
import { renderFiles } from "../../utils";

const files = {
  ".eslintrc.cjs": {
    code: require("!!raw-loader!./files/.eslintrc.cjs").default,
  },
  ".gitignore": {
    code: require("!!raw-loader!./files/.gitignore").default,
  },
  "README.md": {
    code: require("!!raw-loader!./files/README.md").default,
  },
  "index.html": {
    code: require("!!raw-loader!./files/index.html").default,
  },
  "package.json": {
    code: require("!!raw-loader!./files/package.json").default,
  },
  "public/vite.svg": {
    code: require("!!raw-loader!./files/public/vite.svg").default,
  },
  "src/App.tsx": {
    code: require("!!raw-loader!./files/src/App.tsx").default,
  },
  "src/index.css": {
    code: require("!!raw-loader!./files/src/index.css").default,
  },
  "src/main.tsx": {
    code: require("!!raw-loader!./files/src/main.tsx").default,
  },
  // "src/vite-env.d.ts": {
  //   code: require("!!raw-loader!./files/src/vite-env.d.ts").default,
  // },
  "tsconfig.json": {
    code: require("!!raw-loader!./files/tsconfig.json").default,
  },
  "tsconfig.node.json": {
    code: require("!!raw-loader!./files/tsconfig.node.json").default,
  },
  "vite.config.ts": {
    code: require("!!raw-loader!./files/vite.config.ts").default,
  },
};

const getAppTsx = (options: TemplateOptions) => {
  if (options.library === LibraryTemplateType.React)
    return `import { useState } from "react";
import { Button } from "${options.name}";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="center overlay">
      <h1>Count: {count}</h1>
      <Button
        onClick={() => setCount(count => count + 1)}
      >
        Increment
      </Button>
    </div>
  );
}

export default App;
  `;

  if (options.library === LibraryTemplateType.Typescript)
    return `import { useState } from "react";
import { add, subtract } from "${options.name}";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button
          onClick={() => setCount((currentCount) => add(currentCount, 1))}
        >
          count is {count}
        </button>
        <button
          onClick={() => setCount((currentCount) => subtract(currentCount, 1))}
        >
          Decrement
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
  `;
};

export const getFiles = (options: TemplateOptions) => {
  return renderFiles(
    {
      ...files,
      "src/App.tsx": {
        code: getAppTsx(options) as string,
      },
    },
    {
      name: options.name,
    }
  );
};
