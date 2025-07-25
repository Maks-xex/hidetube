const path = require("path");
const StyleLintPlugin = require("stylelint-webpack-plugin");

module.exports = {
  webpack: {
    configure: (webpackConfig, { _, paths }) => {
      webpackConfig.plugins.push(
        new StyleLintPlugin({
          context: path.resolve(__dirname, "src"),
          files: ["**/*.css", "**/*.scss"],
          configFile: path.resolve(__dirname, ".stylelintrc.json"),
        }),
      );

      return {
        ...webpackConfig,
        entry: {
          main: [paths.appIndexJs].filter(Boolean),
          content: "./src/chrome/content.ts",
          background: "./src/chrome/background.ts",
        },
        output: {
          ...webpackConfig.output,
          filename: "static/js/[name].js",
        },
        optimization: {
          ...webpackConfig.optimization,
          runtimeChunk: false,
        },
        plugins: webpackConfig.plugins.filter((plugin) => plugin.constructor.name !== "GenerateSW"),
      };
    },
  },
};
