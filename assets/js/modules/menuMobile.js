/* ===========================================
  MENU HAMBÚRGUER
=========================================== */

export function initializeMobileMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navbar = document.querySelector(".navbar-principal");

  if (!menuToggle || !navbar) {
    console.error("Elementos do menu mobile não encontrados.");
    return;
  }

  /* Fecha o menu de navegação mobile e reseta o ícone do botão. */
  function closeMobileMenu() {
    navbar.classList.remove("menu-open");
    menuToggle.innerHTML = '<i class="bi bi-list"></i>';
    menuToggle.setAttribute("aria-expanded", "false");
  }

  // ABRIR/FECHAR menu ao clicar no botão
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
}
