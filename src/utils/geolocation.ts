let watcherId: number | null = null;

async function postLocation(payload: any) {
  try {
    await fetch('http://localhost:4000/api/locations', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
  } catch (e) {
    // ignore if server unavailable; fall back to localStorage
    try {
      const raw = localStorage.getItem('user_locations');
      const locations = raw ? JSON.parse(raw) : [];
      const filtered = locations.filter((l: any) => l.username !== payload.username);
      filtered.push(payload);
      localStorage.setItem('user_locations', JSON.stringify(filtered));
    } catch {}
  }
}

export const startWatching = (username: string) => {
  if (!('geolocation' in navigator)) return null;
  try {
    watcherId = navigator.geolocation.watchPosition(
      (pos) => {
        const entry = {
          username,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: new Date().toISOString()
        };
        postLocation(entry);
      },
      (err) => {
        console.warn('Geolocation error', err);
      },
      { enableHighAccuracy: true, maximumAge: 5000 }
    );
    return watcherId;
  } catch {
    return null;
  }
};

export const stopWatching = () => {
  try {
    if (watcherId !== null && 'geolocation' in navigator) {
      navigator.geolocation.clearWatch(watcherId);
      watcherId = null;
    }
  } catch {
    // ignore
  }
};
