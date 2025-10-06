// carousel.js

export class Carousel {
  /**
   * @param {string} selector - Seletor CSS do container principal do carrossel.
   * @param {object} options - Opções de configuração do carrossel.
   * @param {boolean} [options.loop=false] - Se o carrossel deve ser infinito (loop).
   * @param {number} [options.gap=16] - O espaçamento (gap) em pixels entre os slides (deve corresponder ao CSS).
   */
  constructor(selector, options = {}) {
    this.container = document.querySelector(selector);
    if (!this.container) {
      console.error(
        `Container do Carrossel não encontrado para o seletor: ${selector}`
      );
      return;
    }

    // Configurações padrão e mesclagem com opções do usuário
    this.options = {
      loop: false, // Padrão: Sem loop
      gap: 16, // Padrão: 16px (ajuste para o valor do seu CSS)
      autoplay: false,
      autoplayInterval: 5000, // 5 segundos
      showNavigation: true,
      ...options,
    };

    this.track = this.container.querySelector(".carousel-track");
    this.slides = Array.from(this.track.querySelectorAll(".carousel-slide")); // Converte para Array para métodos úteis
    this.prevBtn = this.container.querySelector(".carousel-nav.prev");
    this.nextBtn = this.container.querySelector(".carousel-nav.next");
    this.indicatorsContainer = this.container.querySelector(
      ".carousel-indicators"
    );

    // Estado do Carrossel
    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    this.indicators = [];

    // Estado do Autoplay
    this.autoplayTimer = null;
    this.isAutoplaying = false;

    // Verifica se há slides suficientes
    if (this.totalSlides <= 1) {
      // Esconde botões e indicadores se houver apenas 1 slide
      if (this.prevBtn) this.prevBtn.style.display = "none";
      if (this.nextBtn) this.nextBtn.style.display = "none";
      if (this.indicatorsContainer)
        this.indicatorsContainer.style.display = "none";
      return;
    }

    // Atributo de transição e Observer
    this.isTransitioning = false;
    this.transitionDuration = 400; // Define o valor de timeout/duration (deve corresponder ao CSS)
    this.resizeObserver = new ResizeObserver(() => this.updateUI()); // Para recalcular no resize

    // Adiciona um listener para o fim da transição CSS para controle preciso
    this.track.addEventListener("transitionend", () =>
      this.handleTransitionEnd()
    );

    this.init();
  }

  // Método para iniciar o carrossel
  init() {
    if (!this.container || this.totalSlides <= 1) return;
    this.ensureCSSTransition();
    this.createIndicators();
    this.setupNavigation();
    this.setupResizeObserver(); // Inicializa o observer
    this.setupAutoplay();
    this.updateUI(); // Chama updateUI para garantir o estado inicial
  }

  // Método para limpeza (importante para SPAs ou componentes dinâmicos)
  destroy() {
    this.track.removeEventListener("transitionend", this.handleTransitionEnd);

    // Remove listeners de navegação (apenas se os botões estiverem visíveis/configurados)
    if (this.options.showNavigation) {
      if (this.prevBtn)
        this.prevBtn.removeEventListener("click", this.handlePrevClick);
      if (this.nextBtn)
        this.nextBtn.removeEventListener("click", this.handleNextClick);
    }

    this.indicators.forEach((indicator, i) => {
      indicator.removeEventListener("click", () => this.goToSlide(i));
    });

    // Limpa Autoplay
    this.stopAutoplay();
    if (this.options.autoplay) {
      this.container.removeEventListener("mouseover", this.handleMouseOver);
      this.container.removeEventListener("mouseout", this.handleMouseOut);
    }

    this.resizeObserver.disconnect();
  }

  // Configura o ResizeObserver para reajustar o carrossel no redimensionamento da tela
  setupResizeObserver() {
    // Observa o container principal para lidar com mudanças de layout
    this.resizeObserver.observe(this.container);
  }

  // Handlers para evitar a necessidade de criar novas funções a cada 'setupNavigation'
  handlePrevClick = () => {
    this.moveCarousel(-1);
  };

  handleNextClick = () => {
    this.moveCarousel(1);
  };

  // Handlers para pausar no hover
  handleMouseOver = () => {
    this.stopAutoplay();
  };

  handleMouseOut = () => {
    this.startAutoplay();
  };

  // Configura a navegação (melhoria com referência a métodos)
  setupNavigation() {
    if (!this.options.showNavigation) {
      // Garante que os botões fiquem escondidos
      if (this.prevBtn) this.prevBtn.style.display = "none";
      if (this.nextBtn) this.nextBtn.style.display = "none";
      return;
    }

    // Se a opção for true, garante que os botões sejam exibidos (se já não estiverem)
    if (this.prevBtn) {
      this.prevBtn.style.display = ""; // Volta ao estilo padrão
      this.prevBtn.addEventListener("click", this.handlePrevClick);
    }

    if (this.nextBtn) {
      this.nextBtn.style.display = ""; // Volta ao estilo padrão
      this.nextBtn.addEventListener("click", this.handleNextClick);
    }
  }

  // Configura o Autoplay e a Pausa/Retoma ao passar o mouse
  setupAutoplay() {
    if (this.options.autoplay) {
      this.startAutoplay(); // Configura pausa/retoma no hover
      this.container.addEventListener("mouseover", this.handleMouseOver);
      this.container.addEventListener("mouseout", this.handleMouseOut);
    }
  }

  // Lógica de avanço automático
  autoAdvance() {
    // Se não for loop e estiver no último slide, para o autoplay
    if (!this.options.loop && this.currentIndex === this.totalSlides - 1) {
      this.stopAutoplay();
    } else {
      // Se for o último slide em loop, volta ao primeiro (moveCarousel lida com isso)
      this.moveCarousel(1);
    }
  }

