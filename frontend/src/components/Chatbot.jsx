import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, ChevronDown, X, Send, Bot, FileText, ArrowUpRight, Mail } from 'lucide-react';
import { siteApi } from '../api';
import countyLogo from '../logo_mehedinti.png';
import { cleanInternalHref } from '../routing';
import './chatbot.css';

const INITIAL_GREETING = 'Bună ziua! Sunt asistentul virtual al Primăriei Orașului Vânju Mare. Cu ce vă putem ajuta astăzi?';

const SUGGESTIONS = [
  '📞 Care sunt datele de contact și programul?',
  '🏛️ Cine face parte din conducerea primăriei?',
  '📄 Ce formulare de asistență socială există?',
  '📜 Cum accesez Monitorul Oficial Local?'
];

// Local knowledge base for standalone mode
function answerLocally(query) {
  const q = query.toLowerCase();

  if (/\b(cine|care|nume)\b.*\bprimar\b/.test(q) && !q.includes('viceprimar')) {
    return {
      text: 'Primarul Orașului Vânju Mare este **Av. MIJAICHE ALEXANDRU** (demnitar ales).\n\nProgram audiențe: Luni, Miercuri, Vineri între orele 09:00 – 11:00.',
      sources: [{ title: 'Conducere Primar', url: '#/primar' }]
    };
  }

  if (q.includes('contact') || q.includes('telefon') || q.includes('email') || q.includes('mail') || q.includes('numar') || q.includes('adresa') || q.includes('fax') || q.includes('program')) {
    return {
      text: '**Datele oficiale de contact ale Primăriei Orașului Vânju Mare:**\n\n' +
        '• **Adresă:** Str. Rahovei, nr. 8, cod poștal 225400, Orașul Vânju Mare, Județul Mehedinți\n' +
        '• **Telefon:** 0252 350 660\n' +
        '• **Fax:** 0252 350 097\n' +
        '• **E-mail:** primariavinjumare@yahoo.com\n\n' +
        '**Program Relații cu Publicul (Direcția Impozite și Taxe / Registratură):**\n' +
        '• Luni – Joi: 08:00 – 16:00\n' +
        '• Vineri: 08:00 – 14:00\n\n' +
        'Puteți transmite solicitări online accesând [Formularul de Contact](#/contact).',
      sources: [{ title: 'Pagina de Contact', url: '#/contact' }]
    };
  }

  if (q.includes('primar') || q.includes('viceprimar') || q.includes('conducere') || q.includes('organigrama') || q.includes('secretar') || q.includes('echipa')) {
    return {
      text: '**Conducerea Executivă a Primăriei Orașului Vânju Mare:**\n\n' +
        '• 🎖️ **Primar:** Av. MIJAICHE ALEXANDRU *(Demnitar ales)*\n' +
        '• 🎖️ **Viceprimar:** Ec. TIŢA SAMUEL – EDUARD *(Demnitar ales)*\n' +
        '• 📜 **Secretar General U.A.T.:** Jr. SÎRBU-CREŢU ELENA-ADINA\n\n' +
        '**Program Audiențe:**\n' +
        '• Primar: Luni, Miercuri, Vineri: 09:00 – 11:00\n' +
        '• Viceprimar: Marți, Joi: 09:00 – 11:00\n\n' +
        'Pentru schema completă a compartimentelor, consultați [Organigrama Primăriei](#/organigrama-primariei-orasului-vinju-mare).',
      sources: [
        { title: 'Organigrama', url: '#/organigrama-primariei-orasului-vinju-mare' },
        { title: 'Primar', url: '#/primar' },
        { title: 'Viceprimar', url: '#/viceprimar' }
      ]
    };
  }

  if (q.includes('unde') || q.includes('localiz') || q.includes('oras') || q.includes('asezare') || q.includes('istor') || q.includes('vin') || q.includes('podgori')) {
    return {
      text: '**Despre Orașul Vânju Mare:**\n\n' +
        'Orașul Vânju Mare este situat în partea de sud a județului Mehedinți, în inima Câmpiei Blahniței, la o distanță de circa 35 km de municipiul Drobeta-Turnu Severin.\n\n' +
        'Localitatea este renumită la nivel național și internațional pentru **Podgoria Vânju Mare** și tradiția viticolă seculară, beneficiind de un microclimat ideal pentru producerea vinurilor de calitate superioară.',
      sources: [
        { title: 'Despre Primărie', url: '#/primaria-vinju-mare' },
        { title: 'Agricultură & Viticultură', url: '#/category/dezvoltare/agricultura/' }
      ]
    };
  }

  if (q.includes('tipizat') || q.includes('formular') || q.includes('asistent') || q.includes('social') || q.includes('alocatie') || q.includes('incalzire') || q.includes('cerere') || q.includes('vmg') || q.includes('vmi') || q.includes('tichet')) {
    return {
      text: '**Formulare și Asistență Socială Vânju Mare:**\n\n' +
        'Compartimentul de Asistență Socială pune la dispoziție formulare pentru:\n' +
        '• Ajutor pentru încălzirea locuinței și supliment pentru energie\n' +
        '• Venit Minim de Incluziune (VMI / fost VMG)\n' +
        '• Alocație de stat și alocație de susținere a familiei\n' +
        '• Indemnizație creștere copil și stimulent de inserție\n' +
        '• Tichete sociale pe suport electronic și stimulent educațional de grădiniță\n' +
        '• Dosare handicap copii și adulți\n\n' +
        'Consultați lista completă în secțiunile dedicate.',
      sources: [
        { title: 'Formulare Tipizate', url: '#/tipizate' },
        { title: 'Compartimentul Asistență Socială', url: '#/compartimentul-de-asistenta-sociala' }
      ]
    };
  }

  if (q.includes('monitor') || q.includes('hotarar') || q.includes('hcl') || q.includes('dispoziti') || q.includes('buget') || q.includes('finant')) {
    return {
      text: '**Monitorul Oficial Local (MOL):**\n\n' +
        'Conform OUG nr. 57/2019 privind Codul Administrativ, actele oficiale sunt structurate în 6 registre:\n' +
        '1. Statutul unității administrativ-teritoriale\n' +
        '2. Regulamentele privind procedurile administrative\n' +
        '3. Hotărârile Consiliului Local (HCL)\n' +
        '4. Dispozițiile autorității executive (Dispoziții Primar)\n' +
        '5. Documente și informații financiare (Bugete, execuție)\n' +
        '6. Alte documente de interes public\n\n' +
        'Puteți consulta și descărca actele din [Monitorul Oficial Local](#/monitorul-oficial-local).',
      sources: [
        { title: 'Monitorul Oficial Local', url: '#/monitorul-oficial-local' },
        { title: 'Buget', url: '#/category/informatii-publice/buget/' }
      ]
    };
  }

  if (q.includes('concurs') || q.includes('angaj') || q.includes('examen') || q.includes('anunt') || q.includes('achiziti') || q.includes('licit')) {
    return {
      text: '**Anunțuri și Concursuri de Angajare:**\n\n' +
        'Anunțurile privind concursurile de angajare, examenele de promovare, achizițiile publice și comunicările prin publicitate sunt actualizate periodic pe site.',
      sources: [
        { title: 'Anunțuri Oficiale', url: '#/category/anunturi/' },
        { title: 'Anunțuri Concursuri', url: '#/category/anunturi/anunturi-concursuri-si-examene/' }
      ]
    };
  }

  return {
    text: `Am înregistrat solicitarea dumneavoastră legată de „${query}”.\n\n` +
      'Puteți căuta informația pe site sau puteți naviga direct către secțiunile principale:\n' +
      '• [Despre Primărie](#/primaria-vinju-mare)\n' +
      '• [Formulare & Tipizate](#/tipizate)\n' +
      '• [Monitorul Oficial Local](#/monitorul-oficial-local)\n' +
      '• [Contact & Localizare](#/contact)',
    sources: [
      { title: 'Monitorul Oficial Local', url: '#/monitorul-oficial-local' },
      { title: 'Contact', url: '#/contact' }
    ]
  };
}

