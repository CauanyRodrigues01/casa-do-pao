/* ===========================================
  DROPDOWN DE NAVEGAÇÃO
=========================================== */

export function initializeDropdow() {
  const dropdowns = document.querySelectorAll(".dropdown");

  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector(".dropdown-toggle");
    const menu = dropdown.querySelector(".dropdown-menu");

    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      // Fecha outros dropdowns
      dropdowns.forEach((otherDropdown) => {
        if (otherDropdown !== dropdown) {
          otherDropdown.classList.remove("active");
          otherDropdown
            .querySelector(".dropdown-toggle")
            .setAttribute("aria-expanded", "false");
        }
      });

      // Toggle do dropdown atual
      const isActive = dropdown.classList.contains("active");
      dropdown.classList.toggle("active");
      toggle.setAttribute("aria-expanded", !isActive);
    });
  });

  // Fecha dropdown ao clicar fora
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".dropdown")) {
      dropdowns.forEach((dropdown) => {
        dropdown.classList.remove("active");
        dropdown
          .querySelector(".dropdown-toggle")
          .setAttribute("aria-expanded", "false");
      });
    }
  });
}
