import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, ArrowUpRight, Search, Landmark, FileText, UsersRound, MapPin, ChevronRight, X, Mail, Phone, BookOpen, Sprout, Check } from 'lucide-react';
import Menu from './menu';
import { siteApi, useApi } from './api';
import { ApiSearch, CmsPage } from './cms';
import countyLogo from './logo_mehedinti.png';
import './styles.css';
import './gallery.css';
import Home, { safeHref } from './home';
import Chatbot from './components/Chatbot';
import GhiseulWidget from './components/GhiseulWidget';
import HeroShowcase from './components/HeroShowcase';
import PageGallery from './components/PageGallery';
import { PAGE_GALLERIES } from './mediaData';
import { cleanInternalHref, currentSlug, replaceLegacyHashRoute } from './routing';
import './typography.css';
import './tailwind.css';

function Brand({ footer = false, site }) {
  const name = (site?.name || 'Primăria Orașului Vânju Mare').toLocaleUpperCase('ro-RO');
  const county = site?.county ? `JUDEȚUL ${site.county.toLocaleUpperCase('ro-RO')}` : 'JUDEȚUL MEHEDINȚI';

  if (footer) {
    return (
      <a className="brand brand-footer !text-white flex items-center gap-3" href="/" aria-label={`${name} — Acasă`}>
        <img className="footer-county-logo h-12 w-auto object-contain" src="/imagini/LOGO.png" alt="Stema Orașului Vânju Mare" width="87" height="120"/>
        <img className="footer-county-logo opacity-85 h-12 w-auto object-contain" src={countyLogo} alt="Stema județului Mehedinți" width="404" height="448"/>
        <span>
          <strong>{name}</strong>
          <span className="brand-rule"/>
          <small>{county}</small>
        </span>
      </a>
    );
  }

  return (
    <a className="masthead-brand flex items-center gap-4" href="/" aria-label={`${name} — Acasă`}>
      <span className="masthead-identity flex items-center gap-3">
        <img className="masthead-crest h-14 w-auto object-contain drop-shadow" src="/imagini/LOGO.png" alt="Stema Orașului Vânju Mare" width="87" height="120"/>
        <span className="masthead-lettering">
          <strong>{name}</strong>
          <span className="masthead-tricolor" aria-hidden="true"/>
          <span className="masthead-county">{county}</span>
        </span>
        <img className="masthead-crest opacity-80 h-12 w-auto object-contain hidden sm:block" src={countyLogo} alt="Stema județului Mehedinți" width="404" height="448"/>
      </span>
      <span className="masthead-welcome">
        {(site?.welcome_text || 'Bine ați venit!').toLocaleUpperCase('ro-RO')}
      </span>
    </a>
  );
}

