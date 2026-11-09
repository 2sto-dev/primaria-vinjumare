import { useEffect, useState } from 'react';
import siteData from './site.json';
import navData from './navigation.json';
import pagesData from './content.json';
import docsData from './documents.json';
import monitorData from './monitor.json';

export const apiBase = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '');
export const siteSlug = import.meta.env.VITE_SITE_SLUG || 'vinjumare';
export const siteApi = `${apiBase}/sites/${encodeURIComponent(siteSlug)}`;

const CATEGORY_TITLES = {
  'anunturi': 'Anunțuri Publice & Oficiale',
  'anunturi-concesionari-inchirieri-vanzari': 'Anunțuri concesionări, închirieri, vânzări',
  'anunturi-diverse': 'Anunțuri diverse',
  'anunturi-concursuri-si-examene': 'Anunțuri concursuri și examene',
  'anunturi-achizitii': 'Anunțuri achiziții publice',
  'statutul-unitatii-administrativ-teritoriale': 'Statutul Unității Administrativ-Teritoriale',
  'regulamentele-privind-procedurile-administrative': 'Regulamentele privind procedurile administrative',
  'hotararile-autoritatii-deliberative': 'Hotărârile autorității deliberative',
  'dispozitiile-autoritatii-executive': 'Dispozițiile autorității executive',
  'documente-si-informatii-financiare': 'Documente și informații financiare',
  'alte-documente': 'Alte documente de interes public',
  'informatii-publice': 'Informații de interes public',
  'dezvoltare': 'Strategii și proiecte de dezvoltare',
  'raportul-anual-privind-starea-economica-sociala-si-de-mediu': 'Raportul anual privind starea economică, socială și de mediu',
  'parteneri': 'Parteneri instituționali',
  'proiecte-investitionale': 'Proiecte investiționale',
  'regulament': 'Regulament de organizare și funcționare',
  'comisii-de-specialitate': 'Comisii de specialitate ale Consiliului Local',
  'rapoartele-de-activitate-ale-consilierilor-locali': 'Rapoartele de activitate ale consilierilor locali',
  'strategia-de-dezvoltare': 'Strategia de dezvoltare locală',
  'buget': 'Buget & Finanțe Publice',
  'stat-de-functii': 'Ștat de funcții',
  'alegeri-2024': 'Alegeri 2024'
};

