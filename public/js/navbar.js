/**
 * Toggles the visibility of the navigation bar.
 *
 * @param {HTMLElement} buttonElement - The button element that triggers the toggle action.
 */
function toggleNavbar(buttonElement) {
    const navbar = document.querySelector(".navbar");
    buttonElement.classList.toggle('active');

    if (buttonElement.classList.contains('active')) {
        navbar.classList.add('active');
    } else {
        navbar.classList.remove('active');
    }
}

