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
    loop: true, // Produtos: não faz loop
    gap: 16, // Garante que o JS use o mesmo gap do CSS
  });
  carouselProdutos.init();

  const carouselDepoimentos = new Carousel("#testimonials-carousel", {
    loop: true, // Depoimentos: com loop (opcional)
    gap: 32, // Ajuste o gap para depoimentos (se for diferente no CSS)
  });
  carouselDepoimentos.init();
});
