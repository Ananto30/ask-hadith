// Copyright 2016 Google Inc.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const CACHE_NAME = 'your-magic-cache';

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll([
                '/',
            ]);
        })
    );
});

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request).then(function(response) {
//       return response || fetch(event.request);
//     })
//   );
// });

self.addEventListener('fetch', function (event) {
    var requestURL = new URL(event.request.url);
    var freshResource = fetch(event.request).then(function (response) {
        var clonedResponse = response.clone();
        // Don't update the cache with error pages!
        if (response.ok) {
            // All good? Update the cache with the network response
            caches.open(CACHE_NAME).then(function (cache) {
                cache.put(event.request, clonedResponse);
            });
        }
        return response;
    });
    var cachedResource = caches.open(CACHE_NAME).then(function (cache) {
        return cache.match(event.request).then(function (response) {
            return response || freshResource;
        });
    }).catch(function (e) {
        return freshResource;
    });
    event.respondWith(cachedResource);
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    // Return true if you want to remove this cache,
                    // but remember that caches are shared across
                    // the whole origin
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});