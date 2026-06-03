'use client';

import { useState, useEffect } from 'react';

export default function TestPage() {
  const [log, setLog] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLog(prev => [...prev, `✅ React mounted — ${navigator.userAgent.slice(0, 80)}`]);
  }, []);

  const push = (msg: string) => setLog(prev => [msg, ...prev].slice(0, 20));

  const inlineJsRan = typeof document !== 'undefined' && document.body.getAttribute('data-js') === '1';

  return (
    <div style={{ fontFamily: 'monospace', padding: 16, maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{ fontSize: 18, marginBottom: 8 }}>Event Test</h2>

      <div style={{
        background: inlineJsRan ? '#fffacd' : '#f7c5c5',
        padding: 10, borderRadius: 6, marginBottom: 8, fontWeight: 'bold'
      }}>
        Inline &lt;script&gt;: {inlineJsRan ? '✅ RAN' : '❌ BLOCKED (JS disabled or CSP)'}
      </div>

      <div style={{
        background: mounted ? '#c8f7c5' : '#f7c5c5',
        padding: 10, borderRadius: 6, marginBottom: 16, fontWeight: 'bold'
      }}>
        React: {mounted ? '✅ MOUNTED' : '❌ NOT MOUNTED (bundle failed)'}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>

        <button
          onClick={() => push('✅ button onClick')}
          onTouchStart={() => push('👆 button onTouchStart')}
          onPointerDown={() => push('🖱 button onPointerDown')}
          style={{ padding: 20, fontSize: 16, background: '#4a90d9', color: '#fff', border: 'none', borderRadius: 8 }}
        >
          &lt;button&gt;
        </button>

        <div
          onClick={() => push('✅ div onClick')}
          onTouchStart={() => push('👆 div onTouchStart')}
          onPointerDown={() => push('🖱 div onPointerDown')}
          style={{ padding: 20, fontSize: 16, background: '#e0e0e0', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          &lt;div&gt;
        </div>

        <button
          onClick={() => push('✅ button onClick (touch-action)')}
          onTouchStart={() => push('👆 button onTouchStart (touch-action)')}
          style={{ padding: 20, fontSize: 16, background: '#a0c35a', color: '#fff', border: 'none', borderRadius: 8, touchAction: 'manipulation' }}
        >
          touch-action
        </button>

        <div
          onClick={() => push('✅ plain div onClick (no extra styles)')}
          style={{ padding: 20, fontSize: 16, background: '#f9df6d', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          plain div
        </div>

      </div>

      <div style={{ marginBottom: 12 }}>
        <button
          onClick={() => push('✅ full-width button onClick')}
          style={{ width: '100%', padding: 20, fontSize: 16, background: '#ba81c5', color: '#fff', border: 'none', borderRadius: 8 }}
        >
          full-width &lt;button&gt;
        </button>
      </div>

      <div style={{ background: '#111', color: '#0f0', padding: 12, borderRadius: 6, minHeight: 200, overflowY: 'auto' }}>
        <div style={{ marginBottom: 6, color: '#888', fontSize: 12 }}>Event log (newest first):</div>
        {log.length === 0 && <div style={{ color: '#555' }}>nothing yet — tap the elements above</div>}
        {log.map((entry, i) => (
          <div key={i} style={{ fontSize: 13, marginBottom: 3 }}>{entry}</div>
        ))}
      </div>
    </div>
  );
}
