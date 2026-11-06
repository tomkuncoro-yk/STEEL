import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { groups } from '../tools'
import heroArt from '../assets/art/hero.gif'

const toolCount = groups.reduce((total, group) => total + group.tools.length, 0)

export default function Home() {
  const location = useLocation()

  // Header and hero links pass { scrollTo: 'groups' | 'privacy' } in the route state.
  // With no target (e.g. the wordmark), the page starts at the top.
  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null
    if (state?.scrollTo) {
      document.getElementById(state.scrollTo)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [location])

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="metadata">
            {groups.length} groups · {toolCount} tools
          </p>
          <h1 id="hero-title">Small tools for big, messy digital datasets.</h1>
          <p className="lead">
            Filter, count, analyse and map your text data. Pick a group, drop in a file, get a
            file back. Everything runs <span className="scribble">in your browser</span>.
          </p>
          <div className="hero-actions">
            <Link
              className="pill pill-solid"
              to="/"
              state={{ scrollTo: 'groups' }}
            >
              Browse the tools
            </Link>
            <Link
              className="pill pill-outline"
              to="/"
              state={{ scrollTo: 'privacy' }}
            >
              How privacy works
            </Link>
            <p className="handwritten hero-note">nothing leaves your browser</p>
          </div>
        </div>
        <div className="hero-art">
          <img
            src={heroArt}
            width="1024"
            height="768"
            alt="Hand-drawn illustration of a figure tumbling through the air among papers and shapes"
          />
        </div>
      </section>

      <section className="groups" id="groups" aria-labelledby="groups-title">
        <div className="section-head">
          <h2 id="groups-title">Tool groups</h2>
          <p className="muted">Each group opens its own page, with one page per tool.</p>
        </div>

        <ul className="card-grid">
          {groups.map((group) => (
            <li key={group.slug}>
              <article className="card">
                {/* The button below is the main link; this one is a bigger click target
                    for the same page, so it is hidden from keyboard and screen readers. */}
                <Link
                  className="card-frame"
                  to={`/${group.slug}`}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <img src={group.art} alt={group.alt} loading="lazy" width="1024" height="768" />
                  {group.underConstruction && (<>
                      <span className="fund-banner fund-banner-top" aria-hidden="true">
                        <span>Under construction</span>
                      </span>
                      <span className="fund-banner fund-banner-bottom" aria-hidden="true">
                        <span>Awaiting fund</span>
                      </span>
                    </>)}
                </Link>
                <h3 className="card-title">{group.name}</h3>
                <p className="metadata muted">
                  {group.tools.length} {group.tools.length === 1 ? 'tool' : 'tools'}
                </p>
                <p className="card-blurb">{group.blurb}</p>
                {group.warning && <p className="chip">{group.warning}</p>}
                <div className="card-action">
                  <Link
                    className="pill pill-solid card-button"
                    to={`/${group.slug}`}
                    aria-label={`Open group: ${group.name}${group.underConstruction ? ' (under construction, awaiting fund)' : ''}`}
                  >
                    Open group
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section className="privacy" id="privacy" aria-labelledby="privacy-title">
        <h2 id="privacy-title">
          Your data <span className="scribble">stays put</span>
        </h2>
        <div className="privacy-grid">
          <div>
            <h3 className="card-title">Runs in your browser</h3>
            <p>
              Files are read and processed on your own computer. There is no server
              behind these tools and nothing is uploaded.
            </p>
          </div>
          <div>
            <h3 className="card-title">No accounts, no tracking</h3>
            <p>
              Fonts and illustrations are bundled with the site, so opening a tool
              makes no outside requests.
            </p>
          </div>
          <div>
            <h3 className="card-title">A file back, every time</h3>
            <p>
              Each tool hands you the result as a file (CSV, JSON, GEXF or an image).
              Nothing is stored once you close the page.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
