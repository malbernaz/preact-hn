import { resolve } from "path";
import webpack from "webpack";

import { StatsWriterPlugin as StatsPlugin } from "webpack-stats-plugin";
import CopyPlugin from "copy-webpack-plugin";
// import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

import transform from "./stats-transform";
import babelLoader from "./babelConfig";

const { optimize: { CommonsChunkPlugin } } = webpack;

export default ({ DEV, baseConfig }) => ({
  ...baseConfig,
  resolve: {
    ...baseConfig.resolve,
    mainFields: ["jsnext:browser", "jsnext:main", "browser", "main"]
  },
  output: {
    ...baseConfig.output,
    filename: DEV ? "[name].js" : "[name].[hash].js",
    chunkFilename: DEV ? "[name].js" : "[name].[hash].js",
    publicPath: "/"
  },
  module: {
    rules: [
      ...baseConfig.module.rules,
      {
        test: /service-worker\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "worker-loader",
            options: {
              service: true,
              name: DEV ? "service-worker.js" : "service-worker.[hash].js"
            }
          },
          babelLoader
        ]
      },
      {
        test: /\.worker\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "worker-loader",
            options: {
              name: DEV ? "[name].js" : "[name].[hash].js"
            }
          },
          babelLoader
        ]
      }
    ]
  },
  plugins: [
    ...baseConfig.plugins,
    new StatsPlugin({
      filename: "assets.js",
      fields: ["assets", "assetsByChunkName", "hash"],
      transform: transform({ DEV })
    }),
    new CommonsChunkPlugin({
      name: "vendor",
      minChunks: ({ context }) => {
        if (typeof context !== "string") return false;
        return context.indexOf("node_modules") !== -1;
      }
    }),
    new webpack.IgnorePlugin(/lie/, /promise-worker/),
    new CommonsChunkPlugin({
      name: "manifest",
      minChunks: Infinity
    }),
    new CopyPlugin([
      {
        context: resolve(__dirname, "..", "static"),
        from: "**/*",
        to: resolve(__dirname, "..", "dist", "public")
      }
    ]),
    // new BundleAnalyzerPlugin()
    DEV && new webpack.HotModuleReplacementPlugin(),
    DEV && new webpack.NamedModulesPlugin()
  ].filter(Boolean),
  devServer: {
    port: 3001,
    host: "0.0.0.0",
    publicPath: "/",
    clientLogLevel: "error",
    hot: true,
    inline: true,
    proxy: { "*": { target: "http://0.0.0.0:3000" } }
  }
});
