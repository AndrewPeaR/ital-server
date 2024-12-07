const swiperCustomers = new Swiper(".swiper__customers", {
    loop: true,
    autoplay: {
      delay: 3000,
    },
    spaceBetween: 20,
    navigation: {
      nextEl: ".mySwiper-button-next",
      prevEl: ".mySwiper-button-prev",
    },
    slidesPerView: 2,
    breakpoints: {
      980: {
        spaceBetween: 40,
        slidesPerView: 3,
      },
      640: {
        slidesPerView: 3,
      }
    }
  });


const swiperNewsThumbs = new Swiper(".swiper__news-thumbs", {
    slidesPerView: 6,
    spaceBetween: 33,
  });
  
const swiperNews = new Swiper(".swiper__news", {
  loop: true,
  autoplay: {
    delay: 3000,
  },
  parallax: true,
  speed: 1000,
  navigation: {                       
    nextEl: ".news-slider__thumbs-button-next",
    prevEl: ".news-slider__thumbs-button-prev",
  },
  thumbs: {                       //added
    swiper: swiperNewsThumbs,   //added
  },
});

const swiperVendors = new Swiper(".swiper__vendors", {
  slidesPerView: 3,
  spaceBetween: 20,
  draggable: true,
  // autoplay: {
  //   delay: 3000,
  // },
  grid: {
    rows: 2
  },
  scrollbar: {
    el: ".swiper__vendors-scrollbar",
    dragClass: 'swiper__vendors-scrollbar__drag'
  },
  navigation: {                       
    nextEl: ".vendors__controls-next",
    prevEl: ".vendors__controls-back",
  },
  breakpoints: {
    1000: {
      grid: {
        rows: 2
      },
      slidesPerView: 4,
    }, 
    480: {
      grid: {
        rows: 2
      },
      slidesPerView: 3,
    }
  }
});