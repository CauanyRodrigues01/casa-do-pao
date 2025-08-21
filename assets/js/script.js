/* ===========================================
    MENU HAMBÚRGUER
=========================================== */

const toggle = document.querySelector(".menu-toggle");
const navbar = document.querySelector(".navbar-principal");

toggle.addEventListener("click", () => {
  navbar.classList.toggle("menu-open");

  // Animar o ícone do hambúrguer
  if (navbar.classList.contains("menu-open")) {
    toggle.innerHTML = "✕";
    toggle.setAttribute("aria-expanded", "true");
  } else {
    toggle.innerHTML = "☰";
    toggle.setAttribute("aria-expanded", "false");
  }
});

// Fechar menu mobile ao clicar em um link
document.querySelectorAll(".navbar-principal a").forEach((link) => {
  link.addEventListener("click", () => {
    navbar.classList.remove("menu-open");
    toggle.innerHTML = "☰";
    toggle.setAttribute("aria-expanded", "false");
  });
});

// Fechar menu ao clicar fora dele
document.addEventListener("click", (e) => {
  if (!toggle.contains(e.target) && !navbar.contains(e.target)) {
    navbar.classList.remove("menu-open");
    toggle.innerHTML = "☰";
    toggle.setAttribute("aria-expanded", "false");
  }
});

// Fechar menu com tecla ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navbar.classList.contains("menu-open")) {
    navbar.classList.remove("menu-open");
    toggle.innerHTML = "☰";
    toggle.setAttribute("aria-expanded", "false");
    toggle.focus();
  }
});

// Smooth scroll para âncoras
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const headerHeight = document.querySelector(
        "#cabecalho-principal"
      ).offsetHeight;
      const targetPosition = target.offsetTop - headerHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});

/* ===========================================
    CAROUSEL DE PRODUTOS
=========================================== */

class ProductCarousel {
  constructor() {
    this.track = document.getElementById("carouselTrack");
    this.prevBtn = document.getElementById("prevBtn");
    this.nextBtn = document.getElementById("nextBtn");
    this.indicatorsContainer = document.getElementById(
      "carouselProductsIndicators"
    );

    this.cards = this.track.querySelectorAll(".product-card");
    this.cardWidth = 240 + 16; // largura do card + gap
    this.visibleCards = this.getVisibleCards();
    this.currentIndex = 0;
    this.maxIndex = Math.max(0, this.cards.length - this.visibleCards);

    this.isDragging = false;
    this.startPos = 0;
    this.currentTranslate = 0;
    this.prevTranslate = 0;

    this.init();
  }

  init() {
    this.createIndicators();
    this.updateButtons();
    this.bindEvents();

    // Resize listener
    window.addEventListener("resize", () => {
      this.visibleCards = this.getVisibleCards();
      this.maxIndex = Math.max(0, this.cards.length - this.visibleCards);
      this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
      this.updateCarousel();
    });
  }

  getVisibleCards() {
    const trackWidth = this.track.offsetWidth;
    return Math.floor(trackWidth / this.cardWidth) || 1;
  }

  createIndicators() {
    this.indicatorsContainer.innerHTML = "";
    const totalPages = this.maxIndex + 1;

    for (let i = 0; i < totalPages; i++) {
      const indicator = document.createElement("div");
      indicator.className = `carousel-indicator ${i === 0 ? "active" : ""}`;
      indicator.addEventListener("click", () => this.goToSlide(i));
      this.indicatorsContainer.appendChild(indicator);
    }
  }

