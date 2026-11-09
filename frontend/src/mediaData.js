// Imagini oficiale și elemente vizuale pentru Primăria Orașului Vânju Mare

export const PAGE_GALLERIES = {
  geografia: {
    title: 'Galerie foto & amplasare teritorială',
    description: 'Imagini cu relieful, așezarea și specificul teritorial al Orașului Vânju Mare',
    images: [
      {
        src: '/imagini/building.jpeg',
        title: 'Sediul Primăriei Vânju Mare',
        caption: 'Strada Rahovei nr. 8, centrul civic al orașului'
      },
      {
        src: '/imagini/primaria-vinju-mare-2.jpg',
        title: 'Fațada Primăriei Vânju Mare',
        caption: 'Clădirea administrativă a orașului Vânju Mare'
      }
    ]
  },
  agricultura: {
    title: 'Podgoria & Agricultura Locală',
    description: 'Renumita tradiție viticolă și culturile agricole ale arealului Vânju Mare',
    images: [
      {
        src: '/imagini/primaria-vinju-mare-2.jpg',
        title: 'Podgoriile & Comunitatea Vânju Mare',
        caption: 'Tradiție viticolă seculară și potențial agricol recunoscut în Mehedinți'
      }
    ]
  },
  infrastructura: {
    title: 'Modernizare Urbană & Lucrări',
    description: 'Investiții în străzi, rețele de apă-canal și iluminat public',
    images: [
      {
        src: '/imagini/building.jpeg',
        title: 'Infrastructură & Servicii Publice',
        caption: 'Centrul civic și căile urbane de acces din Vânju Mare'
      }
    ]
  },
  salubrizare: {
    title: 'Serviciul de Salubrizare & Colectare Selectivă',
    description: 'Afise oficiale de colectare deșeuri menajere și reciclabile de la populație',
    images: [
      {
        src: '/imagini/anunt-salubrizare.jpg',
        title: 'Anunț Ridicare Deșeuri de la Populație',
        caption: 'Graficul și regulile de colectare a deșeurilor menajere'
      },
      {
        src: '/imagini/colecteaza-selectiv.jpg',
        title: 'Ghid Colectare Selectivă',
        caption: 'Instrucțiuni pentru fracțiile reciclabilă și menajeră'
      }
    ]
  }
};

// Imagini reprezentative pentru pagina de start (Homepage)
export const HOMEPAGE_MEDIA = {
  heroSlides: [
    {
      src: '/imagini/building.jpeg',
      tag: 'SEDIU OFICIAL',
      title: 'Primăria Orașului Vânju Mare',
      caption: 'Str. Rahovei, nr. 8, Orașul Vânju Mare, Județul Mehedinți'
    },
    {
      src: '/imagini/primaria-vinju-mare-2.jpg',
      tag: 'ADMINISTRAȚIE LOCALĂ',
      title: 'În Slujba Cetățenilor',
      caption: 'Servicii publice transparente și dezvoltare urbană durabilă'
    }
  ],
  pillars: [
    {
      title: 'Administrație & Servicii Publice',
      slug: 'primaria-vinju-mare',
      image: '/imagini/building.jpeg',
      description: 'Transparență decizională, audiențe cetățeni și modernizarea serviciilor primăriei.',
      href: '#/primaria-vinju-mare'
    },
    {
      title: 'Viticultură & Agricultură',
      slug: 'agricultura',
      image: '/imagini/primaria-vinju-mare-2.jpg',
      description: 'Valorificarea potențialului viticol renumit și sprijinirea fermierilor și producătorilor locali.',
      href: '#/category/dezvoltare/agricultura/'
    },
    {
      title: 'Asistență Socială & Sprijin',
      slug: 'asistenta-sociala',
      image: '/imagini/asistenta-sociala.svg',
      description: 'Sprijin pentru familii, ajutoare de încălzire, alocații, tichete sociale și protecție comunitară.',
      href: '#/compartimentul-de-asistenta-sociala'
    },
    {
      title: 'Salubrizare & Mediu',
      slug: 'salubrizare',
      image: '/imagini/anunt-salubrizare.jpg',
      description: 'Graficul de ridicare a deșeurilor menajere și campaniile de colectare selectivă în oraș.',
      href: '#/category/salubrizare'
    }
  ],
  strategicFocus: [
    {
      title: 'Strategia de Dezvoltare Locală',
      image: '/imagini/building.jpeg',
      description: 'Prioritățile strategice multianuale privind atragerea fondurilor europene și dezvoltarea durabilă a orașului.',
      href: '#/category/informatii-publice/strategia-de-dezvoltare/',
      badge: 'STRATEGIE'
    },
    {
      title: 'Transparență Bugetară & Finanțe',
      image: '/imagini/primaria-vinju-mare-2.jpg',
      description: 'Execuția bugetară, programul anual de investiții și gestiunea transparentă a fondurilor publice.',
      href: '#/category/informatii-publice/buget/',
      badge: 'FINANȚE PUBLICE'
    }
  ],
  leadership: [
    {
      id: 1,
      image: '',
      name: 'Av. MIJAICHE ALEXANDRU',
      role: 'Primar',
      status: 'DEMNITAR ALES',
      dept: 'Conducere Executivă',
      initials: 'AM',
      isMayor: true,
      schedule: 'Luni, Miercuri, Vineri: 09:00 – 11:00'
    },
    {
      id: 2,
      image: '',
      name: 'Ec. TIŢA SAMUEL – EDUARD',
      role: 'Viceprimar',
      status: 'DEMNITAR ALES',
      dept: 'Conducere Executivă',
      initials: 'ST',
      schedule: 'Marți, Joi: 09:00 – 11:00'
    },
    {
      id: 3,
      image: '',
      name: 'Jr. SÎRBU-CREŢU ELENA-ADINA',
      role: 'Secretar General U.A.T.',
      status: 'FUNCȚIONAR PUBLIC DE CONDUCERE',
      dept: 'Coordonare Legalitate & Aparat de Specialitate',
      initials: 'ES',
      schedule: 'Zilnic conform programului'
    },
    {
      id: 4,
      image: '',
      name: 'Consiliul Local Vânju Mare',
      role: 'Autoritate Deliberativă',
      status: 'CONSILIERI LOCALI ALEȘI',
      dept: '15 Consilieri Locali • Comisii de Specialitate',
      initials: 'CL',
      schedule: 'Ședințe lunare ordinare'
    }
  ]
};
