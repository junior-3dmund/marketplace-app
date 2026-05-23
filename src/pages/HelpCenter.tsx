import { useEffect, useState } from 'react';
import { auth } from '../utils/auth';

const HelpCenter = () => {
  const current = auth.current();
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('http://localhost:4000/api/messages');
        if (res.ok) {
          const data = await res.json();
          if (mounted) setMessages(data || []);
          return;
        }
      } catch {}
      try {
        const raw = localStorage.getItem('messages');
        if (mounted) setMessages(raw ? JSON.parse(raw) : []);
      } catch {
        if (mounted) setMessages([]);
      }
    })();
    return () => { mounted = false };
  }, []);

  const send = () => {
    if (!current) return;
    const msg = { from: current.username, to: 'admin', text, date: new Date().toISOString() };
    (async () => {
      try {
        const res = await fetch('http://localhost:4000/api/messages', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(msg) });
        if (res.ok) {
          // attempt to refresh from server (admin-protected) — but we'll append locally
          setMessages((s) => [...s, { id: `m_${Date.now()}`, ...msg }]);
          setText('');
          return;
        }
      } catch (e) {}
      // fallback to localStorage
      try {
        const raw = localStorage.getItem('messages');
        const all = raw ? JSON.parse(raw) : [];
        const stored = { id: `m_${Date.now()}`, ...msg };
        all.push(stored);
        localStorage.setItem('messages', JSON.stringify(all));
        setMessages(all);
        setText('');
      } catch {}
    })();
  };

  const convo = current ? messages.filter(m => m.from === current.username || m.to === current.username) : [];

  return (
    <main>
      <section className="browse-section" style={{ maxWidth: 720, margin: '2rem auto' }}>
        <h3>Help Center</h3>
        {!current && <p>Please sign in to message admin.</p>}
        {current && (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <textarea rows={3} style={{ width: '100%' }} value={text} onChange={(e) => setText(e.target.value)} />
              <div style={{ display: 'flex', gap: '.5rem', marginTop: '.5rem' }}>
                <button className="btn" onClick={send} disabled={!text}>Send to admin</button>
              </div>
            </div>

            <div>
              <h4>Conversation</h4>
              {convo.length === 0 && <p>No messages yet.</p>}
              {convo.map(m => (
                <div key={m.id} style={{ padding: '.5rem', border: '1px solid #eee', marginBottom: '.5rem' }}>
                  <div style={{ fontSize: '.85rem', color: '#666' }}>{m.from} → {m.to} • {new Date(m.date).toLocaleString()}</div>
                  <div>{m.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default HelpCenter;
