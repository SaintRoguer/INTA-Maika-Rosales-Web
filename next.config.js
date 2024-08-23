const withPlugins = require("next-compose-plugins");
const withImages = require("next/image");
//const withSass = require("@zeit/next-sass");
//const withCSS = require("@zeit/next-css");
const webpack = require("webpack");
const path = require("path");

module.exports = withPlugins([[withImages]], {
  webpack(config, options) {
    const env = Object.keys(process.env).reduce((acc, curr) => {
      acc[`process.env.${curr}`] = JSON.stringify(process.env[curr]);
      return acc;
    }, {});

    config.plugins.push(new webpack.DefinePlugin(env));
    config.resolve.modules.push(path.resolve("./"));

    return config;
  },
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 500],
    domains: ["cgsweb.vercel.app", "holajj.vercel.app"],
    path: "/_next/image",
    loader: "default",
  },
});
