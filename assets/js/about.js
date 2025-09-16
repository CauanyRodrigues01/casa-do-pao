import { SmartForm } from "./modules/smartForm.js";
import { initializeMobileMenu } from "./modules/menuMobile.js";
import { smoothScroll } from "./modules/smoothScroll.js";
import { initializeDropdow } from "./modules/dropdown.js";

// ADICIONA REGRAS DE LIMPEZA E VALIDAÇÃO PARA O FORMULÁRIO DE CURRICULO
const FieldRulesForCurriculum = {
  file: {
    validator: (value, field) => {
      if (field.files.length === 0) {
        return false;
      }
      const file = field.files[0];
      const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
      return file.type === "application/pdf" && file.size <= maxSizeInBytes;
    },
    message: "Por favor, submeta um arquivo em formato PDF, com no máximo 2MB.",
  },
};

// Inicializa as funções da página de sobre nós
document.addEventListener("DOMContentLoaded", () => {
  // Inicializa o menu mobile
  initializeMobileMenu();

  // Inicializa os dropdowns
  initializeDropdow();

  // Inicializa o smooth scroll para âncoras
  smoothScroll();
  
  // INICIALIZAÇÃO DO FORMULÁRIO DE CURRÍCULO
  const curriculumForm = new SmartForm(
    "applyForm",

    async (data) => {
      console.log("Dados do formulário de currículo:", data);
      // atraso artificial para simular a requisição de rede
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  );

  curriculumForm.addFieldRule("file", FieldRulesForCurriculum.file);
});
