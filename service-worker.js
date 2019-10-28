// https://github.com/GoogleChrome/samples/tree/gh-pages/service-worker recipes
const CACHE_VERSION = 1;

const CURRENT_CACHE = ['MultiQ_template_<template_name>' + CACHE_VERSION];
const urlsToCache = [
  '/',
  'https://newsapi.org/v2/top-headlines?country=se&apiKey=a8e51aef0ff44f1091af38f3798b6159'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CURRENT_CACHE).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  // Delete all caches that aren't named in CURRENT_CACHES.
  // While there is only one cache in this example, the same logic will handle the case where
  // there are multiple versioned caches.
  let expectedCacheNamesSet = new Set(Object.values(CURRENT_CACHE));
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (!expectedCacheNamesSet.has(cacheName)) {
            // If this cache name isn't present in the set of "expected" cache names, then delete it.
            console.log('Deleting out of date cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request) // respond from cache if request is cached
    .then(function(response) {
      return fetch(event.request, { // fetch from network
        // mode: 'cors',
        // credentials: 'same-origin',
        // headers: {
        // 'Access-Control-Allow-Origin': '*',
        // 'Content-Type': 'application/json',
        // 'Accept': 'application/json'
        // }
      }).then(function(response) {
        if (response && response.status < 400 && !response.url.includes('chrome-extension')) {
          // response may be used only once, we need to save clone to put one copy in cache
          // and serve second one
          const responseClone = response.clone();
          caches.open(CURRENT_CACHE).then(function(cache) {
            cache.put(event.request, responseClone).catch((error) => console.warn('Cache error:', error.message));
          });
        }

        return response;
      }).catch(function(error) {
        console.log('Error in fetch handler:', error);
        // caches.match() always resolves
        // but in case of success response will have value
        return response;
      });
    }
    ));
});
