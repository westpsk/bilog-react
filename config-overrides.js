const {
  override,
} = require('customize-cra');
const ThemeColorReplacer = require('./plugins/src')

// override
module.exports = {
  webpack: override(
    // customize-cra plugins here
    (config) => {
      console.log('config => ', config)
      config.plugins.push(new ThemeColorReplacer())
      return config;
    },
  ),

  jest: config => {
    return config;
  },

  devServer: configFunction => (proxy, allowedHost) => {
    const config = configFunction(proxy, allowedHost);
    return config;
  },

  paths: (paths, env) => {
    return paths;
  }
};