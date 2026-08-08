// Desktop notification wrapper. Best-effort: if permission isn't granted
// the app still works via the on-screen flashing card + audio alarm.

export function notificationsSupported() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getPermission() {
  if (!notificationsSupported()) return 'unsupported';
  return Notification.permission;
}

export async function requestPermission() {
  if (!notificationsSupported()) return 'unsupported';
  if (Notification.permission === 'granted' || Notification.permission === 'denied') {
    return Notification.permission;
  }
  try {
    return await Notification.requestPermission();
  } catch {
    return Notification.permission;
  }
}

export function notifyTimerDone(label) {
  if (!notificationsSupported() || Notification.permission !== 'granted') return;
  try {
    const n = new Notification(`⏰ ${label} is done`, {
      body: 'Tap to bring the timer back into view.',
      tag: `cook-timer-${label}`,
      requireInteraction: true,
    });
    n.onclick = () => {
      window.focus();
      n.close();
    };
  } catch {
    // Some platforms (e.g. certain mobile browsers) throw on `new Notification`
    // and require a service-worker-based notification instead — silently
    // fall back to the in-app alarm, which still works.
  }
}