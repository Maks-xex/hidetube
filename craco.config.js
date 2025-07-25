module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
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
