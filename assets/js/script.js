/* ===========================================
  DROPDOWN DE NAVEGAÇÃO
=========================================== */
const dropdowns = document.querySelectorAll(".dropdown");

dropdowns.forEach((dropdown) => {
  const toggle = dropdown.querySelector(".dropdown-toggle");
  const menu = dropdown.querySelector(".dropdown-menu");

  toggle.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    // Fecha outros dropdowns
    dropdowns.forEach((otherDropdown) => {
      if (otherDropdown !== dropdown) {
        otherDropdown.classList.remove("active");
        otherDropdown
          .querySelector(".dropdown-toggle")
          .setAttribute("aria-expanded", "false");
      }
    });

    // Toggle do dropdown atual
    const isActive = dropdown.classList.contains("active");
    dropdown.classList.toggle("active");
    toggle.setAttribute("aria-expanded", !isActive);
  });
});

// Fecha dropdown ao clicar fora
document.addEventListener("click", function (e) {
  if (!e.target.closest(".dropdown")) {
    dropdowns.forEach((dropdown) => {
      dropdown.classList.remove("active");
      dropdown
        .querySelector(".dropdown-toggle")
        .setAttribute("aria-expanded", "false");
    });
  }
});

/* ===========================================
  FUNÇÃO AUXILIAR PARA FECHAR O MENU MOBILE
=========================================== */

const menuToggle = document.querySelector(".menu-toggle");
const navbar = document.querySelector(".navbar-principal");

/**
 * Fecha o menu de navegação mobile e reseta o ícone do botão.
 */
function closeMobileMenu() {
  navbar.classList.remove("menu-open");
  menuToggle.innerHTML = '<i class="bi bi-list"></i>';
  menuToggle.setAttribute("aria-expanded", "false");
}

/* ===========================================
  MENU HAMBÚRGUER
=========================================== */

menuToggle.addEventListener("click", (e) => {
  // Evitar que o clique borbulhe para o document
  e.stopPropagation();

  // Adiciona ou remove a classe "menu-open" para controlar a visibilidade do menu
  navbar.classList.toggle("menu-open");

  // Atualiza o ícone e o atributo 'aria-expanded' com base no novo estado
  const isOpen = navbar.classList.contains("menu-open");
  menuToggle.innerHTML = isOpen
    ? '<i class="bi bi-x"></i>'
    : '<i class="bi bi-list"></i>';
  menuToggle.setAttribute("aria-expanded", isOpen);
});

// Fechar menu mobile ao clicar em um link
document.querySelectorAll(".navbar-principal a").forEach((link) => {
  link.addEventListener("click", () => {
    closeMobileMenu();
  });
});

// Fechar menu ao clicar fora dele
document.addEventListener("click", (e) => {
  if (!menuToggle.contains(e.target) && !navbar.contains(e.target)) {
    closeMobileMenu();
  }
});

// Fechar menu com tecla ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navbar.classList.contains("menu-open")) {
    closeMobileMenu();
    menuToggle.focus();
  }
});

