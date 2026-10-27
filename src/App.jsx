import BubbleField from './components/BubbleField.jsx'
import './App.css'

const work = [
  {
    eyebrow: 'Selected work',
    title: 'Fairness agent for clinical AI',
    meta: 'Final-year research · 2025–2026 · First-Class Honours',
    problem:
      'A multi-disease prediction model (Delphi-2M) can perform unevenly across ethnic groups. Accuracy alone was not a complete definition of success.',
    approach:
      'I scoped the fairness gap, set evaluation criteria, and built a five-step agent that audits predictions and applies targeted corrections only when bias is found — so the “fix” does not create new harm.',
    outcome:
      'A working pipeline in Python (fairlearn, PyTorch, pandas) with before/after fairness summaries and ethnicity-stratified AUC, designed around real-world trade-offs rather than a one-shot tweak.',
    href: 'https://github.com/coih2/FYP_Agent',
    cta: 'View the project',
  },
  {
    eyebrow: 'Building in community',
    title: 'Product Space Fellowship',
    meta: 'University of Pennsylvania · 2026',
    problem:
      'Campus tools often miss the actual student job-to-be-done. Shipping AI without discovery is how you get a clever product nobody needs.',
    approach:
      'Working in a team to identify a student need, then build and test an AI tool against that need — discovery before delivery.',
    outcome:
      'Hands-on product practice: framing a problem, testing with users, and iterating on something people might actually adopt.',
  },
  {
    eyebrow: 'Cross-functional delivery',
    title: 'Clinical data, made usable',
    meta: 'Staburo GmbH · Munich · 2024–2025',
    problem:
      'Statistical outputs only create value when clinical teams can trust them and act on them.',
    approach:
      'I programmed and validated SAS datasets and reports to CDISC specs, QC’d outputs before delivery, and prepared materials that pulled multiple sources into one review conversation.',
    outcome:
      'A year of bridging technical and clinical stakeholders — translating between specification, quality, and the people who had to use the result.',
  },
]

const timeline = [
  {
    period: '2026 – 2027',
    place: 'University of Pennsylvania',
    role: 'MSE, Data Science & AI',
    note: 'Product Space Fellow · Venture Lab VIP-X · SWE Advocacy · FemmeHacks',
  },
  {
    period: '2025 – 2026',
    place: 'The Reformer Studio',
    role: 'Reformer Pilates Instructor',
    note: 'Needs discovery in real time. Classes averaged 90%+ capacity alongside full-time study.',
  },
  {
    period: '2024 – 2025',
    place: 'Staburo GmbH, Munich',
    role: 'Intern, Biostatistics & Data Science',
    note: 'Clinical trial data, QC, and cross-functional reviews.',
  },
  {
    period: '2022 – 2026',
    place: 'Loughborough University',
    role: 'BSc Computer Science & Mathematics',
    note: 'GPA 3.89/4.0 · Co-founded the AI Society · Play Action International trip leader',
  },
]

