// Headless Karma config for CI and containers: npm run test:ci (set CHROME_BIN if Chrome is not on PATH).
module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    plugins: [require('karma-jasmine'), require('karma-chrome-launcher')],
    browsers: ['ChromeHeadlessCI'],
    customLaunchers: {ChromeHeadlessCI: {base: 'ChromeHeadless', flags: ['--no-sandbox']}},
    reporters: ['progress'],
    singleRun: true,
  });
};
