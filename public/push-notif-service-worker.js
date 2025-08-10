console.log('Push service worker');

self.addEventListener("push", (event) => { 
    let data = event.data.json();

    if(typeof(data) == "string") {
        data = JSON.parse(event.data.json());
    }

    self.clients.matchAll({ type: 'window' }).then(clients => {
        const is_app_in_foreground = clients.some(client => client.focused);
    
        if (is_app_in_foreground) {
            return
        }
        
        // event.waitUntil(
            self.registration.showNotification(
                data.title,
                {
                    body: data.body,
                    icon: "./img/icons/logo-gs-192.png",
                    data: { ...data }
                }
            )
        // );
    });
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
  
    let routeUrl = '/machines/';
    
    if(event.notification.data && event.notification.data.data) {
        let notif_data = event.notification.data.data;
        if(notif_data.ticket_id) {
            routeUrl += notif_data.ticket_id;
        } else if(notif_data.id) {
            routeUrl += notif_data.id;
        }
    }

    event.waitUntil(
        self.clients.matchAll({ type: 'window' }).then(clients => {            
            for (const client of clients) {
                if (client.url.includes(location.host)) {
                    client.navigate(routeUrl);
                    client.focus();
                    return;
                }
            }
            
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