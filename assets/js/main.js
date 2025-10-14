import { initializeMobileMenu } from "./modules/menuMobile.js";
import { smoothScroll } from "./modules/smoothScroll.js";
import { initializeDropdow } from "./modules/dropdown.js";
import { Carousel } from "./modules/carousel.js";

// ========================================
// INICIALIZAÇÃO DO APLICATIVO
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Aplicativo inicializado");

  // Inicializa componentes globais
  initializeMobileMenu();
  initializeDropdow();
  smoothScroll();

  const carouselProdutos = new Carousel("#products-carousel", {
    loop: true,
    gap: 16, // Garante que o JS use o mesmo gap do CSS
    autoplay: true,
    autoplayInterval: 4000, // 4 segundos
    showNavigation: true,
  });

  const carouselDepoimentos = new Carousel("#testimonials-carousel", {
    loop: true,
    gap: 32, // Garante que o JS use o mesmo gap do CSS
    autoplay: true,
    autoplayInterval: 4000, // 4 segundos
    showNavigation: false,
  });
});

window.addEventListener("scroll", () => {
  const actionButtons = document.querySelector(".action-buttons");
  const cabecalho = document.querySelector(".cabecalho-container");

  // Lógica para esconder/mostrar os botões
  if (window.scrollY > 50) {
    actionButtons.classList.add("hidden");
  } else {
    actionButtons.classList.remove("hidden");
  }

  // Lógica para zerar o gap do grid no mobile
  if (window.innerWidth <= 452 && window.scrollY >= 50) {
    cabecalho.classList.add("shrink");
  } else {
    cabecalho.classList.remove("shrink");
  }
});
