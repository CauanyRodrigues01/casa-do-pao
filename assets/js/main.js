import { initializeMobileMenu } from './modules/menuMobile.js';
import { smoothScroll } from './modules/smoothScroll.js';

document.addEventListener('DOMContentLoaded', () => {

    // Inicializa o menu mobile
    initializeMobileMenu();

    // Inicializa o smooth scroll para âncoras
    smoothScroll();
})