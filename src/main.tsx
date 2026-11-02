import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import '@fontsource-variable/inter'
import '@fontsource-variable/dm-sans'
import '@fontsource/architects-daughter'
import './index.css'
import './tool-page.css'
import App from './App.tsx'

// HashRouter keeps routes after a "#" (e.g. /#/networks), so the built site
// works on any static host without server rewrite rules.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
