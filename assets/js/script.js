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

document.addEventListener('DOMContentLoaded', () => {
    const produtosWrapper = document.getElementById('produtosWrapper');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = produtosWrapper.nextElementSibling;
    const indicatorsContainer = document.getElementById('indicators');

    if (!produtosWrapper || !prevBtn || !nextBtn || !indicatorsContainer) {
        // Sai se algum elemento não for encontrado
        return;
    }

    const produtos = Array.from(produtosWrapper.children);
    
    // Calcula quantos produtos cabem no contêiner
    const getItemsPerView = () => {
        const itemWidth = produtos[0].offsetWidth + (parseFloat(getComputedStyle(produtosWrapper).gap) || 0);
        return Math.floor(produtosWrapper.offsetWidth / itemWidth);
    };

    // Cria os indicadores dinamicamente
    const totalItems = produtos.length;
    const totalIndicators = Math.ceil(totalItems / getItemsPerView());

    for (let i = 0; i < totalIndicators; i++) {
        const indicator = document.createElement('div');
        indicator.classList.add('indicator');
        indicatorsContainer.appendChild(indicator);
    }

    const indicators = Array.from(indicatorsContainer.children);
    let currentIndicatorIndex = 0;

    // Função para atualizar o indicador ativo
    const updateIndicators = () => {
        indicators.forEach((ind, index) => {
            if (index === currentIndicatorIndex) {
                ind.classList.add('active');
            } else {
                ind.classList.remove('active');
            }
        });
    };

    updateIndicators();

    // Lógica de navegação
    prevBtn.addEventListener('click', () => {
        const itemsPerView = getItemsPerView();
        const scrollAmount = itemsPerView * (produtos[0].offsetWidth + (parseFloat(getComputedStyle(produtosWrapper).gap) || 0));
        produtosWrapper.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });

    nextBtn.addEventListener('click', () => {
        const itemsPerView = getItemsPerView();
        const scrollAmount = itemsPerView * (produtos[0].offsetWidth + (parseFloat(getComputedStyle(produtosWrapper).gap) || 0));
        produtosWrapper.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    // Atualiza o indicador ao rolar o carrossel
    produtosWrapper.addEventListener('scroll', () => {
        const itemsPerView = getItemsPerView();
        const scrollPos = produtosWrapper.scrollLeft;
        const newIndicatorIndex = Math.round(scrollPos / (itemsPerView * (produtos[0].offsetWidth + (parseFloat(getComputedStyle(produtosWrapper).gap) || 0))));
        if (newIndicatorIndex !== currentIndicatorIndex) {
            currentIndicatorIndex = newIndicatorIndex;
            updateIndicators();
        }
    });

    // Lógica para navegação pelos indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            const itemsPerView = getItemsPerView();
            const scrollAmount = itemsPerView * (produtos[0].offsetWidth + (parseFloat(getComputedStyle(produtosWrapper).gap) || 0));
            produtosWrapper.scrollLeft = index * scrollAmount;
        });
    });
});