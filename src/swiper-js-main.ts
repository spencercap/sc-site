console.log('sssss');

// import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11.2.6/+esm';

import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';
console.log('Swiper', Swiper);

// css imported above script tag
// import 'https://cdn.jsdelivr.net/npm/swiper@11.2.6/swiper.css';
// import 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
// import 'swiper/css';

const swiper = new Swiper('.swiper', {
    direction: 'vertical',
    loop: true,
    autoplay: {
        delay: 1800,
    },
    speed: 180, // ms
});
console.log('swiper', swiper);
