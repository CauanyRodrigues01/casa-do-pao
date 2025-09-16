import { SmartForm } from "./modules/smartForm.js";
import { initializeMobileMenu } from './modules/menuMobile.js';
import { smoothScroll } from './modules/smoothScroll.js';
import { initializeDropdow } from './modules/dropdown.js';


// ADICIONA REGRAS DE LIMPEZA E VALIDAÇÃO PARA O FORMULÁRIO DE LOGIN
const FieldRulesForLogin = {
  password: {
    validator: (value) => value.length >= 8,
    message: "Senha deve ter pelo menos 8 caracteres.",
  },
};

// INICIALIZAÇÃO DA PÁGINA DE LOGIN
document.addEventListener("DOMContentLoaded", () => {
        // Inicializa o menu mobile
    initializeMobileMenu();

    // Inicializa os dropdowns
    initializeDropdow();

    // Inicializa o smooth scroll para âncoras
    smoothScroll();

// Inicializa formulário de login
  const loginForm = new SmartForm(
    "loginForm",

    async (data) => {
      console.log("Dados do formulário de login:", data);
      // atraso artificial para simular a requisição de rede
      await new Promise((resolve) => setTimeout(resolve, 2000));
    },

    {
      validateOnBlur: true,
      validateOnInput: true,
      showMessages: true,
    }
  );

  // Adiciona regras customizadas aos campos (regra de validação e limpeza de campos específicos))
  loginForm.addFieldRule("password", FieldRulesForLogin.password);
});