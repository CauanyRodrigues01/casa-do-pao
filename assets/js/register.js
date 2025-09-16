import { SmartForm } from "./modules/smartForm.js";
import { initializeMobileMenu } from "./modules/menuMobile.js";
import { smoothScroll } from "./modules/smoothScroll.js";
import { initializeDropdow } from "./modules/dropdown.js";

class PasswordStrengthChecker {
  constructor(passwordField, strengthBar, strengthText, formInstance) {
    this.passwordField = passwordField;
    this.strengthBar = strengthBar;
    this.strengthText = strengthText;
    this.formInstance = formInstance;
    this.init();
  }

  init() {
    if (this.passwordField && this.strengthBar && this.strengthText) {
      this.passwordField.addEventListener("input", () => {
        const strengthData = this.calculatePasswordStrength(
          this.passwordField.value
        );
        this.updatePasswordStrength(strengthData);
        this.formInstance.validateField(this.passwordField);
      });
      this.passwordField.addEventListener("blur", () => {
        this.formInstance.validateField(this.passwordField, true);
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

  updatePasswordStrength({ strength, feedback }) {
    this.strengthBar.className = "strength-bar";
    if (strength <= 2) {
      this.strengthBar.classList.add("strength-weak");
      this.strengthText.textContent = `Senha fraca. Adicione: ${feedback
        .slice(0, 2)
        .join(", ")}`;
      this.strengthText.classList.add("strength-weak-text");
    } else if (strength <= 4) {
      this.strengthBar.classList.add("strength-medium");
      this.strengthText.textContent = `Senha média. Considere adicionar: ${feedback.join(
        ", "
      )}`;
      this.strengthText.classList.add("strength-medium-text");
    } else {
      this.strengthBar.classList.add("strength-strong");
      this.strengthText.textContent = "Senha forte! ✓";
      this.strengthText.classList.add("strength-strong-text");
    }
  }

  resetPasswordStrength() {
    if (this.strengthBar && this.strengthText) {
      this.strengthBar.className = "strength-bar";
      this.strengthText.textContent = "";
    }
  }
}

// REGRAS DE VALIDAÇÃO E LIMPEZA CUSTOMIZADAS PARA REGISTRO DE USUÁRIO
const FieldRulesForRegister = {
  // Regra para o campo de senha de usuário
  password: {
    validator: (value) => value.length >= 8,
    message: "Senha deve ter pelo menos 8 caracteres.",
  },
  // Regra para o campo de confirmação de senha do usuário
  confirmPassword: {
    validator: (value) => {
      const passwordField = document.querySelector('input[name="password"]');
      return passwordField && value === passwordField.value;
    },
    message: "As senhas não coincidem.",
  },
};

// Inicializa as funções da página de cadastro
document.addEventListener("DOMContentLoaded", () => {
  // Inicializa o menu mobile
  initializeMobileMenu();

  // Inicializa os dropdowns
  initializeDropdow();

  // Inicializa o smooth scroll para âncoras
  smoothScroll();

  // INICIALIZAÇÃO DO FORMULÁRIO DE REGISTRO
  const registerForm = new SmartForm(
    // ID do formulário
    "registerForm",

    // Função de envio
    async (data) => {
      console.log("Dados do formulário:", data);
      // Aqui se faria a requisição real

      // atraso artificial para simular a requisição de rede
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // return fetch('/api/submit', { method: 'POST', body: JSON.stringify(data) });
    },
    // Opções de configuração
    {
      validateOnBlur: true,
      validateOnInput: true,
      showMessages: true,
    }
  );

  // Adiciona regras customizadas aos campos (regra de validação e limpeza de campos específicos))
  registerForm
    .addFieldRule("password", FieldRulesForRegister.password)
    .addFieldRule("confirmPassword", FieldRulesForRegister.confirmPassword);

  const passwordField = document.querySelector("#password");
  const strengthBar = document.querySelector("#password-strength-bar");
  const strengthText = document.querySelector("#password-strength-text");

  if (passwordField && strengthBar && strengthText) {
    new PasswordStrengthChecker(
      passwordField,
      strengthBar,
      strengthText,
      registerForm
    );
  }

  const confirmPasswordField = document.querySelector("#confirmPassword");

  // Adiciona listener para validar a confirmação da senha em tempo real
  if (passwordField && confirmPasswordField) {
    passwordField.addEventListener("input", () => {
      registerForm.validateField(confirmPasswordField);
    });
  }
});
