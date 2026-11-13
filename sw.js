// ============================================================
// SERVICE WORKER: ADMINISTRACIÓN DE CACHÉ OFFLINE Y CICLO DE VIDA
// ============================================================
// Estrategia híbrida:
// 1. Documento HTML (navegación): Network-first con fallback a caché (garantiza versión fresca al estar online).
// 2. Recursos estáticos (assets): Cache-first con actualización en segundo plano vía fetch.
// 3. Purga administrativa: al activarse una nueva versión (v22), se eliminan automáticamente cachés obsoletas.

const CACHE = "checklist-v23";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./cat-day.png",
  "./cat-night.png"
];

// Instalación: precarga de activos esenciales y activación inmediata (skipWaiting).
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

// Activación: purga de cachés anteriores y toma de control de clientes activos (clients.claim).
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Intercepción de solicitudes de red (fetch):
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;

  // Navegación/documento: red primero (versión fresca); si falla, caché.
  if (e.request.mode === "navigate" || e.request.destination === "document") {
    e.respondWith(
      fetch(e.request, { cache: "no-store" }).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      }).catch(() => caches.match(e.request).then(cached => cached || caches.match("./index.html")))
    );
    return;
  }

  // Resto de assets: cache primero; si no está en caché, red y luego guardar la copia.
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    })).catch(() => caches.match("./index.html"))
  );
});
