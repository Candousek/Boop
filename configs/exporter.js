const fs = require('fs');
const out = {};

module.exports = (() => {
  const files = fs
    .readdirSync(__dirname)
    .filter(f => ['.js', '.json'].some(e => f.endsWith(e)) && f!= "exporter.js");

  for (const file of files) {
    out[file.replace(/(\.\w+)+$/,"")] = require(`./${file}`);
  }

  return out;
})();