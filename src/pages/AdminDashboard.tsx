import { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
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
    try {
      const l = localStorage.getItem('user_locations');
      setLocations(l ? JSON.parse(l) : []);
    } catch {
      setLocations([]);
    }
    try {
      const m = localStorage.getItem('messages');
      setMessages(m ? JSON.parse(m) : []);
    } catch {
      setMessages([]);
    }
  }, []);

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
