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

  }

  // Método para iniciar o carrossel
  init() {
    if (!this.container || this.totalSlides <= 1) return;
    this.createIndicators();
    this.setupNavigation();
    this.setupResizeObserver(); // Inicializa o observer
    this.updateUI(); // Chama updateUI para garantir o estado inicial
  }

  // Método para limpeza (importante para SPAs ou componentes dinâmicos)
  destroy() {
    this.track.removeEventListener("transitionend", () =>
      this.handleTransitionEnd()
    );
    this.prevBtn.removeEventListener("click", this.handlePrevClick);
    this.nextBtn.removeEventListener("click", this.handleNextClick);
    this.indicators.forEach((indicator, i) => {
      indicator.removeEventListener("click", () => this.goToSlide(i));
    });
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

  // Configura a navegação (melhoria com referência a métodos)
  setupNavigation() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener("click", this.handlePrevClick);
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", this.handleNextClick);
    }
  }

  // Criação dos indicadores
  createIndicators() {
    if (!this.indicatorsContainer) return;

    this.indicatorsContainer.innerHTML = ""; // Limpa antes de criar (para uso em reinit, se necessário)

    for (let i = 0; i < this.totalSlides; i++) {
      const indicator = document.createElement("button");
      indicator.className = "carousel-indicator";
      // Acessibilidade: indica para qual slide o botão leva
      indicator.setAttribute("aria-label", `Ir para slide ${i + 1}`);
      // Usa 'let' no loop para capturar o índice correto
      indicator.addEventListener("click", () => this.goToSlide(i));

      this.indicatorsContainer.appendChild(indicator);
      this.indicators.push(indicator);
    }
  }

  // Lógica para mover o carrossel
  moveCarousel(direction) {
    if (this.isTransitioning) return;

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

    // NOTA: O 'setTimeout' original foi substituído por um 'transitionend' listener (abaixo).
    // No entanto, para o caso de `updateUI` ser chamado sem transição (ex: no resize),
    // devemos resetar `isTransitioning` após o cálculo.
    // A melhor prática é usar o evento `transitionend` (veja `handleTransitionEnd`).
    // Para garantir o reset em casos de não-transição, podemos usar um timeout curto:
    // Se a transição CSS não estiver definida, o `transitionend` não será disparado.

    // Se não for usar o `transitionend`, mantenha o setTimeout:
    // setTimeout(() => { this.isTransitioning = false; }, this.transitionDuration);
  }

  // Método chamado quando a transição CSS termina
  handleTransitionEnd() {
    this.isTransitioning = false;
  }

  // Atualiza o estado de `disabled` dos botões de navegação
  updateButtons() {
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
