import { useState } from 'react';

const STORAGE_KEY = 'cook-timer.sleep-warning-dismissed.v1';

export default function SleepWarning() {
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(STORAGE_KEY) === '1');

  if (dismissed) return null;

  return (
    <div className="sleep-warning" role="note">
      <span>
        <strong>Keep your laptop awake.</strong> If it sleeps, timers can't fire on time — that's an
        OS-level limit, not a bug in the app.
      </span>
      <button
        type="button"
        className="sleep-warning__close"
        onClick={() => {
          localStorage.setItem(STORAGE_KEY, '1');
          setDismissed(true);
        }}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
