import { useEffect, useRef, useState } from 'react'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import './App.css'

const projects = [
  {
    title: 'Shibumi',
    type: 'Interactive space atlas',
    images: [
      '/projects/shibumi.png',
      '/projects/shibumbi_2.png',
      '/projects/shibumi_3.png',
    ],
    detail: 'Cinematic satellite globe built with Next.js, Mapbox GL JS, Three.js, CelesTrak TLE data, and NASA/JPL Horizons vectors for live Earth and lunar spacecraft visualization.',
    href: 'https://shibumi-kohl.vercel.app/',
  },
  {
    title: 'SourceWise',
    type: 'Microsoft Agents League Hackathon project',
    images: [
      '/projects/SourceWise.png',
      '/projects/SourceWise_2.png',
      '/projects/SourceWise_3.png',
    ],
    detail: 'AI-guided research discovery app that maps broad topics into themes, ranked academic papers, credibility signals, debates, comparisons, and saved research history using Semantic Scholar, Microsoft Foundry IQ, and Supabase.',
    href: 'https://source-wise-two.vercel.app/',
  },
  {
    title: 'Smart Door Security System',
    type: 'Team project',
    images: ['/projects/Smart Door Security System.png'],
    detail: 'Affordable facial-recognition security system for homes, schools, and businesses using an iOS app, React, Raspberry Pi, and OpenCV.',
    href: 'https://www.linkedin.com/posts/hannah-manoj-11b463293_leedsbeckettuniversity-activity-7331292288523907072-iF4z?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEcUmucBD2x1hyizjZCkOYyxEemC-rJVU88',
  },
  {
    title: 'Fifa 26 Match Predictor',
    type: 'Machine learning project',
    images: ['/projects/football.jpg'],
    detail: 'Streamlit football analytics app that predicts match win/draw/loss probabilities, explains rating and form factors, and runs Monte Carlo simulations for a 2026-style tournament bracket.',
    href: 'https://football-match-predictor-2026.streamlit.app/',
  },
  {
    title: 'Crime Database Management Application',
    type: 'Database systems project',
    detail: 'Built a SQL-based crime data management system with relational database design, triggers, sequences, and automated integrity checks for law-enforcement case tracking.',
    href: 'https://github.com/hannahmanoj/Crime-Database-Management-Application',
  },
]

const technologies = [
  { name: 'Python', mark: 'Py' },
  { name: 'TypeScript', mark: 'Ts' },
  { name: 'React.js', mark: '⚛' },
  { name: 'Java', mark: 'Jv' },
]

const siteZoom = 0.9

function LotusModel() {
  const { scene } = useGLTF('/models/lotus-3d.glb')

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone()

        child.material.color.set('#ff9fd6')
        child.material.emissive.set('#ff6fbf')
        child.material.emissiveIntensity = 0.04
        child.material.roughness = 0.42
        child.material.metalness = 0
      }
    })
  }, [scene])

  return (
    <primitive
      object={scene}
      scale={2}
      position={[0, -0.15, 0]}
      rotation={[0.7, 0.4, 0.4]}
    />
  )
}

function LandingModel() {
  return (
    <Canvas
      camera={{ position: [0, 0.35, 11], fov: 42 }}
      dpr={[1, 2]}
      gl={{
        alpha: true,
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.85,
      }}
    >

<ambientLight intensity={0.9} />

<directionalLight
  position={[2, 4, 5]}
  intensity={1.2}
  color="#ffd4f1"
/>

<directionalLight
  position={[-4, 1, 3]}
  intensity={1.1}
  color="#9c7cff"
/>

<directionalLight
  position={[3, -2, 2]}
  intensity={0.9}
  color="#ff8f7a"
/>

      <LotusModel />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.8}
        autoRotate
        autoRotateSpeed={1}
      />
    </Canvas>
  )
}

useGLTF.preload('/models/lotus-3d.glb')

function getLondonTime() {
  const timeParts = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Europe/London',
  }).format(new Date())

  const offsetParts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    timeZoneName: 'shortOffset',
  })
    .formatToParts(new Date())
    .find((part) => part.type === 'timeZoneName')?.value

  return `${timeParts} ${offsetParts ?? 'GMT'}`
}

