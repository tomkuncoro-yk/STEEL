import { Link, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import GroupPage from './pages/GroupPage'
import FilterAndCount from './pages/FilterAndCount'

export default function App() {
  return (
    <>
      <button
        type="button"
        className="skip-link"
        onClick={() => document.getElementById('main-content')?.focus()}
      >
        Skip to content
      </button>

      <header className="rail">
        <Link className="wordmark" to="/">
          Digital Tools
        </Link>
        <nav className="rail-actions" aria-label="Main">
          <Link className="pill pill-solid" to="/" state={{ scrollTo: 'groups' }}>
            Tool groups
          </Link>
          <Link className="pill pill-outline" to="/" state={{ scrollTo: 'privacy' }}>
            Privacy
          </Link>
        </nav>
      </header>

      <main id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/filter-and-count" element={<FilterAndCount />} />
          <Route path="/:slug" element={<GroupPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="footer">
        <p className="metadata">Digital Tools</p>
        <p className="metadata muted">
          Illustrations: Open Doodles by Pablo Stanley (CC0), recoloured.
        </p>
      </footer>
    </>
  )
}
