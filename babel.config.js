module.exports = function (api) {
  api.cache(true);

  const presets = [["es2015", { "modules": false }]];
  const plugins = [[
    "component",
    {
      "libraryName": "element-ui",
      "styleLibraryName": "theme-chalk"
    }
  ]];

  return {
    presets,
    plugins
  };
}