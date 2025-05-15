import Swiper from 'swiper'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/autoplay'

document.addEventListener('DOMContentLoaded', () => {
    console.log('initSwipers');

    const swiper = new Swiper('#swiper_tech_stack', {
		direction: 'vertical',
		slidesPerView: 5,
		loop: true,
		// spaceBetween: 30,
		modules: [Autoplay],
		autoplay: {
			delay: 1200,
			disableOnInteraction: false,
		},
		centeredSlides: true,
		centerInsufficientSlides: true,
	});
	console.log('swiper', swiper);
	
});
