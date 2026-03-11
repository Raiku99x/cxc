// ─────────────────────────────────────────────────────────────
// metro.config.js — Metro bundler config
// Required for NativeWind v4 + Expo
// ─────────────────────────────────────────────────────────────

const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind }   = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './src/styles/global.css' });
