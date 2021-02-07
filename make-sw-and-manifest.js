//Файл для автоматического создания service worker и manifest для игры
//Сменить цвет игры
const gameColor = "#DF9566";
const { promises: fsp } = require('fs');

var fs = require('fs');
var path = require('path');


let notIncludesFiles = ['.DS_Store', 'manifest-icon.png', 'yandex-manifest.json', 'precache-manifest', 'asset-manifest', 'sw.js', 'service-worker.js'];
let notEndFiles = ['.map', 'LICENSE.txt'];
function isFileGood(name) {
    for(let i = 0; i < notIncludesFiles.length; i++){
        if(name.indexOf(notIncludesFiles[i]) !== -1) return false;
    }
    for(let i = 0; i < notEndFiles.length; i++){
        if(name.substr(-notEndFiles[i].length) === notEndFiles[i]) {
            return false;
        }
    }
    return true
}
var getFiles = function (dir, files_){

    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
};

let allFiles = getFiles('./build');
allFiles = allFiles.filter((file)=>{
    return isFileGood(file);
});
allFiles = allFiles.map((file) => {
    return '"' + file.replace('./build/', '') + '"';
});

const allFilesString = allFiles.join(',\n');
const version = Date.now();




const  contentSW = `var CACHE_NAME = 'game-v${version}';

this.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll([${allFilesString}]);
        })
    );
});
var CACHE_PREFIX = 'brainGame}';

this.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (0 === cacheName.indexOf(CACHE_PREFIX)
                        && cacheName !== CACHE_NAME) return caches.delete(cacheName);
                })
            );
        })
    );
});

this.addEventListener('fetch', function (event) {
    if (
        event.request.method !== 'GET' ||
        event.request.url.indexOf('http://') === 0 ||
        event.request.url.indexOf('an.yandex.ru') !== -1
    ) {
        return;
    }
    event.respondWith(
        caches.match(event.request, {ignoreSearch: true}).then(function(response) {
            return response || fetch(event.request);
        })
    );
});
`;

const contentManifest = `
{
  "icons": [{
    "src": "manifest-icon.png",
    "sizes": "512x512",
    "type": "image/png"
  }],
  "yandex": {
    "splash_screen_color": "${gameColor}",
    "cache": {
      "resources": [
        ${allFilesString}
      ]
    }
  }
}
`;


fsp.writeFile(path.join(__dirname, 'build/sw.js'), contentSW);
fsp.writeFile(path.join(__dirname, 'build/yandex-manifest.json'), contentManifest);
