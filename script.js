document.addEventListener('DOMContentLoaded', () => {

    // Typing effect for the hero section
    const typing = new Typed(".typing", {
        strings: ["An AI Student", "A Developer", "A Problem Solver", "An Innovator"],
        typeSpeed: 100,
        backSpeed: 60,
        loop: true
    });

    // Intersection Observer for fade-in animations on scroll
    const elementsToAnimate = document.querySelectorAll('.about-section, .profiles, .profile-box');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `fadeInUp 0.8s ease-out forwards`;
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    elementsToAnimate.forEach(el => {
        el.style.opacity = '0'; // Initially hide elements
        observer.observe(el);
    });

    // Dynamic keyframes for the fade-in animation
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

});
