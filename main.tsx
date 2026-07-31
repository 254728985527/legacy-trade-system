import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global error handler
window.addEventListener('error', (e) => {
  console.error('[v0] Global error:', e.error);
  console.error('[v0] Stack:', e.error?.stack);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('[v0] Unhandled rejection:', e.reason);
});

try {
  console.log('[v0] Starting app...');
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  console.log('[v0] App mounted successfully');
} catch (err) {
  console.error('[v0] React render error:', err);
  document.getElementById('root')!.innerHTML = '<div style="color: red; padding: 20px; font-family: monospace;">Error: ' + String(err) + '</div>';
}