function App() {
  const cursorDotRef = useRef(null)
  const cursorRingRef = useRef(null)
  const workSectionRef = useRef(null)
  const cursorPosition = useRef({ x: -100, y: -100 })
  const ringPosition = useRef({ x: -100, y: -100 })
  const [showLoader, setShowLoader] = useState(true)
  const [introReady, setIntroReady] = useState(false)
  const [londonTime, setLondonTime] = useState(getLondonTime)
  const [projectsVisible, setProjectsVisible] = useState(false)

  useEffect(() => {
    const introTimer = window.setTimeout(() => {
      setIntroReady(true)
    }, 2650)
    const loaderTimer = window.setTimeout(() => {
      setShowLoader(false)
    }, 3200)

    return () => {
      window.clearTimeout(introTimer)
      window.clearTimeout(loaderTimer)
    }
  }, [])

  useEffect(() => {
    const interactiveLinks = document.querySelectorAll(
      'a:not(.landing-model a), button:not(.landing-model button)',
    )

    const handlePointerMove = (event) => {
      const pointerX = event.clientX / siteZoom
      const pointerY = event.clientY / siteZoom

      cursorPosition.current = { x: pointerX, y: pointerY }

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`
      }

      const darkSection = document.elementFromPoint(event.clientX, event.clientY)?.closest('.contact-footer')
      document.body.classList.toggle('cursor-on-dark', Boolean(darkSection))
    }

    const handlePointerEnter = () => {
      document.body.classList.add('cursor-hovering-clickable')
    }

    const handlePointerLeave = () => {
      document.body.classList.remove('cursor-hovering-clickable')
    }

    let animationFrame

    const animateRing = () => {
      ringPosition.current.x += (cursorPosition.current.x - ringPosition.current.x) * 0.18
      ringPosition.current.y += (cursorPosition.current.y - ringPosition.current.y) * 0.18

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringPosition.current.x}px, ${ringPosition.current.y}px, 0)`
      }

      animationFrame = window.requestAnimationFrame(animateRing)
    }

    window.addEventListener('pointermove', handlePointerMove)
    interactiveLinks.forEach((link) => {
      link.addEventListener('pointerenter', handlePointerEnter)
      link.addEventListener('pointerleave', handlePointerLeave)
      link.addEventListener('focus', handlePointerEnter)
      link.addEventListener('blur', handlePointerLeave)
    })
    animationFrame = window.requestAnimationFrame(animateRing)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      interactiveLinks.forEach((link) => {
        link.removeEventListener('pointerenter', handlePointerEnter)
        link.removeEventListener('pointerleave', handlePointerLeave)
        link.removeEventListener('focus', handlePointerEnter)
        link.removeEventListener('blur', handlePointerLeave)
      })
      document.body.classList.remove('cursor-hovering-clickable')
      document.body.classList.remove('cursor-on-dark')
      window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLondonTime(getLondonTime())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const footer = document.querySelector('.contact-footer')

    if (!footer) {
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        document.body.classList.toggle('footer-in-view', entry.isIntersecting)
      },
      { threshold: 0.18 },
    )

    observer.observe(footer)

    return () => {
      observer.disconnect()
      document.body.classList.remove('footer-in-view')
    }
  }, [])

  useEffect(() => {
    const workSection = workSectionRef.current

    if (!workSection) {
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setProjectsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.18 },
    )

    observer.observe(workSection)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <main className={introReady ? 'intro-ready' : ''}>
      <div className="cursor-ring" ref={cursorRingRef} aria-hidden="true"></div>
      <div className="cursor-dot" ref={cursorDotRef} aria-hidden="true"></div>
      {showLoader && (
        <div className="site-loader" aria-hidden="true">
          <div className="loader-center">
            <div className="loader-symbols">
              <span className="loader-flower">✿</span>
              <span className="loader-lotus">✤</span>
              <span className="loader-flower">✳</span>
            </div>
            <p>©2026</p>
          </div>
        </div>
      )}

      <header className="nav-bar" aria-label="Primary navigation">
        <nav>
          <a href="#home" className="brand">
            Hannah M.
          </a>
          <div className="nav-links">
            <div className="nav-main-links">
              <a href="#about">About</a>
              <a href="#experience">Experience</a>
              <a href="#work">Projects 05</a>
              <a href="/resume.pdf" className="resume-link" download>Résumé ↗</a>
            </div>
            <a href="mailto:hello@example.com">Contact</a>
          </div>
        </nav>
      </header>

      <section className="hero-shell hero-intro" id="home" aria-label="Portfolio landing page">
        <div className="hero-grid">
          <div className="name-row">
            <h1>hannah</h1>
            <div className="landing-model" aria-hidden="true">
              <LandingModel />
            </div>
            <span className="star-one" aria-hidden="true">✦</span>
            <span className="flower-one" aria-hidden="true">✿</span>
          </div>

          <p className="intro-copy">
            Hello! - I&apos;m Hannah, a final year computer science student at Leeds, UK with a strong passion for data engineering, ML & UI/UX.
          </p>

          <div className="bottom-flower" aria-hidden="true">✿</div>

          <a className="scroll-link" href="#about">Scroll to explore ↓</a>

          <div className="hero-footer">
            <p>✱ London, UK</p>
            <p>{londonTime}</p>
            <a href="https://www.linkedin.com/in/hannah-manoj-11b463293/" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://github.com/hannahmanoj" target="_blank" rel="noreferrer">Github</a>
            <a href="#home" aria-label="Back to top">↑</a>
          </div>

        </div>
      </section>

      <section className="about-section" id="about">
        <div className="about-content">
          <h2>About me</h2>
          <p>
            I was born in India and raised in small country called Oman. Currently about to start my final year doing Computer Science in Leeds, UK. My interests have been data engineering, system design, and creating meaningful experiences through technology. I love turning complex ideas into something useful, scalable, and occasionally beautiful.
            These are some technologies I have
            been working with:
          </p>
          <div className="tech-grid" aria-label="Technologies">
            {technologies.map((tech) => (
              <div className="tech-chip" key={tech.name}>
                <span aria-hidden="true">{tech.mark}</span>
                <p>{tech.name}</p>
              </div>
            ))}
          </div>
          <p className="about-note">

            In my free time, I love long walks, hikes - basically touching grass any chance I get, and
            travelling anywhere the sun exists.
          </p>
        </div>

      </section>

      <section className="experience-section" id="experience">
        <div className="section-heading">
          <h2>
            <span>Experience</span>
          </h2>
        </div>
        <article className="experience-card">
          <div>
            <p className="eyebrow">Madayn · Muscat, Oman</p>
            <h3>Data Engineer Intern</h3>
          </div>
          <p>June 2026 - Present</p>
          <ul>
            <li>
              Supporting data engineering work across data workflows, reporting, and analytics.
            </li>
          </ul>
        </article>
        <article className="experience-card">
          <div>
            <p className="eyebrow">Amazon · London, England</p>
            <h3>Business Intelligence Engineer Intern</h3>
          </div>
          <p>June 2025 - May 2026</p>
          <ul>
            <li>
              Designed and deployed an automated AWS ETL pipeline, replacing a manual reporting
              workflow and improving reliability.
            </li>
            <li>
              Built optimised AWS Glue PySpark jobs, cutting processing time from 80-100 minutes to
              around 20 minutes.
            </li>
            <li>
              Created event-driven data workflows with S3, EventBridge, Lambda, Glue Crawlers,
              Redshift, and QuickSight for faster stakeholder reporting.
            </li>
          </ul>
        </article>
      </section>

      <section className={`work-section ${projectsVisible ? 'projects-visible' : ''}`} id="work" ref={workSectionRef}>
        <div className="section-heading">
          <h2>
            <span>projects</span> <em></em>
          </h2>
        </div>
        <div className="project-grid">
          {projects.map((project) => {
            const projectImages = project.images ?? []
            const currentImage = projectImages[0]

            return (
              <article className={`project-card ${projectImages.length ? '' : 'project-card-text-only'}`} key={project.title}>
                <div className="project-identity">
                  {currentImage && (
                    <img src={currentImage} alt="" loading="lazy" aria-hidden="true" />
                  )}
                  <h3>{project.title}</h3>
                </div>
                <p className="project-type">{project.type}</p>
                <a className="project-link" href={project.href} target="_blank" rel="noreferrer" aria-label={`View ${project.title}: ${project.detail}`}>
                  View project <span className="project-arrow" aria-hidden="true">›</span>
                </a>
              </article>
            )
          })}
        </div>
      </section>

      <footer className="contact-footer" id="contact">
        <div className="contact-footer-content">
          <div className="footer-cursor-mark" aria-hidden="true">
            <span></span>
          </div>
          <p className="footer-kicker"></p>
          <h2>
          <em>Reach Out.</em>
          </h2>
          <a className="footer-email" href="mailto:hannah.manoj@gmail.com">
            hannah.manoj@gmail.com
          </a>
        </div>
      </footer>
    </main>
  )
}

export default App
