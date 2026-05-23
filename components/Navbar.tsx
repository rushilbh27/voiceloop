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

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      borderBottom: '1px solid var(--border)',
      background: 'rgba(7,7,17,0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Left: Logo + Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'linear-gradient(135deg, #7C3AED, #9F67FF)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 12px rgba(124,58,237,0.4)',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.87 9.83 19.79 19.79 0 01.81 1.2 2 2 0 012.8 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.06 6.06l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-display nav-wordmark" style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>
              VoiceLoop
            </span>
          </Link>

          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { href: '/dashboard', label: 'Agents' },
              { href: '/history', label: 'History' },
            ].map(({ href, label }) => {
              const active = pathname === href
              return (
                <Link key={href} href={href} style={{
                  textDecoration: 'none',
                  padding: '5px 12px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  color: active ? 'var(--primary-light)' : 'var(--text-muted)',
                  background: active ? 'rgba(124,58,237,0.12)' : 'transparent',
                  transition: 'all 0.15s',
                }}>
                  {label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Right: User + Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {userEmail && (
            <span style={{ fontSize: 12, color: 'var(--text-subtle)', display: 'none' }}
              className="sm-show"
            >
              {userEmail}
            </span>
          )}
          <button
            onClick={handleLogout}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '5px 12px',
              fontSize: 13,
              color: 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--text)'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-strong)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  )
}
