import { SmartForm } from "./modules/smartForm.js";
import { initializeMobileMenu } from "./modules/menuMobile.js";
import { smoothScroll } from "./modules/smoothScroll.js";
import { initializeDropdow } from "./modules/dropdown.js";

// Inicializa as funções da página de sobre nós
document.addEventListener("DOMContentLoaded", () => {
  // Inicializa o menu mobile
  initializeMobileMenu();

  // Inicializa os dropdowns
  initializeDropdow();

  // Inicializa o smooth scroll para âncoras
  smoothScroll();

  // INICIALIZAÇÃO DO FORMULÁRIO DE CONTATO
  document.addEventListener("DOMContentLoaded", () => {
    const contactForm = new SmartForm(
      "entrarEmContatoForm",

      async (data) => {
        console.log("Dados do formulário de contato:", data);
        // atraso artificial para simular a requisição de rede
        await new Promise((resolve) => setTimeout(resolve, 2000));
      },

    {
      validateOnBlur: true,
      validateOnInput: true,
      showMessages: true,
    }
    );
  });
});
