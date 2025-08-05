const toggle = document.querySelector(".menu-toggle");
const navbar = document.querySelector(".navbar-principal");

toggle.addEventListener("click", () => {
    navbar.classList.toggle("menu-open");

    // Animar o ícone do hambúrguer
    if (navbar.classList.contains("menu-open")) {
        toggle.innerHTML = "✕";
        toggle.setAttribute('aria-expanded', 'true');
    } else {
        toggle.innerHTML = "☰";
        toggle.setAttribute('aria-expanded', 'false');
    }
});

// Fechar menu mobile ao clicar em um link
document.querySelectorAll('.navbar-principal a').forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('menu-open');
        toggle.innerHTML = "☰";
        toggle.setAttribute('aria-expanded', 'false');
    });
});

// Fechar menu ao clicar fora dele
document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !navbar.contains(e.target)) {
        navbar.classList.remove('menu-open');
        toggle.innerHTML = "☰";
        toggle.setAttribute('aria-expanded', 'false');
    }
});

// Fechar menu com tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navbar.classList.contains('menu-open')) {
        navbar.classList.remove('menu-open');
        toggle.innerHTML = "☰";
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
    }
});

// Smooth scroll para âncoras
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('#cabecalho-principal').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});