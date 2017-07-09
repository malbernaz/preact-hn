import { resolve, extname } from "path";
import { writeFileSync, mkdir } from "fs";

export default () => ({ assets, assetsByChunkName, hash }, { compiler }) => {
  const formatedAssets = assets.reduce((obj, asset) => {
    const ext = extname(asset.name).replace(".", "");
    if (ext === "map") return obj;
    const [chunkName] = asset.chunkNames.filter(n => !/(hot-update|sockjs-node)/.test(n));
    const file = Array.isArray(assetsByChunkName[chunkName])
      ? assetsByChunkName[chunkName][0]
      : assetsByChunkName[chunkName];
    return { ...obj, [chunkName || asset.name]: { [ext]: file || asset.name } };
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
