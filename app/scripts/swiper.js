let swiper = new Swiper('.recommendation-swiper',  {
    loop: true,
    spaceBetween: 30,

    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
    },

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    breakpoints: {
        0: {
            slidesPerView: 1,  
        },
        768: {
            slidesPerView: 2,  
        },
        1024: {
            slidesPerView: 3,  
        },
    },
});

let popularSwiper = new Swiper('.popular-swiper', {
    loop: true,
    spaceBetween: 30,

    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
    },

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    breakpoints: {
        0: {
            slidesPerView: 1,  
        },
        768: {
            slidesPerView: 2,  
        },
        1024: {
            slidesPerView: 3,
        },
    },
});

