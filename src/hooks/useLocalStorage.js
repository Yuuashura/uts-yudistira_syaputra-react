import { useEffect, useRef, useState } from 'react';

export const STORAGE_VERSION = 1;
const storageMessage = 'Penyimpanan lokal tidak tersedia. Perubahan hanya tersimpan selama sesi ini.';

/** Storage is injected to make corruption, blocked access, and quota failures testable. */
export function readStoredValue(storage, key, fallback, validator) {
  try {
    const raw = storage.getItem(key);
    if (raw === null) return { value: fallback, error: null };
    const envelope = JSON.parse(raw);
    if (!envelope || typeof envelope !== 'object' || Array.isArray(envelope)
      || envelope.version !== STORAGE_VERSION || !Object.hasOwn(envelope, 'value')
      || (validator && !validator(envelope.value))) {
      return { value: fallback, error: 'Data tersimpan tidak sesuai atau rusak. Data awal dipulihkan.' };
    }
    return { value: envelope.value, error: null };
  } catch (error) {
    return { value: fallback, error: error instanceof SyntaxError
      ? 'Data tersimpan rusak. Data awal dipulihkan.' : storageMessage };
  }
}

export function writeStoredValue(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify({ version: STORAGE_VERSION, value }));
    return null;
  } catch {
    return storageMessage;
  }
}

/** Use a stable key for each mounted hook. Values use a { version, value } envelope. */
export function useLocalStorage(key, initialValue, validator) {
  const initial = useRef(null);
  if (initial.current === null) {
    const fallback = typeof initialValue === 'function' ? initialValue() : initialValue;
    try {
      initial.current = typeof window === 'undefined'
        ? { value: fallback, error: null }
        : readStoredValue(window.localStorage, key, fallback, validator);
    } catch {
      initial.current = { value: fallback, error: storageMessage };
    }
  }
  const [value, setValue] = useState(initial.current.value);
  const [error, setError] = useState(initial.current.error);
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const failure = writeStoredValue(window.localStorage, key, value);
      if (failure) setError(failure);
    } catch {
      setError(storageMessage);
    }
  }, [key, value]);
  return [value, setValue, error];
}

export default useLocalStorage;
