const CACHE = 'babyvax-v3';

// ── Install ──────────────────────────────────────────────────────────────────
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./']).catch(() => {})));
});

// ── Activate ─────────────────────────────────────────────────────────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// ── Fetch (offline caching) ───────────────────────────────────────────────────
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(r =>
      r || fetch(e.request).then(res => {
        if (!res || res.status !== 200 || res.type !== 'basic') return res;
        const c = res.clone();
        caches.open(CACHE).then(ca => ca.put(e.request, c));
        return res;
      }).catch(() => caches.match(self.registration.scope))
    )
  );
});

// ── Periodic Background Sync (Chrome Android — fires daily when app is closed) ─
self.addEventListener('periodicsync', e => {
  if (e.tag === 'daily-vaccine-check') {
    e.waitUntil(checkAndNotify());
  }
});

// ── Background Sync (fires when connectivity restored) ────────────────────────
self.addEventListener('sync', e => {
  if (e.tag === 'check-vaccine-reminders') {
    e.waitUntil(checkAndNotify());
  }
});

// ── Push (for future server-side push) ───────────────────────────────────────
self.addEventListener('push', e => {
  let data = { title: '💉 Vaccine Tomorrow!', body: 'A vaccination is due tomorrow.' };
  try { if (e.data) data = { ...data, ...e.data.json() }; } catch (_) {}
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      tag: 'vaccine-push',
      requireInteraction: true,
      vibrate: [200, 100, 200],
      data: { url: self.registration.scope }
    })
  );
});

// ── Notification click ────────────────────────────────────────────────────────
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || self.registration.scope;
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if ('focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// ── Core check: read schedule from IDB and notify for tomorrow ────────────────
async function checkAndNotify() {
  let entries = [];
  try { entries = await idbGetAll(); } catch (_) { return; }
  if (!entries || entries.length === 0) return;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tStr = tomorrow.toISOString().split('T')[0];

  for (const v of entries) {
    if (v.date !== tStr) continue;
    const tag = 'bvax-' + v.date + '-' + (v.name || '').replace(/\s/g, '-');
    const existing = await self.registration.getNotifications({ tag });
    if (existing.length > 0) continue;
    await self.registration.showNotification(
      '💉 Vaccine Tomorrow — ' + (v.babyName || 'Baby'),
      {
        body: (v.name || 'A vaccine') + ' is due tomorrow (' + fmtDate(v.date) + ').',
        tag,
        requireInteraction: true,
        vibrate: [200, 100, 200],
        data: { url: self.registration.scope }
      }
    );
  }
}

// ── IndexedDB helpers (inside SW scope) ──────────────────────────────────────
function idbGetAll() {
  return new Promise((res, rej) => {
    const req = indexedDB.open('BabyVaxDB', 1);
    req.onerror = () => rej(req.error);
    req.onsuccess = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('schedule')) { res([]); return; }
      const tx = db.transaction('schedule', 'readonly');
      const store = tx.objectStore('schedule');
      const all = store.getAll();
      all.onsuccess = () => res(all.result || []);
      all.onerror = () => rej(all.error);
    };
    req.onupgradeneeded = ev => {
      const db = ev.target.result;
      if (!db.objectStoreNames.contains('schedule')) {
        db.createObjectStore('schedule', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

function fmtDate(dateStr) {
  try {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  } catch (_) { return dateStr; }
}
