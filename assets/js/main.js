import { initializeMobileMenu } from './modules/menuMobile.js';
import { smoothScroll } from './modules/smoothScroll.js';
import { initializeDropdow } from './modules/dropdown.js';

document.addEventListener('DOMContentLoaded', () => {

    // Inicializa o menu mobile
    initializeMobileMenu();

    // Inicializa os dropdowns
    initializeDropdow();

    // Inicializa o smooth scroll para âncoras
    smoothScroll();
})