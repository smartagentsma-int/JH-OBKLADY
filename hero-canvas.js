(function() {
  const template = document.createElement('template');
  template.innerHTML = `
    <style>
      :host { all: initial; }
      canvas {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: -1;
      }
    </style>
    <canvas></canvas>
  `;

  class HeroCanvas extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.canvas = this.shadowRoot.querySelector('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.particleCount = parseInt(this.getAttribute('particle-count')) || 60;
      this.init();
    }

    init() {
      this.resizeCanvas();
      window.addEventListener('resize', () => this.resizeCanvas());
      this.initParticles();
      this.animateParticles();
    }

    resizeCanvas() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    initParticles() {
      this.particles = [];
      for (let i = 0; i < this.particleCount; i++) {
        this.particles.push(new Particle(this.canvas));
      }
    }

    animateParticles() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.particles.forEach(p => { p.update(); p.draw(this.ctx); });
      this.connectParticles();
      requestAnimationFrame(() => this.animateParticles());
    }

    connectParticles() {
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const dx = this.particles[i].x - this.particles[j].x;
          const dy = this.particles[i].y - this.particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 150) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = `rgba(201, 168, 124, ${0.08 * (1 - distance / 150)})`;
            this.ctx.lineWidth = 0.5;
            this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
            this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
            this.ctx.stroke();
          }
        }
      }
    }
  }

  class Particle {
    constructor(canvas) {
      this.canvas = canvas;
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > this.canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > this.canvas.height) this.speedY *= -1;
    }

    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 168, 124, ${this.opacity})`;
      ctx.fill();
    }
  }

  if (!customElements.get('hero-canvas')) {
    customElements.define('hero-canvas', HeroCanvas);
  }

  function attachHeroCanvas() {
    if (document.querySelector('hero-canvas')) return;
    const element = document.createElement('hero-canvas');
    document.body.appendChild(element);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachHeroCanvas);
  } else {
    attachHeroCanvas();
  }
})();
