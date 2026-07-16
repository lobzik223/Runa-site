import { FormEvent, useEffect, useRef, useState } from 'react';
import { API_CONFIG } from '../config/api.config';
import './ContactTicketSection.css';
import './FeaturesSection.css';

type Status = 'idle' | 'sending' | 'success' | 'error';

function IconUser({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M5.5 19.5c.9-3.2 3.4-5 6.5-5s5.6 1.8 6.5 5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconMail({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M4.5 7.5 12 13l7.5-5.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMessage({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 18.5 4.5 20.5V7.5A2.5 2.5 0 0 1 7 5h10a2.5 2.5 0 0 1 2.5 2.5v8A2.5 2.5 0 0 1 17 18H8.5L6 18.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M8.5 10h7M8.5 13.5h4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function IconSend({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4.5 11.2 19.2 4.6c.7-.3 1.4.4 1.1 1.1L13.7 20.4c-.3.7-1.3.6-1.5-.1l-1.8-5.6-5.6-1.8c-.7-.2-.8-1.2-.1-1.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="m10.4 13 3.3-3.3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function IconCheck({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.75" />
      <path d="m8.5 12.2 2.4 2.4 4.6-4.8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ContactTicketSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) section.classList.add('is-visible');
      },
      { threshold: 0.12 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (trimmedName.length < 2) {
      setStatus('error');
      setErrorText('Укажите имя (минимум 2 символа).');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setStatus('error');
      setErrorText('Укажите корректный email.');
      return;
    }
    if (trimmedMessage.length < 10) {
      setStatus('error');
      setErrorText('Опишите вопрос чуть подробнее (от 10 символов).');
      return;
    }

    setStatus('sending');
    setErrorText('');

    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SUPPORT_TICKET}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Runa-Site-Key': API_CONFIG.SITE_KEY,
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          message: trimmedMessage,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as { message?: string | string[]; ok?: boolean };

      if (!res.ok) {
        const msg = Array.isArray(data.message)
          ? data.message[0]
          : typeof data.message === 'string'
            ? data.message
            : 'Не удалось отправить тикет. Попробуйте позже.';
        setStatus('error');
        setErrorText(msg);
        return;
      }

      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setStatus('error');
      setErrorText('Нет связи с сервером. Проверьте интернет и попробуйте ещё раз.');
    }
  };

  return (
    <section className="runa-section contact-ticket" id="support" ref={sectionRef}>
      <div className="runa-section-bg contact-ticket-bg" aria-hidden="true" />
      <div className="runa-section-inner contact-ticket-inner">
        <div className="contact-ticket-card">
          <div className="contact-ticket-copy">
            <p className="runa-eyebrow">Поддержка</p>
            <h2 className="runa-section-title">Оставить тикет</h2>
            <p className="runa-section-desc contact-ticket-desc">
              Напишите нам — ответим по подписке, аккаунту и работе приложения. Обычно в течение дня.
            </p>
            <ul className="contact-ticket-hints">
              <li>
                <IconMail className="contact-ticket-hint-icon" />
                <span>Ответ придёт на указанную почту</span>
              </li>
              <li>
                <IconMessage className="contact-ticket-hint-icon" />
                <span>Укажите ID аккаунта, если вопрос по Premium</span>
              </li>
            </ul>
          </div>

          {status === 'success' ? (
            <div className="contact-ticket-success" role="status">
              <IconCheck className="contact-ticket-success-icon" />
              <h3>Тикет отправлен</h3>
              <p>Мы получили ваше сообщение и ответим на указанную почту.</p>
              <button
                type="button"
                className="contact-ticket-secondary"
                onClick={() => setStatus('idle')}
              >
                Отправить ещё
              </button>
            </div>
          ) : (
            <form className="contact-ticket-form" onSubmit={(e) => void onSubmit(e)} noValidate>
              <label className="contact-field">
                <span className="contact-field-label">Имя</span>
                <span className="contact-field-control">
                  <IconUser className="contact-field-icon" />
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    placeholder="Как к вам обращаться"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={80}
                    required
                    disabled={status === 'sending'}
                  />
                </span>
              </label>

              <label className="contact-field">
                <span className="contact-field-label">Почта</span>
                <span className="contact-field-control">
                  <IconMail className="contact-field-icon" />
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    maxLength={254}
                    required
                    disabled={status === 'sending'}
                  />
                </span>
              </label>

              <label className="contact-field contact-field--area">
                <span className="contact-field-label">Письмо</span>
                <span className="contact-field-control contact-field-control--area">
                  <IconMessage className="contact-field-icon contact-field-icon--area" />
                  <textarea
                    name="message"
                    placeholder="Опишите вопрос или проблему…"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={4000}
                    rows={5}
                    required
                    disabled={status === 'sending'}
                  />
                </span>
              </label>

              {status === 'error' && errorText ? (
                <p className="contact-ticket-error" role="alert">
                  {errorText}
                </p>
              ) : null}

              <button
                type="submit"
                className="contact-ticket-submit"
                disabled={status === 'sending'}
              >
                <IconSend className="contact-ticket-submit-icon" />
                <span>{status === 'sending' ? 'Отправляем…' : 'Отправить тикет'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
