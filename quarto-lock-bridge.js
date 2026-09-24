(() => {
  const BUILD_ID = "fb58d7a48dc7d71d";
  const KEY_NAME = "quarto-lock:key:" + BUILD_ID;

  function rawKey() {
    try { return sessionStorage.getItem(KEY_NAME); } catch { return null; }
  }

  function sendKey(target) {
    const key = rawKey();
    if (!key || !target) return;
    target.postMessage({ type: "QUARTO_LOCK_SET_KEY", buildId: BUILD_ID, key });
  }

  if (!("serviceWorker" in navigator)) return;

  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data?.type === "QUARTO_LOCK_NEED_KEY" && event.data?.buildId === BUILD_ID) {
      sendKey(event.source || navigator.serviceWorker.controller);
    }
  });

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    sendKey(navigator.serviceWorker.controller);
  });

  sendKey(navigator.serviceWorker.controller);
})();
