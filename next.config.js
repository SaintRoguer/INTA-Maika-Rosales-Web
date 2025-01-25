//const withPlugins = require("next-compose-plugins");
//const withImages = require("next-images");
//const withSass = require("@zeit/next-sass");
//const withCSS = require("@zeit/next-css");
const webpack = require("webpack");
const path = require("path");
//const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = async (phase, { defaultConfig }) => {
  const nextConfig = {
    // Configuración para imágenes
    images: {
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 500],
      domains: ["cgsweb.vercel.app", "holajj.vercel.app"],
      path: "/_next/image",
      loader: "default",
    },

    // Habilitar minificación con SWC
    swcMinify: true,
    
    // Personalización de Webpack
    webpack(config, options) {

      //config.plugins.push(new NodePolyfillPlugin());

      config.experiments = {
        ...config.experiments, // Mantener otras configuraciones de experimentos
        asyncWebAssembly: true,
      };
      // Agregar polyfills para módulos de Node.js
    config.resolve.fallback = {
      ...config.resolve.fallback,
      events: require.resolve("events/"), // Polyfill para node:events
      util: require.resolve("util/"), // Polyfill para node:util
      stream: require.resolve("stream-browserify"), // Polyfill para node:stream
    };

    // Agregar plugins necesarios para Webpack
    config.plugins.push(
      new webpack.ProvidePlugin({
        process: "process/browser", // Polyfill para process
        Buffer: ["buffer", "Buffer"], // Polyfill para Buffer
      })
    );

      config.resolve.modules.push(path.resolve("./"));
      return config;
    },
  };

  return nextConfig;
};

/* 
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
   swcMinify: true,
});
*/