export default function App() {
  return (
    <>
      <BubbleField />
      <div className="grain" aria-hidden="true" />

      <header className="nav">
        <a className="mark" href="#top">
          Isabelle Hunt
        </a>
        <div className="nav-end">
          <nav>
            <a href="#work">Work</a>
            <a href="#about">About</a>
            <a href="#writing">Writing</a>
            <a href="#contact">Contact</a>
          </nav>
          <a className="resume" href={`${import.meta.env.BASE_URL}Isabelle_Hunt_Resume.pdf`}>
            Resume
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <p className="kicker">Product · Data · People</p>
          <h1>
            I shape products that stay
            <em> useful, fair, and human.</em>
          </h1>
          <p className="lede">
            Product manager in the making. I come from computer science and maths, and I care as
            much about who a product is for as I do about whether it works.
          </p>
          <div className="hero-meta">
            <span>Penn MSE, Data Science &amp; AI</span>
            <span>Product Space Fellow</span>
            <span>Loughborough CS &amp; Maths</span>
          </div>
        </section>

        <section id="work" className="section">
          <div className="section-head">
            <h2>Selected work</h2>
            <p>
              A few places I have already practised the product loop: define the real problem,
              choose what “good” means, and ship something people can use.
            </p>
          </div>
          <div className="work-list">
            {work.map((item) => (
              <article className="glass card" key={item.title}>
                <p className="eyebrow">{item.eyebrow}</p>
                <h3>{item.title}</h3>
                <p className="meta">{item.meta}</p>
                <dl>
                  <div>
                    <dt>Problem</dt>
                    <dd>{item.problem}</dd>
                  </div>
                  <div>
                    <dt>Approach</dt>
                    <dd>{item.approach}</dd>
                  </div>
                  <div>
                    <dt>Outcome</dt>
                    <dd>{item.outcome}</dd>
                  </div>
                </dl>
                {item.href ? (
                  <a className="text-link" href={item.href} target="_blank" rel="noreferrer">
                    {item.cta} →
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="section about">
          <div className="section-head">
            <h2>About</h2>
          </div>
          <div className="about-grid">
            <div className="glass about-copy">
              <p>
                I grew up as a builder: a specialised UK degree in computer science and maths,
                then a year in Munich writing and checking clinical trial outputs. I liked the
                craft. I liked even more the moments where I had to sit between technical and
                clinical teams and make the work make sense.
              </p>
              <p>
                At Penn, I finally get to study across the university — engineering next to
                Wharton, design, and the humanities. That is not a side quest. It is how I want
                to work as a PM: technically fluent, commercially literate, and stubborn about
                the people on the other side of the product.
              </p>
              <p>
                I am currently a Product Space Fellow, taking Venture Lab coursework in customer
                discovery and go-to-market, and organising with SWE Advocacy and FemmeHacks
                because the products we ship should serve a wider range of people.
              </p>
            </div>
            <aside className="glass path">
              <h3>Path</h3>
              <ol>
                {timeline.map((item) => (
                  <li key={item.period}>
                    <span className="when">{item.period}</span>
                    <strong>{item.role}</strong>
                    <span className="where">{item.place}</span>
                    <span className="why">{item.note}</span>
                  </li>
                ))}
              </ol>
            </aside>
          </div>

          <div className="chips">
            {[
              'Customer discovery',
              'Problem framing',
              'Fairness & ethics',
              'SQL · Python · R',
              'Figma · Notion',
              'Fluent German',
              'Intermediate Mandarin',
            ].map((chip) => (
              <span className="chip" key={chip}>
                {chip}
              </span>
            ))}
          </div>
        </section>

        <section id="writing" className="section">
          <div className="section-head">
            <h2>Writing</h2>
            <p>How I think about engineers, products, and the rest of the university.</p>
          </div>
          <a
            className="glass writing-card"
            href="https://www.pennswe.com/post/why-engineers-should-take-classes-outside-of-engineering"
            target="_blank"
            rel="noreferrer"
          >
            <p className="eyebrow">Penn SWE · 2026</p>
            <h3>Why Engineers Should Take Classes Outside of Engineering</h3>
            <p>
              A specialised CS degree taught me how to build. Penn taught me I also need classes
              that ask who we are building for, who gets left out, and whether something should
              exist at all. That is product work, even when it lives in a seminar.
            </p>
            <span className="text-link">Read the essay →</span>
          </a>
        </section>

        <section id="contact" className="section contact">
          <div className="glass contact-card">
            <p className="kicker">Let’s talk</p>
            <h2>I am looking for product internships and conversations.</h2>
            <p>
              If you are hiring a PM who can sit with engineers, interrogate a metric, and still
              ask who the user is — I would like to hear from you.
            </p>
            <div className="contact-row">
              <a href="mailto:isabelleeve.hunt@outlook.com">isabelleeve.hunt@outlook.com</a>
              <a href="mailto:iehunt@engineering.upenn.edu">iehunt@engineering.upenn.edu</a>
              <a href="https://github.com/coih2" target="_blank" rel="noreferrer">
                github.com/coih2
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <span>Isabelle Hunt · Philadelphia</span>
        <span>Built with large, lucid bubbles.</span>
      </footer>
    </>
  )
}
