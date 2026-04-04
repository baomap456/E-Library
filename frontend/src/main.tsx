import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// Some websocket/transitive browser packages still reference Node's global.
const globalScope = globalThis as typeof globalThis & { global?: typeof globalThis }
if (typeof globalScope.global === 'undefined') {
  globalScope.global = globalThis
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
