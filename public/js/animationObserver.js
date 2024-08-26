const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('activate-animation');
        }
      });
});


observer.observe(document.querySelector('.marketing__title'));
observer.observe(document.querySelector('.marketing__poster'));