import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource-variable/bodoni-moda'
import '@fontsource-variable/newsreader'
import '@fontsource/space-mono/400.css'
import 'lenis/dist/lenis.css'
import './index.css'
import './components/ui/ui.css'
import App from './App'
import { SmoothScrollProvider } from './scroll/SmoothScrollProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SmoothScrollProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SmoothScrollProvider>
  </StrictMode>,
)
