'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

interface NavbarProps {
  userEmail?: string
}

export default function Navbar({ userEmail }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const navItems = [
    { href: '/dashboard', label: 'Agents' },
    { href: '/history', label: 'History' },
  ]

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(6,6,8,0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        maxWidth: 1160, margin: '0 auto', padding: '0 32px',
        height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Left: brand + nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <Link href="/dashboard" style={{
            textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 9,
          }}>
            <div style={{
              width: 26, height: 26, borderRadius: 6,
              background: 'var(--red)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.87 9.83 19.79 19.79 0 01.81 1.2 2 2 0 012.8 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.06 6.06l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="hide-mobile" style={{
              fontFamily: 'var(--font-display)',
              fontSize: 15, fontWeight: 700,
              color: 'var(--text)', letterSpacing: '-0.01em',
            }}>
              VoiceLoop
            </span>
          </Link>

          <div style={{ display: 'flex', gap: 4 }}>
            {navItems.map(({ href, label }) => {
              const active = pathname === href
              return (
                <Link key={href} href={href} style={{
                  textDecoration: 'none',
                  padding: '5px 12px',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: active ? 600 : 400,
                  color: active ? 'var(--text)' : 'var(--text-2)',
                  background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
                  transition: 'color 0.15s, background 0.15s',
                  position: 'relative',
                }}>
                  {label}
                  {active && (
                    <span style={{
                      position: 'absolute',
                      bottom: -1, left: '50%',
                      transform: 'translateX(-50%)',
                      width: 16, height: 2,
                      background: 'var(--red)',
                      borderRadius: 1,
                    }} />
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Right: sign out */}
        <button
          onClick={handleLogout}
          className="btn-ghost"
          style={{ padding: '5px 12px', fontSize: 12, whiteSpace: 'nowrap' }}
        >
          Sign out
        </button>
      </div>
    </nav>
  )
}
