self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("notificationclick", event => {
  event.notification.close();

  if (event.action === "snooze") {
    event.waitUntil(new Promise(resolve => {
      setTimeout(() => {
        self.registration.showNotification("Snoozed task reminder", {
          body: "A snoozed task is ready for your attention.",
          tag: `${event.notification.tag || "task"}_snoozed`,
          renotify: true
        }).finally(resolve);
      }, 15 * 60 * 1000);
    }));
    return;
  }

  event.waitUntil((async () => {
    const allClients = await clients.matchAll({ type: "window", includeUncontrolled: true });
    if (allClients.length) {
      await allClients[0].focus();
      return;
    }
    await clients.openWindow("./before.html");
  })());
});
