// Surojbek hamyoni: internetsiz ishlash uchun keshlash. Versiya: 5
const C='hamyon-5';
const SHELL=["./", "./index.html", "./manifest.webmanifest", "./icon-180.png", "./icon-192.png", "./icon-512.png", "./fonts/onest-latin-400-normal.woff2", "./fonts/onest-latin-ext-400-normal.woff2", "./fonts/onest-latin-500-normal.woff2", "./fonts/onest-latin-ext-500-normal.woff2", "./fonts/onest-latin-600-normal.woff2", "./fonts/onest-latin-ext-600-normal.woff2", "./fonts/onest-latin-700-normal.woff2", "./fonts/onest-latin-ext-700-normal.woff2", "./fonts/unbounded-latin-500-normal.woff2", "./fonts/unbounded-latin-ext-500-normal.woff2", "./fonts/unbounded-latin-700-normal.woff2", "./fonts/unbounded-latin-ext-700-normal.woff2"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
const timeout=(p,ms)=>Promise.race([p,new Promise((_,no)=>setTimeout(()=>no(new Error('timeout')),ms))]);
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);if(u.origin!==self.location.origin)return;
  if(r.mode==='navigate'){
    // internet bo'lsa yangi versiya, bo'lmasa keshdagisi
    e.respondWith(timeout(fetch(r),4000).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put('./index.html',cp));}return res;})
      .catch(()=>caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));}return res;})));
});
