export default {
  loader: "babel-loader",
  options: {
    babelrc: false,
    presets: [
      [
        "env",
        {
          loose: true,
          modules: false,
          targets: {
            chrome: 58,
            edge: 14,
            firefox: 53,
            safari: 10,
            node: "current"
          },
          exclude: [
            "transform-async-to-generator",
            "transform-regenerator",
            "transform-es2015-typeof-symbol"
          ]
        }
      ]
    ],
    plugins: [
      [
        "fast-async",
        {
          compiler: {
            promises: true,
            noRuntime: true,
            es6target: true,
            sourcemap: false
          }
        }
      ],
      "syntax-dynamic-import",
      "transform-class-properties",
      "transform-decorators-legacy",
      "transform-react-constant-elements",
      ["transform-object-rest-spread", { useBuiltIns: true }],
      ["transform-react-jsx", { pragma: "h" }],
      [
        "jsx-pragmatic",
        {
          module: "preact",
          export: "h",
          import: "h"
        }
      ]
    ]
  }
};
