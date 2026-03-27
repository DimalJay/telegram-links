import React from 'react';

const KEY = 'top-telegram-links.adultConfirmed.v1';
const EVENT = 'adult-confirmed';

function readConfirmed() {
  try {
    return localStorage.getItem(KEY) === 'true';
  } catch {
    return false;
  }
}

function writeConfirmed(value) {
  try {
    localStorage.setItem(KEY, value ? 'true' : 'false');
  } catch {
    // ignore
  }
}

export function useAdultGate() {
  const [confirmed, setConfirmed] = React.useState(() => readConfirmed());

  React.useEffect(() => {
    const onEvent = () => setConfirmed(readConfirmed());
    window.addEventListener(EVENT, onEvent);
    window.addEventListener('storage', onEvent);
    return () => {
      window.removeEventListener(EVENT, onEvent);
      window.removeEventListener('storage', onEvent);
    };
  }, []);

  const confirm = React.useCallback(() => {
    writeConfirmed(true);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { confirmed, confirm };
}
