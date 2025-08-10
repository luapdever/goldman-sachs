console.log('[SW] Push service worker');

self.addEventListener('install', function (event) {
    console.log('[SW] Installed');
});
  
self.addEventListener('activate', function (event) {
    console.log('[SW] Activated');
});

self.addEventListener("push", (event) => { 
    let data = "";
    try {
        data = event.data.json();

        if(typeof(data) == "string") {
            data = JSON.parse(event.data.json());
        }
    } catch (error) {
        console.warn(error);
        data = event.data.text() ?? "...";
    }

    // Check if some app window is already open
    self.clients.matchAll({ type: 'window' }).then(clients => {
        const is_app_in_foreground = clients.some(client => client.focused);
    
        if (is_app_in_foreground) {
            console.log("[SW] New silence notification");
            return
        }
        
        // IF NOT show notification
        self.registration.showNotification(
            data.title ?? "Goldman Sachs",
            {
                body: data.body ?? data,
                icon: "./img/icons/logo-gs-192.png",
                data: data,
            }
        )

        self.clients.matchAll({ type: 'window' }).then(function(clients) {
            clients.forEach(function(client) {
                client.postMessage({ action: 'playSound' });
            });
        });
    });
});

// LISTEN TO NOTIFIACATION CLICK EVENT
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
  
    let routeUrl = '/route-notification/';
    
    if(event.notification.data && event.notification.data.data) {
        // DO SOMETHING
    }

    event.waitUntil(
        // Check if some app window is already open
        self.clients.matchAll({ type: 'window' }).then(clients => {   
            // IF TRUE THEN MAKE CLIENT NAVIGATOR FOCUSED         
            for (const client of clients) {
                if (client.url.includes(location.host)) {
                    client.navigate(routeUrl);
                    client.focus();
                    return;
                }
            }
            
            // IF NOT OPEN NEW WINDOW
            if (clients.openWindow) {
                return self.clients.openWindow(routeUrl);
            } else {
                self.registration.showNotification(
                    "Autorisation",
                    {
                        body: "Veuillez autoriser pour cette application l'ouverture des fenêtres pour voir les détails.",
                        icon: "./img/icons/logo-gs-192.png",
                    }
                )
            }
        })
    );
  
});