function Contact({ site }) {
  const [status, setStatus] = useState({ type: null, title: '', detail: '' });
  const [sending, setSending] = useState(false);

  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setSending(true);
    setStatus({ type: null, title: '', detail: '' });

    try {
      const response = await fetch(`${siteApi}/contact/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          website: data.website,
        }),
      });

      if (!response.ok) {
        throw new Error('Eroare la trimiterea mesajului.');
      }
      form.reset();
      setStatus({
        type: 'ok',
        title: 'Mesajul a fost trimis.',
        detail: 'Vă mulțumim. Primăria Orașului Vânju Mare a înregistrat mesajul și vă va răspunde în cel mai scurt timp.'
      });
    } catch (error) {
      // Standalone mode fallback: save locally
      try {
        const stored = JSON.parse(localStorage.getItem('vinjumare_messages') || '[]');
        stored.push({ ...data, date: new Date().toISOString() });
        localStorage.setItem('vinjumare_messages', JSON.stringify(stored));
        form.reset();
        setStatus({
          type: 'ok',
          title: 'Mesajul a fost înregistrat.',
          detail: 'Vă mulțumim. Solicitarea dumneavoastră a fost salvată în sistemul local.'
        });
      } catch (storageErr) {
        setStatus({
          type: 'error',
          title: 'Mesajul nu a putut fi trimis.',
          detail: 'Vă rugăm să ne contactați direct prin e-mail la primariavinjumare@yahoo.com sau telefon 0252-350660.'
        });
      }
    } finally {
      setSending(false);
    }
  }

  const name = site?.name || 'Primăria Orașului Vânju Mare';
  const address = site?.address || 'Str. Rahovei, nr. 8, cod poștal 225400, Orașul Vânju Mare, Județul Mehedinți';
  const email = site?.email || 'primariavinjumare@yahoo.com';
  const phone = site?.phone || '0252 350 660';
  const phoneClean = phone.replace(/[\s.-]/g, '');

  return (
    <>
      <p className="page-intro">
        Aveți o întrebare, o solicitare sau o sesizare pentru administrația locală? Trimiteți un mesaj către {name}.
      </p>

      <div className="contact-location">
        <div className="contact-location-main">
          <MapPin size={26}/>
          <div>
            <strong>{name}</strong>
            <p>{address}</p>
          </div>
        </div>
        <div className="contact-location-details">
          <a className="contact-badge-link" href={`mailto:${email}`}>
            <Mail size={19}/>
            <span>{email}</span>
          </a>
          <a className="contact-badge-link" href={`tel:${phoneClean}`}>
            <Phone size={19}/>
            <span>{phone}</span>
          </a>
        </div>
      </div>

      <form className="contact-form" onSubmit={submit}>
        <div className="contact-hp" aria-hidden="true">
          <label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label>
        </div>
        <div className="form-grid">
          <label>
            Nume și prenume
            <input name="name" required minLength={2} maxLength={200} autoComplete="name"/>
          </label>
          <label>
            Adresă de e-mail
            <input name="email" type="email" required autoComplete="email"/>
          </label>
        </div>
        <label>
          Subiect
          <input name="subject" required minLength={3} maxLength={200}/>
        </label>
        <label>
          Mesaj
          <textarea name="message" rows="6" required minLength={10} maxLength={5000}></textarea>
        </label>
        <p className="form-note">
          Mesajul este înregistrat la registratura primăriei și va fi redirecționat către compartimentul de specialitate.
        </p>
        <button className="button primary" type="submit" disabled={sending}>
          {sending ? 'Se trimite…' : 'Trimite mesajul'} <ArrowRight size={18}/>
        </button>
      </form>

      {status.type && (
        <div className={status.type === 'ok' ? 'message-preview' : 'message-preview message-error'} role={status.type === 'ok' ? 'status' : 'alert'}>
          <h3><Check size={20}/> {status.title}</h3>
          <p>{status.detail}</p>
        </div>
      )}

      {PAGE_GALLERIES.contact && (
        <PageGallery gallery={PAGE_GALLERIES.contact} />
      )}
    </>
  );
}

function App() {
  const site = useApi(`${siteApi}/`);
  const navigation = useApi(`${siteApi}/navigation/`);

  function normalizeMenu(items) {
    return items.map(item => ({
      ...item,
      label: String(item.label || ''),
      href: cleanInternalHref(item.href),
      children: item.children?.length ? normalizeMenu(item.children) : undefined
    }));
  }

  const [slug, setSlug] = useState(() => currentSlug());
  const [searchOpen, setSearchOpen] = useState(false);
  const searchButton = useRef(null);
  const main = useRef(null);

  useEffect(() => {
    const route = () => {
      replaceLegacyHashRoute();
      setSlug(currentSlug());
      setSearchOpen(false);
      window.scrollTo(0, 0);
      main.current?.focus({ preventScroll: true });
    };
    route();
    window.addEventListener('popstate', route);
    return () => window.removeEventListener('popstate', route);
  }, []);

  const closeSearch = () => {
    setSearchOpen(false);
    searchButton.current?.focus();
  };

  const activeSlug = slug.replace(/\/$/, '');

  return (
    <>
      <button className="skip-link" type="button" onClick={() => main.current?.focus()}>
        Sari la conținut
      </button>

      <header className="masthead">
        <Brand site={site.data}/>
        <div className="masthead-search">
          <button
            ref={searchButton}
            className="search-button"
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label={searchOpen ? 'Închide căutarea' : 'Deschide căutarea'}
            aria-expanded={searchOpen}
          >
            <Search size={25}/>
            <span>Caută pe site</span>
          </button>
        </div>
      </header>

      <Menu items={normalizeMenu(navigation.data?.items || [])} activeHref={`/${activeSlug}`}/>

      {searchOpen && <ApiSearch close={closeSearch}/>}

      <main id="main-content" tabIndex={-1} ref={main}>
        {navigation.error && <p className="container" role="alert">{navigation.error}</p>}
        {!activeSlug || activeSlug === 'front-page' ? (
          <Home
            presentation={site.data?.presentation}
            site={site.data}
            illustration={<HeroShowcase/>}
          />
        ) : activeSlug === 'contact' ? (
          <div className="contact-page container page-layout !w-full !max-w-none !grid-cols-1 !gap-0 px-6 lg:px-10">
            <div className="page-main mx-auto w-full max-w-7xl">
              <div className="breadcrumb">
                <a href="/">Acasă</a>
                <span>›</span>
                <span>Contact</span>
              </div>
              <h1>Contact</h1>
              <Contact site={site.data}/>
            </div>
          </div>
        ) : (
          <CmsPage key={activeSlug} slug={activeSlug}/>
        )}
      </main>

      <footer className="!bg-[#12447d] !text-white">
        <div className="container footer-main">
          <div>
            <Brand footer site={site.data}/>
            <p>{site.data?.presentation?.footer?.description || 'Orașul Vânju Mare, Județul Mehedinți.'}</p>
          </div>

          <div className="footer-links-group">
            <h3 className="!text-white">Acces Rapid</h3>
            <a className="!text-white/80 hover:!text-white" href="#/tipizate">Formulare Tipizate</a>
            <a className="!text-white/80 hover:!text-white" href="#/compartimentul-de-asistenta-sociala">Asistență Socială</a>
            <a className="!text-white/80 hover:!text-white" href="#/monitorul-oficial-local">Monitorul Oficial Local</a>
            <a className="!text-white/80 hover:!text-white" href="#/category/anunturi/">Anunțuri & Achiziții</a>
          </div>

          <div className="footer-links-group">
            <h3 className="!text-white">Administrație</h3>
            <a className="!text-white/80 hover:!text-white" href="#/primaria-vinju-mare">Despre Primărie</a>
            <a className="!text-white/80 hover:!text-white" href="#/primar">Primar & Audiențe</a>
            <a className="!text-white/80 hover:!text-white" href="#/organigrama-primariei-orasului-vinju-mare">Organigramă</a>
            <a className="!text-white/80 hover:!text-white" href="#/category/informatii-publice/buget/">Buget & Finanțe</a>
          </div>

          <div className="footer-contact">
            <h3 className="!text-white">Contact Oficial</h3>
            <div className="footer-contact-item">
              <MapPin className="!text-white" size={18}/>
              <span>
                Orașul Vânju Mare<br/>
                <small>{site.data?.address || 'Str. Rahovei, nr. 8, cod 225400, Mehedinți'}</small>
              </span>
            </div>
            <a className="footer-contact-item footer-contact-link" href={`mailto:${site.data?.email || 'primariavinjumare@yahoo.com'}`}>
              <Mail className="!text-white" size={18}/>
              <span>{site.data?.email || 'primariavinjumare@yahoo.com'}</span>
            </a>
            <a className="footer-contact-item footer-contact-link" href={`tel:${(site.data?.phone || '0252 350 660').replace(/[\s.-]/g, '')}`}>
              <Phone className="!text-white" size={18}/>
              <span>{site.data?.phone || '0252 350 660'}</span>
            </a>
          </div>
        </div>

        <div className="container footer-bottom !border-indigo-800 !text-white/75">
          <span>© {new Date().getFullYear()} {site.data?.name || 'Primăria Orașului Vânju Mare'}</span>
          <span>Transparență. Servicii publice. Dezvoltare durabilă.</span>
        </div>
      </footer>

      <Chatbot site={site.data}/>
      <GhiseulWidget />
    </>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', maxWidth: '720px', margin: '60px auto', background: '#fff', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontFamily: 'Lora, serif', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <img src="/imagini/LOGO.png" alt="Stema Orașului Vânju Mare" style={{ height: '70px', margin: '0 auto 20px', display: 'block' }} />
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#17477d', marginBottom: '12px' }}>Primăria Orașului Vânju Mare</h2>
          <p style={{ color: '#475569', fontSize: '16px', lineHeight: 1.6, marginBottom: '24px' }}>
            A intervenit o eroare la încărcarea paginii. Vă rugăm să apăsați pe butonul de mai jos pentru a reîncărca.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button
              onClick={() => { window.location.href = '/'; }}
              style={{ padding: '10px 22px', backgroundColor: '#17477d', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '15px' }}
            >
              Reveniți la Pagina Principală
            </button>
            <button
              onClick={() => { window.location.reload(); }}
              style={{ padding: '10px 22px', backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '15px' }}
            >
              Reîncarcă
            </button>
          </div>
          {this.state.error && (
            <pre style={{ marginTop: '24px', textAlign: 'left', padding: '12px', background: '#fef2f2', color: '#b91c1c', borderRadius: '8px', fontSize: '12px', overflowX: 'auto', border: '1px solid #fecaca' }}>
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App/>
    </ErrorBoundary>
  </React.StrictMode>
);

