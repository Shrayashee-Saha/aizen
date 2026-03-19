// App.jsx — AiZen main shell — fully responsive (fixed)

import React, { useState, useEffect } from 'react';
import { Sun, Moon, FileText, BookOpen, Eye, PenLine } from 'lucide-react';
import { AiZenLogo } from './components/Hero';
import Hero from './components/Hero';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import CoverLetter from './components/CoverLetter';
import { useGemini } from './hooks/useGemini';

const GEMINI_API_KEY = '...................';

const INITIAL_DATA = {
  personal: { name: '', jobTitle: '', email: '', phone: '', location: '', linkedin: '', summary: '', yearsExp: '', strengths: '' },
  experience:    [{ company: '', role: '', duration: '', description: '', bullets: '' }],
  education:     [{ institution: '', degree: '', year: '', gpa: '' }],
  projects:      [{ title: '', description: '', techStack: '', link: '' }],
  certifications:[{ name: '', issuer: '', date: '' }],
  skills: [],
};

export default function App() {
  const [theme, setTheme]             = useState('dark');
  const [page, setPage]               = useState('hero');
  const [tab, setTab]                 = useState('resume');
  const [mobilePanel, setMobilePanel] = useState('form'); // 'form' | 'preview'
  const [resumeData, setResumeData]   = useState(INITIAL_DATA);
  const [template, setTemplate]       = useState('classic');
  const [isMobile, setIsMobile]       = useState(window.innerWidth <= 900);

  const { generateCoverLetter, loading, errors } = useGemini(GEMINI_API_KEY);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Track window width for responsive switching
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Reset to form panel when switching tabs
  useEffect(() => { setMobilePanel('form'); }, [tab]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  const isBuilder = page === 'builder';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── NAVBAR ── */}
      {isBuilder && (
        <nav style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px', height: '56px', flexShrink: 0,
          background: 'var(--bg-card)', borderBottom: '1px solid var(--border-subtle)',
          position: 'sticky', top: 0, zIndex: 100, gap: '8px',
        }}>
          {/* Brand */}
          <button onClick={() => setPage('hero')} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0,
          }}>
            <AiZenLogo size={28} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: '900', fontSize: '17px', letterSpacing: '0.06em', color: 'var(--text)' }}>
              Ai<span style={{ color: 'var(--accent)' }}>Zen</span>
            </span>
          </button>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '2px', background: 'var(--bg-2)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)', flexShrink: 0 }}>
            {[
              { id: 'resume', label: 'Resume',       icon: <FileText size={13} /> },
              { id: 'cover',  label: 'Cover Letter', icon: <BookOpen size={13} /> },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '5px 12px', borderRadius: '6px', border: 'none',
                fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: '500',
                cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
                background: tab === t.id ? 'var(--accent)' : 'transparent',
                color:      tab === t.id ? '#fff' : 'var(--text-muted)',
              }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            {!isMobile && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '3px 9px', borderRadius: '4px',
                border: '1px solid rgba(59,130,246,0.2)', background: 'rgba(59,130,246,0.06)',
                fontFamily: 'var(--font-mono)', fontSize: '9px', color: '#3b82f6', letterSpacing: '0.1em',
              }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e', display: 'inline-block' }} />
                AI ACTIVE
              </div>
            )}
            <button onClick={toggleTheme} className="btn btn-ghost" style={{ padding: '6px 8px', borderRadius: '6px' }}>
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </nav>
      )}

      {/* ── HERO ── */}
      {page === 'hero' && (
        <div style={{ position: 'relative' }}>
          <button onClick={toggleTheme} className="btn btn-ghost"
            style={{ position: 'fixed', top: '14px', right: '14px', zIndex: 200, padding: '7px 9px' }}>
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <Hero onGetStarted={() => setPage('builder')} />
        </div>
      )}

      {/* ── BUILDER ── */}
      {isBuilder && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>

          {tab === 'resume' ? (
            <>
              {/* Mobile toggle — only visible on small screens */}
              {isMobile && (
                <div style={{
                  display: 'flex', gap: '8px', padding: '10px 16px',
                  background: 'var(--bg-card)', borderBottom: '1px solid var(--border-subtle)',
                  flexShrink: 0,
                }}>
                  <button
                    onClick={() => setMobilePanel('form')}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: '6px', padding: '9px', borderRadius: '8px', border: 'none',
                      fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: '600',
                      cursor: 'pointer', transition: 'all 0.2s',
                      background: mobilePanel === 'form' ? 'var(--accent)' : 'var(--accent-dim)',
                      color:      mobilePanel === 'form' ? '#fff' : 'var(--accent)',
                    }}
                  >
                    <PenLine size={14} /> Edit Form
                  </button>
                  <button
                    onClick={() => setMobilePanel('preview')}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: '6px', padding: '9px', borderRadius: '8px', border: 'none',
                      fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: '600',
                      cursor: 'pointer', transition: 'all 0.2s',
                      background: mobilePanel === 'preview' ? 'var(--accent)' : 'var(--accent-dim)',
                      color:      mobilePanel === 'preview' ? '#fff' : 'var(--accent)',
                    }}
                  >
                    <Eye size={14} /> Preview & PDF
                  </button>
                </div>
              )}

              {/* Panels */}
              <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>

                {/* FORM — always mounted, hidden via display:none on mobile when showing preview */}
                <div style={{
                  display: isMobile && mobilePanel === 'preview' ? 'none' : 'block',
                  width: isMobile ? '100%' : '380px',
                  flexShrink: 0,
                  overflow: 'auto',
                  padding: '16px',
                  borderRight: isMobile ? 'none' : '1px solid var(--border-subtle)',
                  background: 'var(--bg-2)',
                  WebkitOverflowScrolling: 'touch',
                }}>
                  <ResumeForm data={resumeData} onChange={setResumeData} apiKey={GEMINI_API_KEY} />
                </div>

                {/* PREVIEW — always mounted, hidden via display:none on mobile when showing form */}
                <div style={{
                  display: isMobile && mobilePanel === 'form' ? 'none' : 'flex',
                  flex: 1,
                  flexDirection: 'column',
                  overflow: 'hidden',
                  background: 'var(--bg)',
                  minWidth: 0,
                }}>
                  <ResumePreview data={resumeData} template={template} onTemplateChange={setTemplate} />
                </div>

              </div>
            </>
          ) : (
            /* Cover Letter tab */
            <div style={{
              flex: 1, overflow: 'auto', padding: '24px 16px',
              background: 'var(--bg-2)', WebkitOverflowScrolling: 'touch',
            }}>
              <CoverLetter
                apiKey={GEMINI_API_KEY}
                generateCoverLetter={generateCoverLetter}
                loading={loading.coverLetter}
                error={errors.coverLetter}
                applicantName={resumeData.personal.name}
              />
            </div>
          )}
        </div>
      )}

      {/* ── FOOTER ── */}
      {isBuilder && (
        <div style={{
          textAlign: 'center', padding: '7px 16px', fontSize: '10px',
          color: 'var(--text-dim)', borderTop: '1px solid var(--border-subtle)',
          background: 'var(--bg-card)', flexShrink: 0,
          fontFamily: 'var(--font-mono)', letterSpacing: '0.08em',
        }}>
          AIZEN · Craft Your Career, Effortlessly
        </div>
      )}
    </div>
  );
}
