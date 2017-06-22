import { readdirSync } from "fs";

export default ({ baseConfig }) => {
  const externals = {
    "./assets": "commonjs ./assets"
  };

  readdirSync("node_modules").filter(x => [".bin"].indexOf(x) === -1).forEach(mod => {
    externals[mod] = `commonjs ${mod}`;
  });

  return {
    ...baseConfig,
    externals,
    target: "node",
    output: {
      ...baseConfig.output,
      filename: "index.js"
    },
    node: {
      __dirname: false,
      __filename: false
    }
  };
};
