import { resolve } from "path";
import { writeFileSync, mkdir } from "fs";

export default ({ DEV }) => ({ assets, assetsByChunkName, hash }, { compiler }) => {
  const formatedAssets = Object.keys(assetsByChunkName).reduce((obj, key) => {
    const asset =
      assetsByChunkName[key] instanceof Array ? assetsByChunkName[key][0] : assetsByChunkName[key];

    const ext = asset.match(DEV ? /\.\w{2,4}/ : /\.\w{2,4}$/)[0].replace(/\./, "");

    return { ...obj, [key]: { [ext]: asset } };
  }, {});

  const distDir = resolve(__dirname, "..", "dist");

  // Aditional Assets File for Server comsumption
  const generateFile = () =>
    writeFileSync(`${distDir}/assets.js`, `module.exports=${JSON.stringify(formatedAssets)}`);

  try {
    generateFile();
  } catch (e) {
    if (e.code === "ENOENT") {
      mkdir(distDir, generateFile);
    }
  }

  const { publicPath } = compiler.options.output;

  // Assets Map File for Service Worker
  const assetsMap = assets
    .map(a => a.name)
    .filter(a => !/worker/.test(a))
    .map(a => `${publicPath}${a.split("?")[0]}`);

  return `self.staticAssets=${JSON.stringify({ hash, assets: assetsMap })}`;
};