function FormattedText({ text }) {
  if (!text) return null;
  const paragraphs = text.split('\n\n');

  return (
    <>
      {paragraphs.map((para, pIdx) => {
        const lines = para.split('\n');
        const isBulletList = lines.every(l => l.trim().startsWith('•') || l.trim().startsWith('-'));

        if (isBulletList) {
          return (
            <ul key={pIdx}>
              {lines.map((l, lIdx) => {
                const clean = l.replace(/^[•-]\s*/, '');
                return <li key={lIdx}>{renderInline(clean)}</li>;
              })}
            </ul>
          );
        }

        return (
          <p key={pIdx}>
            {lines.map((l, lIdx) => (
              <React.Fragment key={lIdx}>
                {renderInline(l)}
                {lIdx < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}

function renderInline(str) {
  const parts = [];
  const regex = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(str)) !== null) {
    if (match.index > lastIndex) {
      parts.push(str.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(<strong key={match.index}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('[') && token.includes('](')) {
      const label = token.substring(1, token.indexOf(']('));
      const url = cleanInternalHref(token.substring(token.indexOf('](') + 2, token.length - 1));
      parts.push(
        <a key={match.index} href={url} target={url.startsWith('http') || url.includes('/download/') ? '_blank' : undefined} rel="noreferrer">
          {label}
        </a>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < str.length) {
    parts.push(str.substring(lastIndex));
  }

  return parts.length > 0 ? parts : str;
}

export default function Chatbot({ site }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: INITIAL_GREETING,
      sources: []
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages, loading]);

  const handleSend = async (messageText) => {
    const text = (messageText || input).trim();
    if (!text || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.slice(-4).map(m => ({
        role: m.sender,
        text: m.text
      }));

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);

      const res = await fetch(`${siteApi}/chatbot/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ message: text, history }),
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (!res.ok) throw new Error('API unavailable');

      const data = await res.json();
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: data.reply || 'Nu am găsit informații specifice.',
        sources: data.sources || []
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const localAnswer = answerLocally(text);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: localAnswer.text,
        sources: localAnswer.sources
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="chatbot-bubble-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Închide asistentul virtual' : 'Deschide asistentul virtual'}
        aria-expanded={isOpen}
      >
        {isOpen ? <ChevronDown size={30} /> : <MessageCircle size={28} />}
        <span className="chatbot-ai-label" aria-hidden="true">AI</span>
      </button>

      {isOpen && (
        <div className="chatbot-window" role="dialog" aria-label="Asistent Virtual Primăria Orașului Vânju Mare">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar-wrap">
                <img src="/imagini/LOGO.png" alt="Stema Vânju Mare" width="26" height="32" className="object-contain" />
                <span className="chatbot-status-dot" aria-label="Online" />
              </div>
              <div className="chatbot-title">
                <strong>Asistent Virtual</strong>
                <span>{site?.name || 'Primăria Orașului Vânju Mare'} • Online</span>
              </div>
            </div>
            <button
              className="chatbot-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Închide fereastra de chat"
            >
              <X size={20} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`chat-msg ${msg.sender}`}>
                {msg.sender === 'bot' && (
                  <div className="chat-msg-avatar">
                    <Bot size={16} />
                  </div>
                )}
                <div className="chat-msg-bubble">
                  <FormattedText text={msg.text} />
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="chat-sources">
                      {msg.sources.map((s, idx) => (
                        <a
                          key={idx}
                          href={cleanInternalHref(s.url)}
                          className="chat-source-chip"
                          target={s.url.startsWith('http') || s.url.includes('/download/') || s.url.includes('/uploads/') ? '_blank' : undefined}
                          rel="noreferrer"
                        >
                          <FileText size={12} />
                          <span>{s.title}</span>
                          <ArrowUpRight size={11} />
                        </a>
                      ))}
                    </div>
                  )}
                  {msg.sender === 'bot' && msg.id !== 1 && (
                    <a className="chat-contact-action" href="#/contact">
                      <Mail size={14} />
                      Trimite o solicitare către primărie
                      <ArrowUpRight size={14} />
                    </a>
                  )}
                </div>
              </div>
            ))}

            {messages.length === 1 && (
              <div className="chat-quick-suggestions">
                <span className="chat-suggestions-title">Întrebări frecvente:</span>
                <div className="chat-suggestions-list">
                  {SUGGESTIONS.map((s, idx) => (
                    <button
                      key={idx}
                      className="chat-suggestion-chip"
                      onClick={() => handleSend(s.replace(/^[^\w\s]+/, '').trim())}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="chat-msg bot">
                <div className="chat-msg-avatar"><Bot size={16}/></div>
                <div className="chat-msg-bubble chat-typing-bubble" aria-label="Se generează răspunsul...">
                  <span className="chat-dot" />
                  <span className="chat-dot" />
                  <span className="chat-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input-area">
            <form className="chatbot-input-form" onSubmit={e => { e.preventDefault(); handleSend(); }}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Scrieți o întrebare…"
                aria-label="Mesaj pentru asistent"
                disabled={loading}
              />
              <button
                type="submit"
                className="chatbot-send-btn"
                disabled={!input.trim() || loading}
                aria-label="Trimite mesajul"
              >
                <Send size={18} />
              </button>
            </form>
            <small className="chatbot-footer-caption">
              Răspunsuri generate pe baza bazei de date oficiale a primăriei
            </small>
          </div>
        </div>
      )}
    </>
  );
}

