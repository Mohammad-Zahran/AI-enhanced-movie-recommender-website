let swiper = new Swiper('.recommendation-swiper',  {
    slidesPerView: 3,
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
    slidesPerView: 4,
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
            slidesPerView: 1,  // 1 card for mobile
        },
        576: {
            slidesPerView: 2,  // 2 cards for small screens
        },
        768: {
            slidesPerView: 3,  // 3 cards for tablets
        },
        1024: {
            slidesPerView: 4,  // 4 cards for desktops
        },
        1200: {
            slidesPerView: 4,  // 5 cards for larger screens
        },
    },
});

