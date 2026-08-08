import { useEffect, useRef } from 'react';

// Vite only exposes env vars prefixed VITE_ to client code — this is a
// public OAuth Client ID, safe to ship in the bundle (unlike a secret).
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Renders Google's own "Sign in with Google" button via Google Identity
// Services (loaded globally in index.html). Hidden entirely if no client ID
// is configured, so the rest of auth keeps working without it.
export default function GoogleSignInButton({ onCredential }) {
  const btnRef = useRef(null);
  const callbackRef = useRef(onCredential);
  callbackRef.current = onCredential;

  useEffect(() => {
    if (!CLIENT_ID) return;
    let cancelled = false;
    let pollId;

    function init() {
      if (cancelled || !window.google?.accounts?.id || !btnRef.current) return;
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: (response) => callbackRef.current(response.credential),
      });
      window.google.accounts.id.renderButton(btnRef.current, {
        theme: 'filled_black',
        size: 'large',
        width: 320,
        text: 'continue_with',
        shape: 'rectangular',
      });
    }

    // The GIS <script> tag is async — it may not have finished loading yet.
    if (window.google?.accounts?.id) {
      init();
    } else {
      pollId = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(pollId);
          init();
        }
      }, 100);
    }

    return () => {
      cancelled = true;
      if (pollId) clearInterval(pollId);
    };
  }, []);

  if (!CLIENT_ID) return null;

  return <div ref={btnRef} className="google-btn" />;
}
