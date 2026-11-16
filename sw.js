// 让时间表离线也能打开：第一次联网打开时把页面存起来，之后没网也能用。
const CACHE = "timetable-m1";
const CORE = ["./", "./index.html", "./apple-touch-icon.png", "./icon-512.png", "./manifest.webmanifest", "./room.jpg", "./treasure-chest-icon.png"];
// 只缓存这些地方的文件：你自己的网站、字体、Firebase 的程序库。登录和数据库的请求一律不碰。
const CACHEABLE = u =>
  (u.origin === location.origin && !u.pathname.startsWith("/__/")) ||
  u.hostname === "fonts.googleapis.com" || u.hostname === "fonts.gstatic.com" ||
  (u.hostname === "www.gstatic.com" && u.pathname.startsWith("/firebasejs/"));

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (!CACHEABLE(url)) return;                       // 登录页面、数据库：直接走网络
  if (req.mode === "navigate") {                     // 打开页面：有网拿最新，没网用存好的
    e.respondWith(
      fetch(req).then(res => {
        if (res.ok && (url.pathname === "/" || url.pathname.endsWith("/index.html"))) {
          const copy = res.clone(); caches.open(CACHE).then(c => c.put("./index.html", copy));
        }
        return res;
      }).catch(() => caches.match("./index.html").then(m => m || caches.match("./")))
    );
    return;
  }
  e.respondWith(caches.match(req).then(hit => {      // 图标、字体、程序库：先用存好的，后台更新
    const net = fetch(req).then(res => {
      if (res && (res.ok || res.type === "opaque")) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => hit);
    return hit || net;
  }));
});
