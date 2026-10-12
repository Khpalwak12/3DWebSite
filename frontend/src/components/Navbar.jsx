import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useRestaurant } from '../context'

const links = [
  { to: '/', label: 'کور', end: true },
  { to: '/menu', label: 'مینو' },
  { to: '/about', label: 'زموږ کیسه' },
]

export default function Navbar() {
  const { info } = useRestaurant()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const solid = location.pathname !== '/' || scrolled || open

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <header className={`nav ${solid ? 'solid' : ''}`}>
      <NavLink to="/" className="brand">
        <span>دسترخوان</span>
        <small>{info?.city || 'کابل'}</small>
      </NavLink>
      <button
        className="nav-toggle"
        type="button"
        aria-expanded={open}
        aria-label={open ? 'مینو وتړئ' : 'مینو پرانیزئ'}
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
      </button>
      <nav className={open ? 'open' : ''}>
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.end}>
            {link.label}
          </NavLink>
        ))}
        <NavLink to="/reserve" className="nav-reserve">
          میز ونیسئ
        </NavLink>
      </nav>
    </header>
  )
}
