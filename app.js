// ============================================
// CONFIGURATION & INITIALIZATION
// ============================================

const CONFIG = {
  loadingDuration: 2000,
  discordGuildId: '1103080337644457996',
  twitchChannel: 'drazonia',
  refreshInterval: 300000, // 5 minutes
};

// ============================================
// LOADING SCREEN
// ============================================

class LoadingScreen {
  constructor() {
    this.screen = document.getElementById('loading-screen');
    this.progress = document.getElementById('loadingProgress');
  }

  async start() {
    let width = 0;
    const interval = setInterval(() => {
      if (width >= 100) {
        clearInterval(interval);
        this.complete();
      } else {
        width += Math.random() * 15;
        width = Math.min(width, 100);
        this.progress.style.width = width + '%';
      }
    }, 100);
  }

  complete() {
    setTimeout(() => {
      this.screen.classList.add('hidden');
      document.body.style.overflow = 'auto';
      initAnimations();
    }, 500);
  }
}

// ============================================
// NAVIGATION
// ============================================

class Navigation {
  constructor() {
    this.navbar = document.getElementById('navbar');
    this.burger = document.getElementById('burgerBtn');
    this.navLinks = document.getElementById('navLinks');
    this.links = document.querySelectorAll('.nav-link');
    this.lastScroll = 0;
    
    this.init();
  }

  init() {
    this.burger.addEventListener('click', () => this.toggleMenu());
    this.links.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    this.setupActiveLink();
  }

  toggleMenu() {
    this.burger.classList.toggle('active');
    this.navLinks.classList.toggle('active');
    document.body.style.overflow = this.navLinks.classList.contains('active') ? 'hidden' : '';
  }

  closeMenu() {
    this.burger.classList.remove('active');
    this.navLinks.classList.remove('active');
    document.body.style.overflow = '';
  }

  handleScroll() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }
    
    this.lastScroll = currentScroll;
  }

  setupActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '-100px 0px -50% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === entry.target.id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }
}

// ============================================
// SMOOTH SCROLL
// ============================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ============================================
// SCROLL TO TOP BUTTON
// ============================================

class ScrollToTop {
  constructor() {
    this.button = document.getElementById('scrollToTopBtn');
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.toggle(), { passive: true });
    this.button.addEventListener('click', () => this.scrollTop());
  }

  toggle() {
    if (window.pageYOffset > 300) {
      this.button.classList.add('show');
    } else {
      this.button.classList.remove('show');
    }
  }

  scrollTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

// ============================================
// COUNTER ANIMATION
// ============================================

function animateCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
          current += increment;
          if (current < target) {
            counter.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target.toLocaleString();
          }
        };

        updateCounter();
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

// ============================================
// DISCORD MEMBER COUNT
// ============================================

class DiscordWidget {
  constructor() {
    this.memberCountEl = document.getElementById('member-count');
    this.onlineCountEl = document.getElementById('onlineCount');
    this.totalMembersEl = document.getElementById('totalMembers');
    this.init();
  }

  async init() {
    await this.fetchData();
    setInterval(() => this.fetchData(), CONFIG.refreshInterval);
  }

  async fetchData() {
    try {
      const response = await fetch(`https://discord.com/api/guilds/${"1103080337644457996"}/widget.json`);
      const data = await response.json();
      
      const onlineCount = data.presence_count || 0;
      const totalMembers = data.members?.length || data.approximate_member_count || 100;
      
      this.updateDisplay(onlineCount, totalMembers);
      this.animateProgress(onlineCount, totalMembers);
    } catch (error) {
      console.warn('Erreur Discord API:', error);
      this.memberCountEl.innerHTML = '<strong>100+</strong>';
      if (this.onlineCountEl) this.onlineCountEl.textContent = '...';
      if (this.totalMembersEl) this.totalMembersEl.textContent = '100+';
    }
  }

  updateDisplay(online, total) {
    if (this.memberCountEl) {
      this.memberCountEl.innerHTML = `<strong>${total}</strong>`;
    }
    if (this.onlineCountEl) {
      this.onlineCountEl.textContent = online;
    }
    if (this.totalMembersEl) {
      this.totalMembersEl.textContent = total;
    }
  }

  animateProgress(online, total) {
    const circle = document.querySelector('.progress-ring-circle');
    if (!circle) return;
    
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    const percent = (online / total) * 100;
    const offset = circumference - (percent / 100) * circumference;
    
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;
    
    setTimeout(() => {
      circle.style.strokeDashoffset = offset;
    }, 100);
  }
}