  bindEvents() {
    this.prevBtn.addEventListener("click", () => this.prevSlide());
    this.nextBtn.addEventListener("click", () => this.nextSlide());

    // Touch/mouse drag support
    this.track.addEventListener("mousedown", (e) => {
      this.isDragging = true;
      this.startPos = e.clientX;
      this.track.style.cursor = "grabbing";
    });

    this.track.addEventListener("touchstart", (e) => {
      this.isDragging = true;
      this.startPos = e.touches[0].clientX;
    });

    document.addEventListener("mousemove", (e) => {
      if (!this.isDragging) return;
      e.preventDefault();
      this.currentTranslate = this.prevTranslate + e.clientX - this.startPos;
    });

    document.addEventListener("touchmove", (e) => {
      if (!this.isDragging) return;
      this.currentTranslate =
        this.prevTranslate + e.touches[0].clientX - this.startPos;
    });

    document.addEventListener("mouseup", () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.track.style.cursor = "grab";

      const moved = this.currentTranslate - this.prevTranslate;
      if (moved < -50 && this.currentIndex < this.maxIndex) {
        this.nextSlide();
      } else if (moved > 50 && this.currentIndex > 0) {
        this.prevSlide();
      } else {
        this.updateCarousel();
      }
    });

    document.addEventListener("touchend", () => {
      if (!this.isDragging) return;
      this.isDragging = false;

      const moved = this.currentTranslate - this.prevTranslate;
      if (moved < -50 && this.currentIndex < this.maxIndex) {
        this.nextSlide();
      } else if (moved > 50 && this.currentIndex > 0) {
        this.prevSlide();
      } else {
        this.updateCarousel();
      }
    });

    document.querySelectorAll(".btn-add-cart, .btn-tertiary").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();

        // Animação de feedback
        btn.style.transform = "scale(0.95)";
        btn.innerHTML = "✓ Adicionado!";
        btn.style.background = "#28a745";

        setTimeout(() => {
          btn.style.transform = "";
          btn.innerHTML = 'Adicionar <i class="bi bi-cart-plus-fill"></i>';
          btn.style.background = "";
        }, 1500);

        console.log("Produto adicionado ao carrinho!");
      });
    });
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCarousel();
    }
  }

  nextSlide() {
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex++;
      this.updateCarousel();
    }
  }

  goToSlide(index) {
    this.currentIndex = Math.max(0, Math.min(index, this.maxIndex));
    this.updateCarousel();
  }

  updateCarousel() {
    const translateX = -this.currentIndex * this.cardWidth;
    this.track.scrollLeft = Math.abs(translateX);

    this.updateButtons();
    this.updateIndicators();

    // Update for dragging
    this.prevTranslate = this.currentTranslate = translateX;
  }

  updateButtons() {
    this.prevBtn.disabled = this.currentIndex === 0;
    this.nextBtn.disabled = this.currentIndex === this.maxIndex;
  }

  updateIndicators() {
    const indicators = this.indicatorsContainer.querySelectorAll(
      ".carousel-indicator"
    );
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === this.currentIndex);
    });
  }
}

// Initialize carousel when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  const carousel = new ProductCarousel();

  // Uncomment below for auto-play functionality
  /*
            setInterval(() => {
                if (carousel.currentIndex === carousel.maxIndex) {
                    carousel.goToSlide(0);
                } else {
                    carousel.nextSlide();
                }
            }, 5000); // Auto-advance every 5 seconds
            */
});

// Additional utility functions
function formatPrice(price) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

function addToCart(productName, price) {
  // Simulação de adicionar ao carrinho
  const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
  const existingItem = cartItems.find((item) => item.name === productName);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({
      name: productName,
      price: price,
      quantity: 1,
      id: Date.now(),
    });
  }

  localStorage.setItem("cart", JSON.stringify(cartItems));

  // Mostrar notificação
  showNotification(`${productName} adicionado ao carrinho!`);
}

