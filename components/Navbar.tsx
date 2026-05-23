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
      background: 'rgba(17,19,26,0.92)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        maxWidth: 1120, margin: '0 auto', padding: '0 24px',
        height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <Link href="/dashboard" style={{
            textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: 5,
              background: 'var(--red)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.87 9.83 19.79 19.79 0 01.81 1.2 2 2 0 012.8 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.06 6.06l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="hide-mobile" style={{
              fontSize: 14, fontWeight: 700, color: 'var(--text)',
              letterSpacing: '-0.01em',
            }}>
              VoiceLoop
            </span>
          </Link>

          <div style={{ display: 'flex', gap: 2 }}>
            {[
              { href: '/dashboard', label: 'Agents' },
              { href: '/history', label: 'History' },
            ].map(({ href, label }) => {
              const active = pathname === href
              return (
                <Link key={href} href={href} style={{
                  textDecoration: 'none',
                  padding: '4px 10px',
                  borderRadius: 5,
                  fontSize: 13,
                  fontWeight: 500,
                  color: active ? 'var(--text)' : 'var(--text-3)',
                  background: active ? 'var(--surface)' : 'transparent',
                  transition: 'color 0.1s',
                }}>
                  {label}
                </Link>
              )
            })}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="btn-ghost"
          style={{ padding: '4px 10px', fontSize: 12, whiteSpace: 'nowrap' }}
        >
          Sign out
        </button>
      </div>
    </nav>
  )
}