// ============================================
// TWITCH LIVE STATUS
// ============================================

class TwitchStatus {
  constructor() {
    this.badge = document.getElementById('liveBadge');
    this.checkStatus();
    setInterval(() => this.checkStatus(), 60000); // Check every minute
  }

  async checkStatus() {
    try {
      // Note: You would need a Twitch API key for this to work properly
      // This is a placeholder that checks if the stream page returns certain content
      const response = await fetch(`https://www.twitch.tv/${CONFIG.twitchChannel}`);
      const isLive = response.ok; // Simplified check
      
      if (this.badge) {
        this.badge.style.display = isLive ? 'flex' : 'none';
      }
    } catch (error) {
      console.warn('Erreur vérification Twitch:', error);
    }
  }
}

// ============================================
// PARTICLES BACKGROUND
// ============================================

function initParticles() {
  if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: '#ad7add'
        },
        shape: {
          type: 'circle'
        },
        opacity: {
          value: 0.5,
          random: true,
          anim: {
            enable: true,
            speed: 1,
            opacity_min: 0.1,
            sync: false
          }
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: true,
            speed: 2,
            size_min: 0.1,
            sync: false
          }
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: '#ad7add',
          opacity: 0.2,
          width: 1
        },
        move: {
          enable: true,
          speed: 1,
          direction: 'none',
          random: true,
          straight: false,
          out_mode: 'out',
          bounce: false
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: {
            enable: true,
            mode: 'grab'
          },
          onclick: {
            enable: true,
            mode: 'push'
          },
          resize: true
        },
        modes: {
          grab: {
            distance: 140,
            line_linked: {
              opacity: 0.5
            }
          },
          push: {
            particles_nb: 4
          }
        }
      },
      retina_detect: true
    });
  }
}

// ============================================
// AOS (ANIMATE ON SCROLL) INITIALIZATION
// ============================================

function initAnimations() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
      delay: 100
    });
  }
}

// ============================================
// SECTION VISIBILITY OBSERVER
// ============================================

function initSectionObserver() {
  const sections = document.querySelectorAll('section');
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    section.classList.add('fade-in-section');
    observer.observe(section);
  });
}

// ============================================
// TYPING EFFECT
// ============================================

function initTypingEffect() {
  const element = document.querySelector('.typing-effect');
  if (!element) return;
  
  const text = element.textContent;
  element.textContent = '';
  element.style.display = 'inline-block';
  
  let i = 0;
  const speed = 50;
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        type();
        observer.unobserve(element);
      }
    });
  }, { threshold: 0.5 });
  
  observer.observe(element);
}

// ============================================
// PERFORMANCE OPTIMIZATIONS
// ============================================

// Lazy load images
function initLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }
}

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ============================================
// EASTER EGGS & FUN FEATURES
// ============================================

function initEasterEggs() {
  // Konami Code Easter Egg
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;
  
  document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        activateRainbowMode();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });
}

function activateRainbowMode() {
  document.body.classList.add('rainbow-mode');
  const message = document.createElement('div');
  message.className = 'easter-egg-message';
  message.innerHTML = '🎉 Rainbow Mode Activé! 🌈';
  document.body.appendChild(message);
  
  setTimeout(() => {
    message.remove();
    document.body.classList.remove('rainbow-mode');
  }, 5000);
}

// ============================================
// MAIN INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('%c🎮 Bienvenue sur le portfolio de Drazonia!', 'font-size: 20px; color: #ad7add; font-weight: bold;');
  console.log('%c✨ Site optimisé par Make_Chen', 'font-size: 12px; color: #c299ff;');
  
  // Initialize all components
  const loader = new LoadingScreen();
  loader.start();
  
  const nav = new Navigation();
  const scrollTop = new ScrollToTop();
  const discord = new DiscordWidget();
  const twitch = new TwitchStatus();
  
  initSmoothScroll();
  initParticles();
  initSectionObserver();
  initLazyLoading();
  animateCounters();
  initTypingEffect();
  initEasterEggs();
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause expensive operations when page is not visible
    console.log('Page hidden - pausing updates');
  } else {
    // Resume when page becomes visible
    console.log('Page visible - resuming updates');
  }
});

// Error handling
window.addEventListener('error', (e) => {
  console.error('Erreur globale:', e.error);
});

// Service Worker for PWA (optional future enhancement)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // navigator.register SW('/sw.js');
  });
}