import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ScrollToTop } from './scroll/ScrollToTop'
import { SiteFooter } from './site/SiteFooter'
import { SiteHeader } from './site/SiteHeader'
import { DisclaimerLoader } from './site/DisclaimerLoader'

function shouldShowDisclaimer() {
  try {
    return window.sessionStorage.getItem('suitcase-archive-disclaimer') !== 'seen'
  } catch (error) {
    console.warn('Could not read the disclaimer session flag; showing the notice.', error)
    return true
  }
}

const HomePage = lazy(() => import('./pages/HomePage'))
const CharactersPage = lazy(() => import('./pages/CharactersPage'))
const CharacterPage = lazy(() => import('./pages/CharacterPage'))
const StoryPage = lazy(() => import('./pages/StoryPage'))
const MetaPage = lazy(() => import('./pages/MetaPage'))
const KitPage = lazy(() => import('./pages/KitPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function App() {
  const [loaderOpen, setLoaderOpen] = useState(shouldShowDisclaimer)
  const mainRef = useRef<HTMLElement>(null)
  const wasLoaderOpen = useRef(loaderOpen)

  useEffect(() => {
    if (!loaderOpen) return
    try {
      window.sessionStorage.setItem('suitcase-archive-disclaimer', 'seen')
    } catch (error) {
      console.warn('Could not save the disclaimer session flag.', error)
    }
  }, [loaderOpen])

  useEffect(() => {
    if (wasLoaderOpen.current && !loaderOpen) mainRef.current?.focus()
    wasLoaderOpen.current = loaderOpen
  }, [loaderOpen])

  return (
    <>
      <ScrollToTop />
      <div aria-hidden={loaderOpen} className="app-shell" inert={loaderOpen}>
        <SiteHeader />
        <main id="main-content" ref={mainRef} tabIndex={-1}>
          <Suspense fallback={<div className="route-loading" role="status">Opening the archive…</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/characters" element={<CharactersPage />} />
              <Route path="/characters/:id" element={<CharacterPage />} />
              <Route path="/story" element={<StoryPage />} />
              <Route path="/meta" element={<MetaPage />} />
              <Route path="/kit" element={<KitPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <SiteFooter />
      </div>
      {loaderOpen && <DisclaimerLoader onDismiss={() => setLoaderOpen(false)} />}
    </>
  )
}

export default App
