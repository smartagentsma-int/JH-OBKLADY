(function() {
  const template = document.createElement('template');
  template.innerHTML = `
    <style>
      :host { all: initial; }
      .floating-cta {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 0.75rem; 
      }
      .floating-btn {
        width: 3.5rem;
        height: 3.5rem;
        border-radius: 50%;
        background: #f8f3eb;
        color: #c9a87c;
        border: 1px solid rgba(201,168,124,0.2);
        cursor: none;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 32px rgba(0,0,0,0.25);
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        position: relative;
        backdrop-filter: blur(10px);
      }
      .floating-btn:hover {
        transform: scale(1.15);
        background: #c9a87c;
        color: #f8f3eb;
        border-color: #c9a87c;
      }
      .floating-btn-tooltip {
        position: absolute;
        right: calc(100% + 1rem);
        top: 50%;
        transform: translateY(-50%);
        background: #0f0c0b;
        color: white;
        padding: 0.5rem 1rem;
        font-size: 0.7rem;
        font-family: 'Space Grotesk', sans-serif;
        letter-spacing: 0.05em;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        pointer-events: none;
        border-radius: 2px;
      }
      .floating-btn:hover .floating-btn-tooltip {
        opacity: 1;
        visibility: visible;
      }
      a {
        color: inherit;
        text-decoration: none;
      }
      svg {
        width: 1.25rem;
        height: 1.25rem;
      }
    </style>
    <div class="floating-cta">
      <button class="floating-btn btn-reserve" type="button">
        <span class="floating-btn-tooltip">Rezervovat konzultaci</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
      </button>
      <a class="floating-btn whatsapp" href="https://wa.me/420606853760" target="_blank" rel="noopener noreferrer">
        <span class="floating-btn-tooltip">WhatsApp</span>
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
      <a class="floating-btn phone" href="tel:+420606853760">
        <span class="floating-btn-tooltip">Zavolat</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
        </svg>
      </a>
    </div>
  `;

  class FloatingCta extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
      const reserveButton = this.shadowRoot.querySelector('.btn-reserve');
      reserveButton.addEventListener('click', () => {
        if (typeof window.openReservation === 'function') {
          window.openReservation();
          return;
        }
        this.dispatchEvent(new CustomEvent('open-reservation', {
          bubbles: true,
          composed: true,
        }));
      });

      const whatsappLink = this.getAttribute('whatsapp') || 'https://wa.me/420606853760';
      const phoneNumber = this.getAttribute('phone') || '+420606853760';
      this.shadowRoot.querySelector('.whatsapp').setAttribute('href', whatsappLink);
      this.shadowRoot.querySelector('.phone').setAttribute('href', `tel:${phoneNumber.replace(/[^+0-9]/g, '')}`);
    }
  }

  if (!customElements.get('floating-cta')) {
    customElements.define('floating-cta', FloatingCta);
  }

  function attachFloatingCta() {
    if (document.querySelector('floating-cta')) return;
    const element = document.createElement('floating-cta');
    document.body.appendChild(element);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachFloatingCta);
  } else {
    attachFloatingCta();
  }
})();
