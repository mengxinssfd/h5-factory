// css不分离 vite打包后会有点问题  使用该脚本修复

const Path = require('path');
const Fs = require('fs');

const path = Path.resolve(__dirname, '../dist/components.umd.js');

let fileContent = Fs.readFileSync(path).toString();

fileContent = fileContent.replace('"use strict";`;', '"use strict";');
fileContent = fileContent.replace('(function(', '`;(function(');
Fs.writeFileSync(path, fileContent);
