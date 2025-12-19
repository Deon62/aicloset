const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer/expo'),
};

config.resolver = {
  ...config.resolver,
  assetExts: Array.from(new Set([...config.resolver.assetExts.filter((ext) => ext !== 'svg'), 'docx', 'pdf'])),
  sourceExts: [...config.resolver.sourceExts, 'svg'],
};

module.exports = config;
