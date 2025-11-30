export function registerSW() {
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker
                .register("/src/workers/sw.js")
                .then(() => console.log("Service Worker Registered"))
                .catch((err) => console.log("SW registration failed:", err));
        });
    }
}