/* ===========================================
  SMOOTH SCROLL PARA ÂNCORAS
=========================================== */

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
      }); // Fecha o menu mobile e os dropdowns após o clique

      closeMobileMenu();
      dropdowns.forEach((dropdown) => {
        dropdown.classList.remove("active");
        dropdown
          .querySelector(".dropdown-toggle")
          .setAttribute("aria-expanded", "false");
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

// Configurações do carrossel
const carouselConfig = {
  autoplayDelay: 5000, // 5 segundos para melhor leitura
  transitionDuration: 400,
  swipeThreshold: 75,
  preloadDistance: 1, // Quantas imagens carregar antecipadamente
};

// Variáveis globais
let slideAtual = 0;
let autoplayInterval;
let isTransitioning = false;
const slides = document.querySelectorAll(".depoimento");
const totalSlides = slides.length;
const carrossel = document.getElementById("carrossel");
const indicadoresContainer = document.getElementById("indicadores");
let indicadores = [];
let prevButton, nextButton;

// Criar botões de navegação
function criarBotoesNavegacao() {
  const carrosselContainer = document.querySelector(".carrossel-container");
  if (!carrosselContainer || totalSlides <= 1) return;

  // Botão anterior
  prevButton = document.createElement("button");
  prevButton.className = "carousel-nav prev";
  prevButton.type = "button";
  prevButton.setAttribute("aria-label", "Ir para depoimento anterior");
  prevButton.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="15,18 9,12 15,6"></polyline>
    </svg>
  `;
  prevButton.addEventListener("click", () => moverCarrossel(-1));

  // Botão próximo
  nextButton = document.createElement("button");
  nextButton.className = "carousel-nav next";
  nextButton.type = "button";
  nextButton.setAttribute("aria-label", "Ir para próximo depoimento");
  nextButton.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="9,18 15,12 9,6"></polyline>
    </svg>
  `;
  nextButton.addEventListener("click", () => moverCarrossel(1));

  // Adicionar ao container
  carrosselContainer.appendChild(prevButton);
  carrosselContainer.appendChild(nextButton);

  // Event listeners para pausar autoplay
  [prevButton, nextButton].forEach((button) => {
    button.addEventListener("mouseenter", pararAutoplay);
    button.addEventListener("mouseleave", iniciarAutoplay);
    button.addEventListener("focus", pararAutoplay);
    button.addEventListener("blur", iniciarAutoplay);
  });
}

// Atualizar estados dos botões
function atualizarBotoesNavegacao() {
  if (!prevButton || !nextButton) return;

  // Em carrossel circular, todos os botões ficam sempre habilitados
  // Mas podemos adicionar feedback visual
  prevButton.classList.toggle("disabled", false);
  nextButton.classList.toggle("disabled", false);

  // Opcional: desabilitar em carrossel linear
  // prevButton.disabled = slideAtual === 0;
  // nextButton.disabled = slideAtual === totalSlides - 1;
}
function criarIndicadores() {
  if (!indicadoresContainer || totalSlides === 0) return;

  indicadoresContainer.innerHTML = "";
  indicadoresContainer.setAttribute("role", "tablist");
  indicadoresContainer.setAttribute("aria-label", "Navegação dos depoimentos");

  indicadores = [];

  for (let i = 0; i < totalSlides; i++) {
    const indicador = document.createElement("button");
    indicador.classList.add("indicador");
    indicador.setAttribute("role", "tab");
    indicador.setAttribute("type", "button");
    indicador.setAttribute(
      "aria-label",
      `Ver depoimento ${i + 1} de ${totalSlides}`
    );
    indicador.setAttribute("aria-selected", i === 0 ? "true" : "false");
    indicador.setAttribute("tabindex", i === 0 ? "0" : "-1");

    if (i === 0) indicador.classList.add("ativo");

    // Eventos do indicador
    indicador.addEventListener("click", () => irParaSlide(i));
    indicador.addEventListener("keydown", handleIndicatorKeydown);

    indicadoresContainer.appendChild(indicador);
    indicadores.push(indicador);
  }
}

// Navegação por teclado nos indicadores
function handleIndicatorKeydown(e) {
  const currentIndex = indicadores.indexOf(e.target);
  let newIndex = currentIndex;

  switch (e.key) {
    case "ArrowLeft":
    case "ArrowUp":
      e.preventDefault();
      newIndex = currentIndex > 0 ? currentIndex - 1 : totalSlides - 1;
      break;
    case "ArrowRight":
    case "ArrowDown":
      e.preventDefault();
      newIndex = currentIndex < totalSlides - 1 ? currentIndex + 1 : 0;
      break;
    case "Home":
      e.preventDefault();
      newIndex = 0;
      break;
    case "End":
      e.preventDefault();
      newIndex = totalSlides - 1;
      break;
    case "Enter":
    case " ":
      e.preventDefault();
      irParaSlide(currentIndex);
      return;
  }

  if (newIndex !== currentIndex) {
    indicadores[newIndex].focus();
    irParaSlide(newIndex);
  }
}

// Calcula largura do slide com gap
function getSlideWidth() {
  if (slides.length === 0) return 0;

  const slide = slides[0];
  const slideWidth = slide.offsetWidth;
  const gap = parseFloat(getComputedStyle(carrossel).gap) || 24;
  return slideWidth + gap;
}

// Atualiza posição e estados visuais
function atualizarCarrossel() {
  if (!carrossel || indicadores.length === 0 || isTransitioning) return;

  isTransitioning = true;

  const slideWidth = getSlideWidth();
  const translateX = slideAtual * slideWidth;

  // Aplica transformação suave
  carrossel.style.transition = `transform ${carouselConfig.transitionDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
  carrossel.style.transform = `translateX(-${translateX}px)`;

  // Atualizar indicadores
  indicadores.forEach((indicador, index) => {
    const isActive = index === slideAtual;
    indicador.classList.toggle("ativo", isActive);
    indicador.setAttribute("aria-selected", isActive);
    indicador.setAttribute("tabindex", isActive ? "0" : "-1");
  });

  // Marcar slides ativos/inativos
  slides.forEach((slide, index) => {
    slide.classList.toggle("ativo", index === slideAtual);
    slide.setAttribute("aria-hidden", index !== slideAtual);
  });

  // Atualizar aria-live para leitores de tela
  carrossel.setAttribute(
    "aria-label",
    `Depoimento ${slideAtual + 1} de ${totalSlides}`
  );

  // Atualizar botões de navegação
  atualizarBotoesNavegacao();

  // Preload de imagens próximas
  preloadAdjacentImages();

  // Reset da flag de transição
  setTimeout(() => {
    isTransitioning = false;
  }, carouselConfig.transitionDuration);
}

// Preload inteligente de imagens (apenas se necessário)
function preloadAdjacentImages() {
  const imagesToPreload = [];

  for (let i = 1; i <= carouselConfig.preloadDistance; i++) {
    // Próximas imagens
    const nextIndex = (slideAtual + i) % totalSlides;
    // Imagens anteriores
    const prevIndex =
      slideAtual - i < 0 ? totalSlides + (slideAtual - i) : slideAtual - i;

    imagesToPreload.push(nextIndex, prevIndex);
  }

  imagesToPreload.forEach((index) => {
    const slide = slides[index];
    if (!slide) return;

    const img = slide.querySelector(".user-info img[data-src]");
    if (img && !img.complete) {
      const preloadImg = new Image();
      preloadImg.onload = () => {
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        img.classList.remove("loading");
      };
      preloadImg.onerror = () => {
        img.classList.add("error");
      };
      preloadImg.src = img.dataset.src;
    }
  });
}

// Move carrossel com validações
function moverCarrossel(direcao) {
  if (isTransitioning || totalSlides <= 1) return;

  slideAtual += direcao;

  if (slideAtual >= totalSlides) {
    slideAtual = 0;
  } else if (slideAtual < 0) {
    slideAtual = totalSlides - 1;
  }

  atualizarCarrossel();
  reiniciarAutoplay();

  // Anunciar mudança para leitores de tela
  anunciarMudancaSlide();
}

// Ir para slide específico
function irParaSlide(index) {
  if (
    isTransitioning ||
    index === slideAtual ||
    index < 0 ||
    index >= totalSlides
  )
    return;

  slideAtual = index;
  atualizarCarrossel();
  reiniciarAutoplay();
  anunciarMudancaSlide();
}

// Anuncia mudanças para leitores de tela
function anunciarMudancaSlide() {
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", "polite");
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = `Mostrando depoimento ${
    slideAtual + 1
  } de ${totalSlides}`;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Gerenciamento do autoplay
function iniciarAutoplay() {
  if (totalSlides <= 1) return;

  pararAutoplay();
  autoplayInterval = setInterval(() => {
    moverCarrossel(1);
  }, carouselConfig.autoplayDelay);
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

function toggleAutoplay() {
  if (autoplayInterval) {
    pararAutoplay();
  } else {
    iniciarAutoplay();
  }
}

// Configurar acessibilidade do container
function configurarAcessibilidade() {
  if (!carrossel) return;

  carrossel.setAttribute("role", "region");
  carrossel.setAttribute("aria-label", "Carrossel de depoimentos de clientes");
  carrossel.setAttribute("aria-live", "polite");
  carrossel.setAttribute("tabindex", "0");

  // Adicionar texto para leitores de tela
  const instructions = document.createElement("div");
  instructions.className = "sr-only";
  instructions.textContent =
    "Use as setas do teclado para navegar entre os depoimentos, ou pressione espaço para pausar/retomar a reprodução automática";
  carrossel.parentNode.insertBefore(instructions, carrossel);
}

// Navegação global por teclado
function adicionarNavegacaoTeclado() {
  document.addEventListener("keydown", (e) => {
    const carrosselContainer = document.querySelector(".carrossel-container");
    if (
      !carrosselContainer ||
      !carrosselContainer.contains(document.activeElement)
    )
      return;

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        moverCarrossel(-1);
        break;
      case "ArrowRight":
        e.preventDefault();
        moverCarrossel(1);
        break;
      case " ": // Spacebar para pausar/retomar
        e.preventDefault();
        toggleAutoplay();
        break;
      case "Home":
        e.preventDefault();
        irParaSlide(0);
        break;
      case "End":
        e.preventDefault();
        irParaSlide(totalSlides - 1);
        break;
      case "Escape":
        e.preventDefault();
        carrossel.blur();
        break;
    }
  });
}

// Gerenciamento de touch/swipe
function configurarTouch(carrosselContainer) {
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;
  let isDragging = false;

  carrosselContainer.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
      isDragging = true;
      pararAutoplay();
    },
    { passive: true }
  );

  carrosselContainer.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging) return;

      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;

      // Previne scroll vertical se for swipe horizontal
      const deltaX = Math.abs(touchEndX - touchStartX);
      const deltaY = Math.abs(touchEndY - touchStartY);

      if (deltaX > deltaY && deltaX > 10) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  carrosselContainer.addEventListener(
    "touchend",
    (e) => {
      if (!isDragging) return;

      isDragging = false;
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      iniciarAutoplay();
    },
    { passive: true }
  );

  function handleSwipe() {
    const deltaX = touchStartX - touchEndX;
    const deltaY = Math.abs(touchStartY - touchEndY);

    // Só processa swipe se for mais horizontal que vertical
    if (
      Math.abs(deltaX) < carouselConfig.swipeThreshold ||
      deltaY > Math.abs(deltaX)
    )
      return;

    if (deltaX > 0) {
      moverCarrossel(1); // Swipe esquerda - próximo
    } else {
      moverCarrossel(-1); // Swipe direita - anterior
    }
  }
}

// Observer para lazy loading (apenas se usar data-src)
function configurarLazyLoading() {
  // Verificar se existem imagens com data-src
  const lazyImages = document.querySelectorAll("img[data-src]");
  if (lazyImages.length === 0) {
    return; // Não há lazy loading para fazer
  }

  if (!("IntersectionObserver" in window)) {
    // Fallback para navegadores antigos
    slides.forEach(loadSlideImages);
    return;
  }

  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadSlideImages(entry.target);
          imageObserver.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "50px",
    }
  );

  slides.forEach((slide) => imageObserver.observe(slide));
}

function loadSlideImages(slide) {
  const images = slide.querySelectorAll("img[data-src]");
  images.forEach((img) => {
    img.classList.add("loading");

    const tempImg = new Image();
    tempImg.onload = () => {
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
      img.classList.remove("loading");
    };
    tempImg.onerror = () => {
      img.classList.add("error");
      img.classList.remove("loading");
    };
    tempImg.src = img.dataset.src;
  });
}

// Inicialização principal
document.addEventListener("DOMContentLoaded", () => {
  // Verificações de segurança
  if (!carrossel || slides.length === 0 || !indicadoresContainer) {
    console.error("Elementos do carrossel não encontrados");
    return;
  }

  const carrosselContainer = document.querySelector(".carrossel-container");
  if (!carrosselContainer) {
    console.error("Container do carrossel não encontrado");
    return;
  }

  // Configurações iniciais
  configurarAcessibilidade();
  criarBotoesNavegacao();
  criarIndicadores();
  configurarLazyLoading();
  adicionarNavegacaoTeclado();
  configurarTouch(carrosselContainer);

  // Estado inicial
  atualizarCarrossel();
  iniciarAutoplay();

  // Event listeners do container
  carrosselContainer.addEventListener("mouseenter", pararAutoplay);
  carrosselContainer.addEventListener("mouseleave", iniciarAutoplay);

  // Suporte a scroll com roda do mouse
  carrosselContainer.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();

      if (e.deltaY > 0) {
        moverCarrossel(1);
      } else {
        moverCarrossel(-1);
      }
    },
    { passive: false }
  );

  // Redimensionamento da janela
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      atualizarCarrossel();
    }, 250);
  });

  // Focus management
  carrossel.addEventListener("focus", pararAutoplay);
  carrossel.addEventListener("blur", iniciarAutoplay);
});

// Gerenciamento de visibilidade da página
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    pararAutoplay();
  } else if (slides.length > 1) {
    iniciarAutoplay();
  }
});

// Tratamento de erros globais
window.addEventListener("error", (e) => {
  if (e.target.tagName === "IMG" && e.target.closest(".depoimento")) {
    e.target.classList.add("error");
    console.warn("Erro ao carregar imagem do depoimento:", e.target.src);
  }
});

// Utility: classe para screen readers
if (!document.querySelector(".sr-only-styles")) {
  const style = document.createElement("style");
  style.className = "sr-only-styles";
  style.textContent = `
    .sr-only {
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    }
  `;
  document.head.appendChild(style);
}

/* ===========================================
    FORMULÁRIOS
=========================================== */

class SmartForm {
  constructor(formId, config) {
    this.form = document.getElementById(formId);
    this.config = config || {};
    this.validators = {};

    if (!this.form) {
      throw new Error(`Formulário com ID "${formId}" não encontrado.`);
    }
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupPasswordStrength();
    this.setupPasswordConfirmation();
  }

  addValidator(fieldName, validatorFunction, errorMessage) {
    this.validators[fieldName] = {
      validate: validatorFunction,
      message: errorMessage,
    };
  }

  setupEventListeners() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    this.form.querySelectorAll("input, select, textarea").forEach((field) => {
      field.addEventListener("blur", () => this.validateField(field));
      field.addEventListener("input", () => {
        if (field.checkValidity()) {
          this.hideError(field);
        }
      });
    });

    const clearBtn = this.form.querySelector("#clearBtn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => this.handleClear());
    }
  }

  validateForm() {
    let isValid = true;
    this.form.querySelectorAll("input, select, textarea").forEach((field) => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    return isValid;
  }

  validateField(field) {
    const isValid = field.checkValidity();
    const customValidator = this.validators[field.name];

    if (isValid && customValidator) {
      const customValid = customValidator.validate(field.value, field);
      if (!customValid) {
        this.showError(field, customValidator.message);
        return false;
      }
    }

    if (isValid) {
      this.hideError(field);
      return true;
    } else {
      let message = this.getValidationMessage(field);
      this.showError(field, message);
      return false;
    }
  }

  getValidationMessage(field) {
    if (field.validity.valueMissing) {
      return "Este campo é obrigatório";
    } else if (field.validity.typeMismatch) {
      return "Por favor, insira um formato válido";
    } else if (field.validity.tooShort) {
      return `Mínimo de ${field.minLength} caracteres`;
    } else if (field.validity.tooLong) {
      return `Máximo de ${field.maxLength} caracteres`;
    } else if (field.validity.rangeUnderflow) {
      return `Valor mínimo: ${field.min}`;
    } else if (field.validity.rangeOverflow) {
      return `Valor máximo: ${field.max}`;
    }
    return "Por favor, corrija este campo";
  }

  showError(field, message) {
    const errorElement = document.getElementById(field.id + "-error");
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = "block";
    }
  }

  hideError(field) {
    const errorElement = document.getElementById(field.id + "-error");
    if (errorElement) {
      errorElement.style.display = "none";
    }
  }

  setupPasswordStrength() {
    const passwordField = this.form.querySelector("#password");
    const strengthBar = this.form.querySelector("#password-strength-bar");
    const strengthText = this.form.querySelector("#password-strength-text");

    if (passwordField && strengthBar && strengthText) {
      passwordField.addEventListener("input", () => {
        const strength = this.calculatePasswordStrength(passwordField.value);
        this.updatePasswordStrength(strengthBar, strengthText, strength);
      });
    }
  }

  calculatePasswordStrength(password) {
    let strength = 0;
    let feedback = [];

    if (password.length >= 8) strength++;
    else feedback.push("pelo menos 8 caracteres");

    if (/[a-z]/.test(password)) strength++;
    else feedback.push("letras minúsculas");

    if (/[A-Z]/.test(password)) strength++;
    else feedback.push("letras maiúsculas");

    if (/[0-9]/.test(password)) strength++;
    else feedback.push("números");

    if (/[^A-Za-z0-9]/.test(password)) strength++;
    else feedback.push("caracteres especiais");

    return { strength, feedback };
  }

  updatePasswordStrength(strengthBar, strengthText, { strength, feedback }) {
    strengthBar.className = "strength-bar";

    if (strength <= 2) {
      strengthBar.classList.add("strength-weak");
      strengthText.textContent = `Senha fraca. Adicione: ${feedback
        .slice(0, 2)
        .join(", ")}`;
    } else if (strength <= 4) {
      strengthBar.classList.add("strength-medium");
      strengthText.textContent = `Senha média. Considere adicionar: ${feedback.join(
        ", "
      )}`;
    } else {
      strengthBar.classList.add("strength-strong");
      strengthText.textContent = "Senha forte! ✓";
    }
  }

  setupPasswordConfirmation() {
    const passwordField = this.form.querySelector("#password");
    const confirmField = this.form.querySelector("#confirmPassword");

    if (passwordField && confirmField) {
      confirmField.addEventListener("input", () => {
        if (confirmField.value && passwordField.value !== confirmField.value) {
          this.showError(confirmField, "As senhas não coincidem");
          confirmField.setCustomValidity("As senhas não coincidem");
        } else {
          this.hideError(confirmField);
          confirmField.setCustomValidity("");
        }
      });
    }
  }

  handleSubmit() {
    if (this.validateForm()) {
      const submitBtn = this.form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      submitBtn.disabled = true;
      submitBtn.textContent = "Criando conta...";

      setTimeout(() => {
        const successMessage = this.form.querySelector("#successMessage");
        if (successMessage) {
          successMessage.style.display = "block";
          setTimeout(() => (successMessage.style.display = "none"), 5000);
        }

        // Lógica de envio do formulário aqui (AJAX, fetch, etc.)
        const formData = new FormData(this.form);
        for (const [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
        }

        this.form.reset();
        this.resetPasswordStrength();

        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }, 1500);
    }
  }

  handleClear() {
    if (confirm("Tem certeza que deseja limpar todos os campos?")) {
      this.form.reset();
      this.form.querySelectorAll(".error-message").forEach((error) => {
        error.style.display = "none";
      });
      this.resetPasswordStrength();
    }
  }

  resetPasswordStrength() {
    const strengthBar = this.form.querySelector("#password-strength-bar");
    const strengthText = this.form.querySelector("#password-strength-text");
    if (strengthBar && strengthText) {
      strengthBar.className = "strength-bar";
      strengthText.textContent = "Digite uma senha forte";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = new SmartForm("registerForm");

  // Exemplo de uso de validador customizado
  registerForm.addValidator(
    "email",
    (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    "Por favor, insira um e-mail válido."
  );
});
