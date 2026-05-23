import { useEffect, useState, useRef } from 'react';

const AdminDashboard = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [authHeader, setAuthHeader] = useState<string | null>(sessionStorage.getItem('admin_auth'));
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
      const headers: any = {};
      if (authHeader) headers.authorization = authHeader;
      try {
        // fetch locations (admin-protected)
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
    // initialize map when locations change (using Leaflet + OpenStreetMap)
    if (!locations || locations.length === 0) return;
    const loadLeaflet = async () => {
      if (!(window as any).L) {
        // load CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
        // load script
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject();
          document.head.appendChild(script);
        });
      }
      const L = (window as any).L;
      const center = [locations[0].lat, locations[0].lng];
      if (!mapInstanceRef.current && mapRef.current) {
        mapInstanceRef.current = L.map(mapRef.current).setView(center, 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(mapInstanceRef.current);
      }
      const map = mapInstanceRef.current;
      // clear existing markers
      if (map._markers) {
        map._markers.forEach((m: any) => m.remove());
      }
      map._markers = [];
      locations.forEach((l) => {
        const marker = (window as any).L.marker([l.lat, l.lng]).addTo(map).bindPopup(`<strong>${l.username}</strong><div>${new Date(l.timestamp).toLocaleString()}</div>`);
        map._markers.push(marker);
      });
      if (locations.length === 1) map.setView([locations[0].lat, locations[0].lng], 12);
      else {
        const bounds = (window as any).L.latLngBounds(locations.map((l: any) => [l.lat, l.lng]));
        map.fitBounds(bounds);
      }
    };
    loadLeaflet().catch(() => {});
  }, [locations]);

  const handleAdminLogin = async (pin: string) => {
    try {
      const res = await fetch('http://localhost:4000/api/admin/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ pin }) });
      if (!res.ok) throw new Error('auth failed');
      const json = await res.json();
      const token = json.token;
      const bearer = 'Bearer ' + token;
      sessionStorage.setItem('admin_auth', bearer);
      setAuthHeader(bearer);
      window.location.reload();
    } catch (e) {
      alert('Admin authentication failed');
    }
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

function AdminLogin({ onLogin }: { onLogin: (pin: string) => void }) {
  const [pin, setPin] = useState('');
  return (
    <div style={{ padding: '.5rem', border: '1px solid #eee' }}>
      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '.5rem', alignItems: 'center' }}>
        <label style={{ fontWeight:700 }}>Admin PIN:</label>
        <input value={pin} onChange={(e) => setPin(e.target.value)} style={{ width: 220 }} placeholder="Enter 4-digit PIN" />
      </div>
      <div>
        <button className="btn" onClick={() => onLogin(pin)}>Authenticate</button>
      </div>
    </div>
  );
}
