const path = require("path");
const StyleLintPlugin = require("stylelint-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const isFirefoxBuild = process.env.BUILD_TARGET === "firefox";

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

      webpackConfig.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: isFirefoxBuild
                ? path.resolve(__dirname, "src/manifest/manifest.firefox.json")
                : path.resolve(__dirname, "public/manifest.json"),
              to: path.resolve(__dirname, "build/manifest.json"),
            },
          ],
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
