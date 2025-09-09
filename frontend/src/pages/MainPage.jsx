/*
Files contained in this single file preview:
  1) MainPage.jsx   -> React component (default export)
  2) MainPage.css   -> Separate CSS file to import from MainPage.jsx

Place files in your React project (e.g. src/components/MainPage.jsx and src/components/MainPage.css)
Usage:
  import MainPage from './components/MainPage';
  // or: import './components/MainPage.css' inside MainPage.jsx (already done in file)
  <MainPage />

Notes:
 - This component contains 5 responsive sections (Hero, Features, Projects, Live Placeholder, Contact/Footer)
 - It uses an IntersectionObserver to reveal sections with animations and a small JS toggle for mobile nav.
 - No whiteboard functionality is included (per your request).
*/

// ---- MainPage.jsx ----
import React, { useEffect, useState } from 'react';
import '../styles//MainPage.css';

export default function MainPage() {
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // optional: unobserve to only animate once
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="mp-root">
      <header className="mp-header">
        <div className="mp-container mp-header-inner">
          <div className="brand">Whiteboard<span className="dot">.</span>Lab</div>

          <nav className={`mp-nav ${navOpen ? 'open' : ''}`} aria-label="Primary">
            <a href="#features">Features</a>
            <a href="#projects">Projects</a>
            <a href="#live">Live</a>
            <a href="#contact">Contact</a>
          </nav>

          <button
            className={`mp-hamburger ${navOpen ? 'is-active' : ''}`}
            aria-label="Toggle menu"
            onClick={() => setNavOpen((s) => !s)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mp-hero reveal" id="hero" aria-labelledby="hero-heading">
          <div className="mp-container mp-hero-inner">
            <div className="hero-copy">
              <h1 className="hero-heading">Interactive design. Fast builds. Beautiful demos.</h1>
              <p className="lead">A polished React + Django portfolio starter — live whiteboard coming soon. Show off your UI skills with a modern landing page.</p>

              <div className="hero-ctas">
                <a className="btn primary" href="#projects">See projects</a>
                <a className="btn ghost" href="#features">Learn more</a>
              </div>
            </div>

            <div className="hero-art">
              <div className="card mock" aria-hidden>
                <div className="mock-header">
                  <span /> <span /> <span />
                </div>
                <div className="mock-body">
                  <div className="mock-grid" />
                </div>
              </div>
              <div className="badge">React • Django • WebSocket</div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mp-features reveal" id="features">
          <div className="mp-container">
            <h2 className="section-title">What this project shows</h2>
            <p className="section-sub">Small, composable UI sections that are easy to reuse — responsive and accessible.</p>

            <div className="features-grid">
              <article className="feature-card">
                <div className="icon">⚡️</div>
                <h3>Fast setup</h3>
                <p>Opinionated structure so you can focus on features not plumbing.</p>
              </article>


              <article className="feature-card">
                <div className="icon">🔒</div>
                <h3>Auth-ready</h3>
                <p>Design considers auth routes, user states and progressive enhancement.</p>
              </article>

              <article className="feature-card">
                <div className="icon">📱</div>
                <h3>Responsive</h3>
                <p>Layouts that adapt from mobile to wide desktops with graceful animations.</p>
              </article>

              <article className="feature-card">
                <div className="icon">🎨</div>
                <h3>Polished UI</h3>
                <p>Subtle shadows, micro-interactions and readable typography for presentation.</p>
              </article>
            </div>
          </div>
        </section>

        {/* Projects / Portfolio */}
        <section className="mp-projects reveal" id="projects">
          <div className="mp-container">
            <h2 className="section-title">Selected work</h2>
            <p className="section-sub">A few highlighted projects from this portfolio (mock data).</p>

            <div className="projects-grid">
              {Array.from({ length: 3 }).map((_, i) => (
                <article key={i} className="project-card">
                  <div className="thumb" />
                  <div className="p-body">
                    <h3>Project {i + 1}</h3>
                    <p className="muted">React • Django • Tailwind (or CSS)</p>
                    <div className="p-actions">
                      <a className="btn small" href="#">Live</a>
                      <a className="btn small ghost" href="#">Code</a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Live placeholder (where whiteboard would live) */}
        <section className="mp-live reveal" id="live">
          <div className="mp-container">
            <h2 className="section-title">Live demo area</h2>
            <p className="section-sub">This panel is a placeholder for the live whiteboard — it demonstrates how you might embed a canvas, a video or a collaborative area.</p>

            <div className="live-panel">
              <div className="panel-inner">
                <div className="live-message">Whiteboard canvas placeholder — implementation intentionally omitted.</div>
                <div className="live-cta">
                  <a className="btn" href="#contact">Request access</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact / Footer */}
        <section className="mp-contact reveal" id="contact">
          <div className="mp-container mp-contact-inner">
            <div className="contact-left">
              <h2>Let's build something</h2>
              <p className="muted">I'm open to freelance or full-time opportunities. Reach out and we'll talk tech + design.</p>

              <ul className="contact-list">
                <li>Email: <a href="mailto:you@example.com">you@example.com</a></li>
                <li>Location: Remote</li>
                <li>Stack: React, Django, PostgreSQL, WebSocket</li>
              </ul>
            </div>

            <form className="contact-form" onSubmit={(e) => e.preventDefault()} aria-label="Contact form">
              <label>
                Name
                <input type="text" name="name" placeholder="Your name" />
              </label>
              <label>
                Email
                <input type="email" name="email" placeholder="you@company.com" />
              </label>
              <label>
                Message
                <textarea name="message" rows={5} placeholder="Tell me about your project" />
              </label>
              <div className="form-actions">
                <button className="btn primary" type="submit">Send</button>
                <button className="btn ghost" type="button">Reset</button>
              </div>
            </form>
          </div>

          <footer className="mp-footer">
            <div className="mp-container">© {new Date().getFullYear()} — Built with ❤️ for your portfolio</div>
          </footer>
        </section>
      </main>
    </div>
  );
}