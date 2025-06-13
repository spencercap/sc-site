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
		// allowTouchMove: false,
	});
	console.log('swiper', swiper);


	const swiperSources = new Swiper('#swiper_sources', {
		direction: 'horizontal',
		// slidesPerView: 3,
		slidesPerView: 'auto',
		loop: true,
		// spaceBetween: 30,
		modules: [Autoplay],
		autoplay: {
			delay: 1200,
			disableOnInteraction: false,
			pauseOnMouseEnter: true,
		},
		
		// virtual: {
		// 	enabled: true,
		// 	addSlidesAfter: 5
		// },

		// centeredSlides: true,
		// centerInsufficientSlides: true,

		// shim to fix last slide not aligning to left of container with slideperview auto 
		// solution from: https://github.com/nolimits4web/swiper/issues/3108#issuecomment-882444481
		on: {
			snapGridLengthChange: function(swiper) {
				if( swiper.snapGrid.length != swiper.slidesGrid.length ){
					swiper.snapGrid = swiper.slidesGrid.slice(0);
				}
			}
		}
	});
	swiperSources;


	const swiperClients = new Swiper('#swiper_clients-logos', {
		direction: 'horizontal',
		// slidesPerView: 5,
		slidesPerView: 3, // min
		// spaceBetween: 20,
		spaceBetween: 10,
		loop: true,
		modules: [Autoplay],
		autoplay: {
			delay: 1200,
			disableOnInteraction: false,
			pauseOnMouseEnter: true,
		},

		breakpoints: {
			// when window width is >= 480px
			480: {
				slidesPerView: 3,
				spaceBetween: 10
			},
			// when window width is >= 640px
			640: {
				slidesPerView: 4,
				spaceBetween: 20
			},
			768: {
				slidesPerView: 5,
				spaceBetween: 20
			},
		},
		
		// virtual: {
		// 	enabled: true,
		// 	addSlidesAfter: 5
		// },

		// centeredSlides: true,
		// centerInsufficientSlides: true,

		// shim to fix last slide not aligning to left of container with slideperview auto 
		// solution from: https://github.com/nolimits4web/swiper/issues/3108#issuecomment-882444481
		// on: {
		// 	snapGridLengthChange: function(swiper) {
		// 		if( swiper.snapGrid.length != swiper.slidesGrid.length ){
		// 			swiper.snapGrid = swiper.slidesGrid.slice(0);
		// 		}
		// 	}
		// }
	});
	swiperClients;
	
	
});