function showNotification(message) {
  // Criar elemento de notificação
  const notification = document.createElement("div");
  notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #28a745, #20c997);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 9999;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                font-weight: 600;
                max-width: 300px;
            `;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Animar entrada
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Remover após 3 segundos
  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Intersection Observer para animações ao scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = "running";
    }
  });
}, observerOptions);

// Observar cards dos produtos
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".product-card").forEach((card) => {
    card.style.animationPlayState = "paused";
    observer.observe(card);
  });
});

/* ===========================================
    CAROUSEL DE DEPOIMENTOS
=========================================== */

let slideAtual = 0;
let autoplayInterval;
const slides = document.querySelectorAll(".depoimento");
const totalSlides = slides.length;
const carrossel = document.getElementById("carrossel");
const indicadoresContainer = document.getElementById("indicadores");
let indicadores = [];

// Gerar indicadores dinamicamente
function criarIndicadores() {
  indicadoresContainer.innerHTML = ""; // Limpa indicadores existentes
  indicadores = [];

  for (let i = 0; i < totalSlides; i++) {
    const indicador = document.createElement("div");
    indicador.classList.add("indicador");
    if (i === 0) indicador.classList.add("ativo");

    // Adiciona evento de clique
    indicador.addEventListener("click", () => irParaSlide(i));

    indicadoresContainer.appendChild(indicador);
    indicadores.push(indicador);
  }
}

// Calcula a largura de um slide incluindo o gap
function getSlideWidth() {
  if (slides.length === 0) return 0;

  const slide = slides[0];
  const computedStyle = getComputedStyle(slide);
  const slideWidth = slide.offsetWidth;
  const gap = parseFloat(getComputedStyle(carrossel).gap) || 24; // Pega o gap do próprio carrossel
  return slideWidth + gap;
}

function atualizarCarrossel() {
  if (!carrossel || indicadores.length === 0) return;

  const slideWidth = getSlideWidth();
  const translateX = slideAtual * slideWidth;
  carrossel.style.transform = `translateX(-${translateX}px)`;

  // Atualizar indicadores
  indicadores.forEach((indicador, index) => {
    indicador.classList.toggle("ativo", index === slideAtual);
  });
}

function moverCarrossel(direcao) {
  slideAtual += direcao;

  if (slideAtual >= totalSlides) {
    slideAtual = 0;
  } else if (slideAtual < 0) {
    slideAtual = totalSlides - 1;
  }

  atualizarCarrossel();
  reiniciarAutoplay();
}

function irParaSlide(index) {
  slideAtual = index;
  atualizarCarrossel();
  reiniciarAutoplay();
}

function iniciarAutoplay() {
  // Limpa qualquer interval existente antes de criar um novo
  pararAutoplay();

  autoplayInterval = setInterval(() => {
    moverCarrossel(1);
  }, 3000);
}

function pararAutoplay() {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
    autoplayInterval = null;
  }
}

function reiniciarAutoplay() {
  pararAutoplay();
  iniciarAutoplay();
}

// Aguarda o DOM estar pronto
document.addEventListener("DOMContentLoaded", () => {
  // Verifica se os elementos existem
  if (!carrossel || slides.length === 0 || !indicadoresContainer) {
    console.error("Elementos do carrossel não encontrados");
    return;
  }

  const carrosselContainer = document.querySelector(".carrossel-container");

  if (!carrosselContainer) {
    console.error("Container do carrossel não encontrado");
    return;
  }

  // Inicializar carrossel
  criarIndicadores();
  atualizarCarrossel();
  iniciarAutoplay();

  // Event listeners para pausar/retomar autoplay
  carrosselContainer.addEventListener("mouseenter", pararAutoplay);
  carrosselContainer.addEventListener("mouseleave", iniciarAutoplay);

  // Suporte a scroll com rodinha do mouse
  carrosselContainer.addEventListener("wheel", (e) => {
    e.preventDefault(); // Impede o scroll vertical da página

    // Detecta direção do scroll
    if (e.deltaY > 0) {
      // Scroll para baixo = próximo slide
      moverCarrossel(1);
    } else {
      // Scroll para cima = slide anterior
      moverCarrossel(-1);
    }
  });

  // Suporte a touch/swipe para dispositivos móveis
  let touchStartX = 0;
  let touchEndX = 0;

  carrosselContainer.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
    pararAutoplay();
  });

  carrosselContainer.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    iniciarAutoplay();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        moverCarrossel(1); // Swipe para esquerda - próximo
      } else {
        moverCarrossel(-1); // Swipe para direita - anterior
      }
    }
  }

  // Atualizar carrossel no redimensionamento da janela
  window.addEventListener("resize", () => {
    atualizarCarrossel();
  });
});

// Parar autoplay quando a aba não está visível (otimização)
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    pararAutoplay();
  } else {
    iniciarAutoplay();
  }
});
