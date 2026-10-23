const aboutSection = document.querySelector('.about-section');

if (aboutSection) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    aboutSection.classList.add('is-visible');
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });

    observer.observe(aboutSection);
  }
}

const aboutPhotos = [
  {
    src: 'public/about-photo-osint-2026.jpg',
    alt: 'Anika Kapasi outside Wallis Annenberg Hall at the University of Southern California',
    caption: 'Got flown out by BU to attend the 2026 OSINT conference at USC',
    position: '50% 58%'
  },
  {
    src: 'public/about-photo-07.png',
    alt: 'Personal photograph of Anika Kapasi',
    caption: 'Last publication as Editor-in-Chief of my high school paper — senior magazine edition (Spring 2025)'
  },
  {
    src: 'public/about-photo-05.png',
    alt: 'Personal photograph of Anika Kapasi',
    caption: 'Meeting Boston Mayor Michelle Wu at the first State of the Schools Address (Fall 2025)'
  },
  {
    src: 'public/about-photo-08.png',
    alt: 'Personal photograph of Anika Kapasi',
    caption: 'Spending two weeks at the California Scholastic Press Association workshop in high school learning strong journalistic practices (Summer 2024)'
  },
  {
    src: 'public/about-photo-14.jpg',
    alt: 'Personal photograph of Anika Kapasi',
    caption: 'Returning as a counselor to the California Scholastic Press Association workshop (Summer 2026)',
    position: '75% 50%'
  },
  {
    src: 'public/about-photo-13.png',
    alt: 'Personal photograph of Anika Kapasi',
    caption: 'First front page story for the FreeP (Winter 2026)',
    position: '50% 18%',
    fit: 'cover'
  },
  {
    src: 'public/about-photo-09.png',
    alt: 'Personal photograph of Anika Kapasi',
    caption: 'Presenting two articles at a student showcase held by the Society of Professional Journalists, BU chapter (Spring 2026)'
  },
  {
    src: 'public/about-photo-11.jpg',
    alt: 'Personal photograph of Anika Kapasi',
    caption: 'Editing layouts during print night as a co-Editor-in-Chief in high school (Fall 2024)',
    position: '25% 65%'
  },
  {
    src: 'public/about-photo-12.jpg',
    alt: 'Personal photograph of Anika Kapasi',
    caption: 'One of my first print nights as a new staffer on my high school paper (Fall 2022)'
  },
  {
    src: 'public/about-photo-04.png',
    alt: 'Personal photograph of Anika Kapasi',
    caption: 'First time covering a breaking news event (Fall 2025)'
  },
  {
    src: 'public/about-photo-06.png',
    alt: 'Personal photograph of Anika Kapasi',
    caption: 'Selfie with my first official press pass! (Fall 2025)'
  }
];

const carousel = document.querySelector('.about-carousel');

if (carousel) {
  const photo = carousel.querySelector('.carousel-photo');
  let currentImage = photo.querySelector('img');
  const hoverCaption = photo.querySelector('figcaption');
  const touchCaption = carousel.querySelector('.carousel-touch-caption');
  const count = carousel.querySelector('.carousel-count');
  const previous = carousel.querySelector('.carousel-prev');
  const next = carousel.querySelector('.carousel-next');
  let photoIndex = 0;
  let isTransitioning = false;
  let pointerStart = null;

  aboutPhotos.forEach(({ src }) => {
    const preload = new Image();
    preload.src = src;
  });

  const updateText = (index) => {
    const item = aboutPhotos[index];
    hoverCaption.textContent = item.caption;
    touchCaption.textContent = item.caption;
    count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(aboutPhotos.length).padStart(2, '0')}`;
  };

  const applyImage = (element, item) => {
    element.src = item.src;
    element.alt = item.alt;
    element.style.objectPosition = item.position || '';
    element.style.setProperty('--photo-scale', item.scale || '1');
    element.style.objectFit = item.fit || '';
  };

  const finishTransition = (outgoing, incoming) => {
    outgoing.remove();
    incoming.classList.remove('is-incoming', 'is-active');
    incoming.classList.add('is-current');
    currentImage = incoming;
    isTransitioning = false;
  };

  const renderPhoto = (index, animate = true, direction = 1) => {
    const item = aboutPhotos[index];
    updateText(index);

    if (!animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      applyImage(currentImage, item);
      return;
    }

    isTransitioning = true;
    photo.style.setProperty('--carousel-direction', direction);
    const incoming = document.createElement('img');
    incoming.className = 'carousel-image is-incoming';
    incoming.decoding = 'async';
    applyImage(incoming, item);
    photo.append(incoming);

    const begin = () => {
      currentImage.classList.remove('is-current');
      currentImage.classList.add('is-outgoing');
      window.requestAnimationFrame(() => incoming.classList.add('is-active'));
      window.setTimeout(() => finishTransition(currentImage, incoming), 520);
    };

    if (incoming.complete) {
      begin();
    } else {
      incoming.addEventListener('load', begin, { once: true });
      incoming.addEventListener('error', () => finishTransition(currentImage, incoming), { once: true });
    }
  };

  const movePhoto = (direction) => {
    if (isTransitioning) return;
    photoIndex = (photoIndex + direction + aboutPhotos.length) % aboutPhotos.length;
    renderPhoto(photoIndex, true, direction);
  };

  previous.addEventListener('click', () => movePhoto(-1));
  next.addEventListener('click', () => movePhoto(1));
  photo.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      movePhoto(-1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      movePhoto(1);
    }
  });
  photo.addEventListener('pointerdown', (event) => {
    if (event.isPrimary) pointerStart = { x: event.clientX, y: event.clientY };
  });
  photo.addEventListener('pointerup', (event) => {
    if (!pointerStart || !event.isPrimary) return;
    const deltaX = event.clientX - pointerStart.x;
    const deltaY = event.clientY - pointerStart.y;
    pointerStart = null;
    if (Math.abs(deltaX) > 38 && Math.abs(deltaX) > Math.abs(deltaY)) movePhoto(deltaX < 0 ? 1 : -1);
  });
  photo.addEventListener('pointercancel', () => { pointerStart = null; });
  previous.disabled = aboutPhotos.length < 2;
  next.disabled = aboutPhotos.length < 2;
  currentImage.classList.add('carousel-image', 'is-current');
  renderPhoto(photoIndex, false);
}
