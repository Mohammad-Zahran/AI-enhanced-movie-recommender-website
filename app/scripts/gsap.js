// GSAP animation for Recommendation Section
document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.recommendation-swiper .swiper-slide');

    gsap.set(slides, { opacity: 0, y: 50 });

    gsap.to(slides, {
        opacity: 1,
        y: 0,
        duration: 1.5,
        stagger: 0.3, 
        scrollTrigger: {
            trigger: '.recommendation-section',
            start: 'top 80%', 
            end: 'top 30%',
            scrub: true,
            toggleActions: 'play none none reverse', 
        }
    });
});
