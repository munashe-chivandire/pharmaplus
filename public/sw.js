/**
 * PharmPlus Service Worker
 * Handles caching, offline support, and push notifications
 */

const CACHE_NAME = "pharmplus-v1"
const STATIC_CACHE = "pharmplus-static-v1"
const DYNAMIC_CACHE = "pharmplus-dynamic-v1"

// Assets to cache immediately on install
const STATIC_ASSETS = [
  "/",
  "/offline",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
]

// API routes that should use network-first strategy
const API_ROUTES = ["/api/"]

// Cache-first routes (static assets)
const CACHE_FIRST_ROUTES = [
  "/icons/",
  "/images/",
  "/_next/static/",
  "/fonts/",
]

/**
 * Install event - cache static assets
 */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Caching static assets")
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => self.skipWaiting())
  )
})

/**
 * Activate event - clean up old caches
 */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map((name) => caches.delete(name))
      )
    })
  )
  return self.clients.claim()
})

/**
 * Fetch event - handle network requests
 */
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== "GET") return

  // Skip cross-origin requests
  if (url.origin !== location.origin) return

  // API requests - network first, cache fallback
  if (API_ROUTES.some((route) => url.pathname.startsWith(route))) {
    event.respondWith(networkFirst(request))
    return
  }

  // Static assets - cache first, network fallback
  if (CACHE_FIRST_ROUTES.some((route) => url.pathname.includes(route))) {
    event.respondWith(cacheFirst(request))
    return
  }

  // HTML pages - network first with offline fallback
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(networkFirstWithOffline(request))
    return
  }

  // Default - stale while revalidate
  event.respondWith(staleWhileRevalidate(request))
})

/**
 * Network first strategy
 */
async function networkFirst(request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    const cached = await caches.match(request)
    if (cached) return cached
    throw error
  }
}

/**
 * Cache first strategy
 */
async function cacheFirst(request) {
  const cached = await caches.match(request)
  if (cached) return cached

  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    // Return a fallback if available
    return caches.match("/offline")
  }
}

/**
 * Network first with offline page fallback
 */
async function networkFirstWithOffline(request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    const cached = await caches.match(request)
    if (cached) return cached
    return caches.match("/offline")
  }
}

/**
 * Stale while revalidate strategy
 */
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request)

  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      const cache = caches.open(DYNAMIC_CACHE)
      cache.then((c) => c.put(request, response.clone()))
    }
    return response
  })

  return cached || fetchPromise
}

/**
 * Push notification handler
 */
self.addEventListener("push", (event) => {
  if (!event.data) return

  const data = event.data.json()
  const options = {
    body: data.body || "You have a new notification",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/badge-72x72.png",
    vibrate: [100, 50, 100],
    data: {
      url: data.url || "/",
      dateOfArrival: Date.now(),
    },
    actions: data.actions || [
      { action: "view", title: "View" },
      { action: "dismiss", title: "Dismiss" },
    ],
    tag: data.tag || "default",
    renotify: true,
  }

  event.waitUntil(
    self.registration.showNotification(data.title || "PharmPlus", options)
  )
})

/**
 * Notification click handler
 */
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.action === "dismiss") return

  const url = event.notification.data?.url || "/"

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Focus existing window if open
      for (const client of clientList) {
        if (client.url === url && "focus" in client) {
          return client.focus()
        }
      }
      // Open new window
      return clients.openWindow(url)
    })
  )
})

/**
 * Background sync handler
 */
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-claims") {
    event.waitUntil(syncClaims())
  }
  if (event.tag === "sync-notifications") {
    event.waitUntil(syncNotifications())
  }
})

/**
 * Sync pending claims when back online
 */
async function syncClaims() {
  try {
    const db = await openDB()
    const pendingClaims = await db.getAll("pending-claims")

    for (const claim of pendingClaims) {
      await fetch("/api/v1/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(claim),
      })
      await db.delete("pending-claims", claim.id)
    }
  } catch (error) {
    console.error("Failed to sync claims:", error)
  }
}

/**
 * Sync notification preferences
 */
async function syncNotifications() {
  // Implementation for syncing notification preferences
}

/**
 * Simple IndexedDB helper
 */
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("pharmplus-offline", 1)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const db = request.result
      resolve({
        getAll: (store) =>
          new Promise((res, rej) => {
            const tx = db.transaction(store, "readonly")
            const req = tx.objectStore(store).getAll()
            req.onsuccess = () => res(req.result)
            req.onerror = () => rej(req.error)
          }),
        delete: (store, key) =>
          new Promise((res, rej) => {
            const tx = db.transaction(store, "readwrite")
            const req = tx.objectStore(store).delete(key)
            req.onsuccess = () => res()
            req.onerror = () => rej(req.error)
          }),
      })
    }
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains("pending-claims")) {
        db.createObjectStore("pending-claims", { keyPath: "id" })
      }
    }
  })
}

console.log("PharmPlus Service Worker loaded")
