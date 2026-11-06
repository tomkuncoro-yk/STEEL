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
        <Link className="wordmark" to="/" aria-label="STEEL-SPIR, Sheffield Texts Exploration and Examination Lab">
          <span className="wordmark-name">STEEL-SPIR</span>
          <span className="wordmark-sub">Sheffield Texts Exploration and Examination Lab</span>
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
        <p className="metadata">STEEL-SPIR · Sheffield Texts Exploration and Examination Lab</p>
        <p className="metadata muted">
          Illustrations: Open Doodles by Pablo Stanley (CC0), recoloured.
        </p>
      </footer>
    </>
  )
}
