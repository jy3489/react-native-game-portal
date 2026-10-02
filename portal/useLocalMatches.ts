import { useEffect, useRef, useState } from 'react';
import { LocalMatch, createMatch, moveInMatch } from './matches';
import { matchStorage, nextMatchId } from './matchStorage';

export default function useLocalMatches() {
  const [matches, setMatches] = useState<LocalMatch[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saving' | 'saved' | 'error'>('saved');
  const [retry, setRetry] = useState(0);
  const nextId = useRef(1);

  useEffect(() => {
    let cancelled = false;
    setLoadError(false);
    matchStorage.load().then(restored => {
      if (cancelled) return;
      nextId.current = nextMatchId(restored);
      setMatches(restored);
      setLoaded(true);
    }).catch(() => {
      if (!cancelled) setLoadError(true);
    });
    return () => { cancelled = true; };
  }, [retry]);

  useEffect(() => {
    if (!loaded) return; // Never overwrite saved records with the initial empty array.
    let cancelled = false;
    setSaveStatus('saving');
    matchStorage.save(matches).then(() => {
      if (!cancelled) setSaveStatus('saved');
    }).catch(() => {
      if (!cancelled) setSaveStatus('error');
    });
    return () => { cancelled = true; };
  }, [matches, loaded]);

  function startMatch(): string {
    const match = createMatch(String(nextId.current++));
    setMatches(current => [...current, match]);
    return match.id;
  }

  return {
    matches, loaded, loadError, saveStatus,
    retryLoad: () => setRetry(current => current + 1),
    startMatch,
    move: (id: string, index: number) => setMatches(current => moveInMatch(current, id, index)),
  };
}
