let watcherId: number | null = null;

export const startWatching = (username: string) => {
  if (!('geolocation' in navigator)) return null;
  try {
    watcherId = navigator.geolocation.watchPosition(
      (pos) => {
        try {
          const raw = localStorage.getItem('user_locations');
          const locations = raw ? JSON.parse(raw) : [];
          const entry = {
            username,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            timestamp: new Date().toISOString()
          };
          // keep only latest per user
          const filtered = locations.filter((l: any) => l.username !== username);
          filtered.push(entry);
          localStorage.setItem('user_locations', JSON.stringify(filtered));
        } catch (e) {
          // ignore storage errors
        }
      },
      (err) => {
        // ignore geolocation errors
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
