import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { groups } from '../tools'

export default function GroupPage() {
  const { slug } = useParams<{ slug: string }>()
  const group = groups.find((item) => item.slug === slug)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [slug])

  // Unknown address: send people back to the front page
  if (!group) {
    return <Navigate to="/" replace />
  }

  return (
    <>
      <Link className="back-link" to="/" state={{ scrollTo: 'groups' }}>
        ← All tool groups
      </Link>

      <section className="hero group-hero" aria-labelledby="group-title">
        <div className="hero-copy">
          {group.underConstruction && <p className="chip">Under construction</p>}
          <h1 id="group-title">{group.name}</h1>
          <p className="lead">{group.blurb}</p>
          {group.underConstruction && (
            <p className="handwritten">pardon the dust, the tools are on their way</p>
          )}
          <div className="hero-actions">
            <Link className="pill pill-solid pill-large" to="/" state={{ scrollTo: 'groups' }}>
              Back to all groups
            </Link>
          </div>
        </div>
        <div className="hero-art">
          <img src={group.art} width="1024" height="768" alt={group.alt} />
        </div>
      </section>

      <section className="planned" aria-labelledby="planned-title">
        <div className="section-head">
          <h2 id="planned-title">Planned tools</h2>
          <p className="muted">
            {group.tools.length} {group.tools.length === 1 ? 'tool' : 'tools'} in this
            group. Each will get its own page.
          </p>
        </div>
        <ul className="tool-list">
          {group.tools.map((tool) => (
            <li className="tool-row" key={tool}>
              <span className="card-title">{tool}</span>
              <span className="metadata muted">Coming soon</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