// Mock / Standalone fallback handler for local frontend development
function resolveLocalEndpoint(url) {
  if (!url) return null;
  const cleanUrl = url.split('#')[0];
  const [pathname, searchStr] = cleanUrl.split('?');
  const params = new URLSearchParams(searchStr || '');

  // 1. Site info: /sites/:slug/
  if (pathname.endsWith(`/sites/${siteSlug}`) || pathname.endsWith(`/sites/${siteSlug}/`)) {
    return siteData;
  }

  // 2. Navigation: /sites/:slug/navigation/
  if (pathname.includes('/navigation')) {
    return navData;
  }

  // 3. Monitor registers: /sites/:slug/monitor/registers/
  if (pathname.includes('/monitor/registers')) {
    return {
      count: monitorData.registers.length,
      next: null,
      previous: null,
      results: monitorData.registers
    };
  }

  // 4. Monitor entries: /sites/:slug/monitor/entries/
  if (pathname.includes('/monitor/entries')) {
    const reg = params.get('register') || '';
    const q = (params.get('search') || '').toLowerCase().trim();
    const yr = params.get('year') || '';
    const pageNum = parseInt(params.get('page') || '1', 10);
    const pageSize = parseInt(params.get('page_size') || '20', 10);

    let filtered = monitorData.entries.filter(e => {
      if (reg && e.register !== reg) return false;
      if (yr && String(e.year) !== yr) return false;
      if (q && !e.title.toLowerCase().includes(q) && !(e.number && String(e.number).includes(q))) return false;
      return true;
    });

    const start = (pageNum - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);

    return {
      count: filtered.length,
      next: start + pageSize < filtered.length ? `page=${pageNum + 1}` : null,
      previous: pageNum > 1 ? `page=${pageNum - 1}` : null,
      results: paginated.map(e => ({
        ...e,
        document: e.document || {
          download_url: e.file_url || '#/monitorul-oficial-local',
          original_filename: `${e.title || 'document'}.pdf`,
          available_locally: false
        }
      }))
    };
  }

  // 5. Pages list / by parent: /sites/:slug/pages/?parent=...
  if (pathname.endsWith('/pages') || pathname.endsWith('/pages/')) {
    const parentId = params.get('parent');
    const pageNum = parseInt(params.get('page') || '1', 10);
    const pageSize = parseInt(params.get('page_size') || '10', 10);

    let filtered = pagesData;
    if (parentId !== null && parentId !== undefined) {
      const pId = parseInt(parentId, 10);
      filtered = pagesData.filter(p => p.parent === pId);
    }

    const start = (pageNum - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);

    return {
      count: filtered.length,
      next: start + pageSize < filtered.length ? `page=${pageNum + 1}` : null,
      previous: pageNum > 1 ? `page=${pageNum - 1}` : null,
      results: paginated.map(e => ({
        ...e,
        document: e.document || {
          download_url: e.file_url || '#/monitorul-oficial-local',
          original_filename: `${e.title || 'document'}.pdf`,
          available_locally: false
        }
      }))
    };
  }

  // 6. Single Page: /sites/:slug/pages/:slug/
  const pagePrefix = `/sites/${siteSlug}/pages/`;
  const pageIdx = pathname.indexOf(pagePrefix);
  if (pageIdx !== -1) {
    const rawSlug = pathname.slice(pageIdx + pagePrefix.length).replace(/\/$/, '');
    const targetSlug = decodeURIComponent(rawSlug);
    const withoutCategory = targetSlug.replace(/^category\//, '');
    const lastSegment = targetSlug.split('/').filter(Boolean).pop();

    const found = pagesData.find(p => {
      if (p.slug === targetSlug) return true;
      if (p.slug === withoutCategory) return true;
      if (p.slug === lastSegment) return true;
      if (Array.isArray(p.slugs)) {
        if (p.slugs.includes(targetSlug)) return true;
        if (p.slugs.includes(withoutCategory)) return true;
        if (p.slugs.includes(lastSegment)) return true;
      }
      return false;
    });

    if (found) {
      return {
        id: found.id,
        title: found.title,
        slug: found.slug,
        body: found.content,
        created_at: found.date,
        updated_at: found.date,
        section: found.parent ? { id: found.parent, title: '' } : null
      };
    }

    if (targetSlug === 'formulare' || withoutCategory === 'formulare' || lastSegment === 'formulare') {
      const tipizate = pagesData.find(p => p.slug === 'tipizate');
      if (tipizate) {
        return {
          id: tipizate.id,
          title: 'Formulare și Tipizate',
          slug: 'formulare',
          body: tipizate.content,
          created_at: tipizate.date,
          updated_at: tipizate.date,
          section: null
        };
      }
    }

    const catKey = lastSegment || withoutCategory || targetSlug;
    const catTitle = CATEGORY_TITLES[catKey] || (catKey ? catKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Informații publice');
    return {
      id: 90000 + Math.abs(catKey.split('').reduce((acc, c) => ((acc << 5) - acc) + c.charCodeAt(0), 0) % 10000),
      title: catTitle,
      slug: targetSlug,
      body: `<p>Informații publice, anunțuri și documente oficiale pentru secțiunea <strong>${catTitle}</strong> a Primăriei Orașului Vânju Mare.</p>`,
      created_at: '2026-01-01',
      updated_at: '2026-01-01',
      section: null
    };
  }

  // 7. Documents: /sites/:slug/documents/?...
  if (pathname.includes('/documents')) {
    const pageSlug = params.get('page_slug') || '';
    const cleanSlug = pageSlug.replace(/^category\//, '').split('/').filter(Boolean).pop();
    const q = (params.get('search') || '').toLowerCase().trim();
    const pageNum = parseInt(params.get('page') || '1', 10);
    const pageSize = parseInt(params.get('page_size') || '10', 10);

    let filtered = docsData;
    if (pageSlug) {
      filtered = filtered.filter(d => 
        d.page_slug === pageSlug || 
        d.page_slug === cleanSlug || 
        (pageSlug.includes('anunturi') && (d.page_slug === 'anunturi' || (Array.isArray(d.page_slugs) && d.page_slugs.includes('anunturi')))) ||
        (Array.isArray(d.page_slugs) && (d.page_slugs.includes(pageSlug) || d.page_slugs.includes(cleanSlug)))
      );
    }
    if (q) {
      filtered = filtered.filter(d => d.title.toLowerCase().includes(q) || d.original_filename.toLowerCase().includes(q));
    }

    const start = (pageNum - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);

    return {
      count: filtered.length,
      next: start + pageSize < filtered.length ? `page=${pageNum + 1}` : null,
      previous: pageNum > 1 ? `page=${pageNum - 1}` : null,
      results: paginated.map(d => ({
        ...d,
        published_at: d.year ? `${d.year}-01-01` : '2024-01-01'
      }))
    };
  }

  // 8. Search: /sites/:slug/search/?...
  if (pathname.includes('/search')) {
    const q = (params.get('search') || '').toLowerCase().trim();
    const pageNum = parseInt(params.get('page') || '1', 10);
    const pageSize = parseInt(params.get('page_size') || '10', 10);

    if (!q) {
      return { count: 0, next: null, previous: null, results: [] };
    }

    const results = [];
    // Search pages
    for (const p of pagesData) {
      if (p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q)) {
        results.push({
          title: p.title,
          href: `/${p.slug}`,
          kind: 'page',
          id: p.id
        });
      }
    }
    // Search documents
    for (const d of docsData) {
      if (d.title.toLowerCase().includes(q) || d.original_filename.toLowerCase().includes(q)) {
        results.push({
          title: d.title,
          href: d.download_url || '#/anunturi',
          kind: 'document',
          id: d.id
        });
      }
    }

    const start = (pageNum - 1) * pageSize;
    const paginated = results.slice(start, start + pageSize);

    return {
      count: results.length,
      next: start + pageSize < results.length ? `page=${pageNum + 1}` : null,
      previous: pageNum > 1 ? `page=${pageNum - 1}` : null,
      results: paginated
    };
  }

  return null;
}

export function useApi(url) {
  const [state, setState] = useState(() => {
    if (!url) return { data: null, error: null, loading: false, url: null };
    const local = resolveLocalEndpoint(url);
    if (local !== null) {
      return { data: local, error: null, loading: false, url };
    }
    return { data: null, error: null, loading: true, url };
  });

  useEffect(() => {
    if (!url) {
      setState({ data: null, error: null, loading: false, url });
      return;
    }

    const localFallback = resolveLocalEndpoint(url);
    if (localFallback !== null) {
      setState({ data: localFallback, error: null, loading: false, url });
      return;
    }

    if (!import.meta.env.VITE_BACKEND_URL) {
      setState({ data: null, error: 'Pagină indisponibilă', loading: false, url });
      return;
    }

    const controller = new AbortController();
    setState({ data: null, error: null, loading: true, url });

    const fetchTimeout = setTimeout(() => controller.abort(), 1200);

    fetch(url, { signal: controller.signal })
      .then(res => {
        clearTimeout(fetchTimeout);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setState({ data, error: null, loading: false, url });
      })
      .catch(err => {
        clearTimeout(fetchTimeout);
        const fallback = resolveLocalEndpoint(url);
        if (fallback !== null) {
          setState({ data: fallback, error: null, loading: false, url });
        } else {
          setState({ data: null, error: err.name === 'AbortError' ? 'Timeout server' : err.message, loading: false, url });
        }
      });

    return () => {
      clearTimeout(fetchTimeout);
      controller.abort();
    };
  }, [url]);

  return state.url === url ? state : { data: resolveLocalEndpoint(url), error: null, loading: false };
}

export function useDebounce(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