  // Inicia o autoplay
  startAutoplay() {
    if (
      !this.options.autoplay ||
      this.isAutoplayRunning ||
      this.totalSlides <= 1
    ) {
      return;
    }
    this.autoplayTimer = setInterval(
      () => this.autoAdvance(),
      this.options.autoplayInterval
    );
    this.isAutoplayRunning = true;
  }

  // Para o autoplay
  stopAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
    }
    this.autoplayTimer = null;
    this.isAutoplayRunning = false;
  }

  // Reinicia o autoplay (útil para eventos externos)
  restartAutoplay() {
    this.stopAutoplay();
    this.startAutoplay();
  }

  // Criação dos indicadores
  createIndicators() {
    if (!this.indicatorsContainer) return;

    this.indicatorsContainer.innerHTML = ""; // Limpa antes de criar (para uso em reinit, se necessário)

    for (let i = 0; i < this.totalSlides; i++) {
      const indicator = document.createElement("button");
      indicator.className = "carousel-indicator";
      indicator.setAttribute("aria-label", `Ir para slide ${i + 1}`);
      indicator.addEventListener("click", () => this.goToSlide(i));

      this.indicatorsContainer.appendChild(indicator);
      this.indicators.push(indicator);
    }
  }

  // Lógica para mover o carrossel
  moveCarousel(direction) {
    if (this.isTransitioning) return;

    // 💡 Reinicia o autoplay se o movimento for manual (prev/next buttons)
    // Isso evita que o autoplay avance imediatamente após um clique manual.
    if (this.isAutoplayRunning) {
      this.restartAutoplay();
    }

    let newIndex = this.currentIndex + direction;

    // Lógica de Loop
    if (this.options.loop) {
      if (newIndex < 0) {
        newIndex = this.totalSlides - 1; // Volta para o último
      } else if (newIndex >= this.totalSlides) {
        newIndex = 0; // Vai para o primeiro
      }
    } else {
      // Lógica Padrão (Sem Loop)
      newIndex = Math.max(0, Math.min(newIndex, this.totalSlides - 1));
    }

    this.goToSlide(newIndex);
  }

  // Lógica para ir diretamente a um slide
  goToSlide(index) {
    // Se já está no índice ou em transição, para.
    if (index === this.currentIndex || this.isTransitioning) return;

    // Reinicia o autoplay se o movimento for manual (indicador)
    if (this.isAutoplayRunning) {
      this.restartAutoplay();
    }

    this.currentIndex = index;
    this.updateUI();
  }

  // Atualiza a interface (Posição do Track, Botões, Indicadores)
  updateUI() {
    this.isTransitioning = true;

    // 1. Cálculo da Posição
    // O elemento 'track' deve ter 'display: flex' e 'gap' no CSS.
    // Assumindo que o primeiro slide (slides[0]) tem a largura correta,
    // mas é mais robusto verificar a largura do slide ativo ou usar um valor fixo.

    // Tenta obter a largura do primeiro slide, se existir
    const slideWidth = this.slides[0] ? this.slides[0].offsetWidth : 0;
    const gap = this.options.gap; // Pega o valor do gap das opções

    // Calcula o offset (deslocamento) necessário
    const offset = this.currentIndex * (slideWidth + gap);

    // Aplica a transformação
    this.track.style.transform = `translateX(-${offset}px)`;

    // 2. Atualiza a navegação e indicadores
    this.updateButtons();
    this.updateIndicators();
    this.updateAriaAttributes();
  }

  ensureCSSTransition() {
    const currentTransition = this.track.style.transition;
    const duration = `${this.transitionDuration}ms`;

    // Verifica se a propriedade 'transition' já está definida no estilo inline.
    // Se não estiver (ou for vazia), adiciona a transição para 'transform'.
    if (!currentTransition || currentTransition.indexOf("transform") === -1) {
      // Define a transição explicitamente usando o valor em milissegundos
      this.track.style.transition = `transform ${duration} ease-in-out`;
    }
  }

  // NOTA: garantir que a transição CSS esteja definida no CSS para a propriedade 'transform'
  // Exemplo: .carousel-track { transition: transform 0.4s ease; }
  // Método chamado quando a transição CSS termina
  handleTransitionEnd() {
    this.isTransitioning = false;
  }

  // Atualiza o estado de `disabled` dos botões de navegação
  updateButtons() {
    // Só atualiza se a navegação estiver ativada
    if (!this.options.showNavigation) return;

    if (this.options.loop) {
      // Se for loop, os botões nunca são desabilitados
      if (this.prevBtn) this.prevBtn.disabled = false;
      if (this.nextBtn) this.nextBtn.disabled = false;
    } else {
      // Lógica Padrão
      if (this.prevBtn) {
        this.prevBtn.disabled = this.currentIndex === 0;
      }
      if (this.nextBtn) {
        this.nextBtn.disabled = this.currentIndex === this.totalSlides - 1;
      }
    }
  }

  // Atualiza a classe `active` dos indicadores
  updateIndicators() {
    this.indicators.forEach((ind, i) => {
      // Usa toggle para adicionar/remover a classe baseado na condição
      ind.classList.toggle("active", i === this.currentIndex);
    });
  }

  // Adiciona acessibilidade (aria-hidden)
  updateAriaAttributes() {
    this.slides.forEach((slide, i) => {
      // Esconde slides que não estão ativos para leitores de tela
      slide.setAttribute("aria-hidden", i !== this.currentIndex);

      // Adiciona classe visual 'active' ao slide central (opcional no JS, mas bom para CSS)
      slide.classList.toggle("active", i === this.currentIndex);
    });
  }
}
