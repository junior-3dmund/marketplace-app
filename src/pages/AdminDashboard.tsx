import { useEffect, useState, useRef } from 'react';

const AdminDashboard = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [authHeader, setAuthHeader] = useState<string | null>(sessionStorage.getItem('admin_auth'));
  const [apiKey, setApiKey] = useState<string | null>(sessionStorage.getItem('GMAPS_API_KEY'));
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    try {
      const u = localStorage.getItem('marketplace_users');
      setUsers(u ? JSON.parse(u) : []);
    } catch {
      setUsers([]);
    }
    try {
      const t = localStorage.getItem('transactions');
      setTransactions(t ? JSON.parse(t) : []);
    } catch {
      setTransactions([]);
    }
    (async () => {
      try {
        // fetch locations (admin-protected)
        const headers: any = {};
        if (authHeader) headers.authorization = authHeader;
        const res = await fetch('http://localhost:4000/api/locations', { headers });
        if (res.ok) {
          const data = await res.json();
          if (mounted) setLocations(data || []);
        } else {
          const l = localStorage.getItem('user_locations');
          if (mounted) setLocations(l ? JSON.parse(l) : []);
        }
      } catch {
        const l = localStorage.getItem('user_locations');
        if (mounted) setLocations(l ? JSON.parse(l) : []);
      }

      try {
        const res2 = await fetch('http://localhost:4000/api/messages', { headers });
        if (res2.ok) {
          const data2 = await res2.json();
          if (mounted) setMessages(data2 || []);
        } else {
          const m = localStorage.getItem('messages');
          if (mounted) setMessages(m ? JSON.parse(m) : []);
        }
      } catch {
        const m = localStorage.getItem('messages');
        if (mounted) setMessages(m ? JSON.parse(m) : []);
      }
    })();
    return () => { mounted = false };
  }, []);

  useEffect(() => {
    // initialize map when locations or apiKey change
    if (!apiKey || !locations || locations.length === 0) return;
    const loadMap = async () => {
      if (!(window as any).google) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject();
          document.head.appendChild(script);
        });
      }
      const google = (window as any).google;
      const center = { lat: locations[0].lat, lng: locations[0].lng };
      if (!mapInstanceRef.current && mapRef.current) {
        mapInstanceRef.current = new google.maps.Map(mapRef.current, { center, zoom: 12 });
      }
      const map = mapInstanceRef.current;
      // clear existing markers
      (map.markers || []).forEach((m: any) => m.setMap(null));
      map.markers = [];
      locations.forEach((l) => {
        const m = new google.maps.Marker({ position: { lat: l.lat, lng: l.lng }, map, title: l.username });
        const infow = new google.maps.InfoWindow({ content: `<div><strong>${l.username}</strong><div>${new Date(l.timestamp).toLocaleString()}</div></div>` });
        m.addListener('click', () => infow.open(map, m));
        map.markers.push(m);
      });
      if (locations.length === 1) map.setCenter({ lat: locations[0].lat, lng: locations[0].lng });
      else {
        const bounds = new google.maps.LatLngBounds();
        locations.forEach((l) => bounds.extend({ lat: l.lat, lng: l.lng }));
        map.fitBounds(bounds);
      }
    };
    loadMap().catch(() => {
      // ignore map load errors
    });
  }, [apiKey, locations]);

  const handleAdminLogin = (user: string, pass: string) => {
    const basic = 'Basic ' + btoa(`${user}:${pass}`);
    sessionStorage.setItem('admin_auth', basic);
    setAuthHeader(basic);
    // refetch data
    window.location.reload();
  };

  const handleSetApiKey = (key: string) => {
    sessionStorage.setItem('GMAPS_API_KEY', key);
    setApiKey(key);
  };

  return (
    <main>
      <section className="browse-section" style={{ maxWidth: 1000, margin: '2rem auto' }}>
        <div className="section-heading">
          <div>
            <span className="eyebrow">Admin</span>
            <h2>System Overview</h2>
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <h3>Users</h3>
          <div className="seller-grid">
            {users.map((u) => (
              <article key={u.username} className="seller-card">
                <div>
                  <strong>{u.username}</strong>
                  <p>{u.email}</p>
                </div>
                <span>{u.role || 'buyer'}</span>
              </article>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <h3>User Locations</h3>
            {!authHeader && (
              <div style={{ marginBottom: '.5rem' }}>
                <p>Admin authentication required to fetch live locations from server.</p>
                <AdminLogin onLogin={handleAdminLogin} />
              </div>
            )}
            <div style={{ marginBottom: '.5rem' }}>
              <label>Google Maps API Key: </label>
              <input style={{ width: 360 }} defaultValue={apiKey || ''} onBlur={(e) => handleSetApiKey(e.currentTarget.value)} placeholder="Enter Google Maps API key and blur to save" />
            </div>
            <div ref={mapRef} id="admin-map" style={{ height: 400, width: '100%', marginBottom: '.5rem' }} />
            {locations.length === 0 && <p>No user locations available.</p>}
            {locations.map((l) => (
              <div key={l.username} style={{ padding: '.5rem', borderBottom: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{l.username}</strong>
                  <span>{new Date(l.timestamp).toLocaleString()}</span>
                </div>
                <div>Lat: {l.lat.toFixed(5)} — Lng: {l.lng.toFixed(5)} — accuracy: {l.accuracy}m</div>
              </div>
            ))}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <h3>Messages</h3>
          {messages.length === 0 && <p>No messages.</p>}
          {(() => {
            const usersSet = Array.from(new Set(messages.map(m => (m.from === 'admin' ? m.to : m.from))));
            return usersSet.map((u) => (
              <div key={u} style={{ marginBottom: '.75rem', padding: '.5rem', border: '1px solid #eee' }}>
                <strong>Conversation with {u}</strong>
                <div style={{ marginTop: '.5rem' }}>
                  {messages.filter(m => m.from === u || m.to === u).map(m => (
                    <div key={m.id} style={{ padding: '.25rem 0' }}>
                      <div style={{ fontSize: '.8rem', color: '#666' }}>{m.from} • {new Date(m.date).toLocaleString()}</div>
                      <div>{m.text}</div>
                    </div>
                  ))}
                </div>
                <ReplyBox recipient={u} onSend={(text: string) => {
                  const raw = localStorage.getItem('messages');
                  const all = raw ? JSON.parse(raw) : [];
                  const msg = { id: `m_${Date.now()}`, from: 'admin', to: u, text, date: new Date().toISOString() };
                  all.push(msg);
                  localStorage.setItem('messages', JSON.stringify(all));
                  setMessages(all);
                }} />
              </div>
            ));
          })()}
        </div>

        <div>
          <h3>Transactions</h3>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {transactions.map((tx) => (
              <div key={tx.id} style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{tx.id}</strong>
                  <span>{new Date(tx.date).toLocaleString()}</span>
                </div>
                <div>Buyer: {tx.buyer}</div>
                <div>Total: GHS {tx.total.toLocaleString()}</div>
                <div>{tx.items.length} items</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdminDashboard;

function ReplyBox({ recipient, onSend }: { recipient: string; onSend: (t: string) => void }) {
  const [text, setText] = useState('');
  return (
    <div style={{ marginTop: '.5rem' }}>
      <textarea rows={2} style={{ width: '100%' }} value={text} onChange={(e) => setText(e.target.value)} />
      <div style={{ display: 'flex', gap: '.5rem', marginTop: '.25rem' }}>
        <button className="btn" onClick={() => { if (text) { onSend(text); setText(''); } }}>Send</button>
      </div>
    </div>
  );
}

function AdminLogin({ onLogin }: { onLogin: (u: string, p: string) => void }) {
  const [user, setUser] = useState('admin@novamart.com');
  const [pass, setPass] = useState('');
  return (
    <div style={{ padding: '.5rem', border: '1px solid #eee' }}>
      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '.5rem' }}>
        <input value={user} onChange={(e) => setUser(e.target.value)} style={{ width: 300 }} />
        <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} style={{ width: 300 }} placeholder="admin password" />
      </div>
      <div>
        <button className="btn" onClick={() => onLogin(user, pass)}>Authenticate</button>
      </div>
    </div>
  );
}
