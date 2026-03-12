import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const images = [
  'https://images.pexels.com/photos/3912572/pexels-photo-3912572.jpeg',
  'https://images.pexels.com/photos/1722868/pexels-photo-1722868.jpeg',
  'https://images.pexels.com/photos/8686319/pexels-photo-8686319.jpeg',
  'https://images.pexels.com/photos/6648493/pexels-photo-6648493.jpeg',
  'https://images.unsplash.com/photo-1594465919760-441fe5908ab0?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWFrZXVwfGVufDB8fDB8fHww',
  'https://images.unsplash.com/photo-1611826585949-b0ccabd2c1a4?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG1ha2V1cHxlbnwwfHwwfHx8MA%3D%3D'
];

const studioImages = [
  'https://images.pexels.com/photos/7290089/pexels-photo-7290089.jpeg',
  'https://images.unsplash.com/photo-1516975080661-422fc2f5d565?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFrZXVwJTIwc3R1ZGlvfGVufDB8fDB8fHww'
];

const getImg = (index: number) => images[index % images.length];
const getStudioImg = (index: number) => studioImages[index % studioImages.length];

const calculateInitialTransform = (element: Element, offsetDistance = 250, maxRotation = 300, maxZTranslation = 2000) => {
  const viewportCenter = { width: window.innerWidth / 2, height: window.innerHeight / 2 };
  const elementCenter = {
    x: (element as HTMLElement).offsetLeft + (element as HTMLElement).offsetWidth / 2,
    y: (element as HTMLElement).offsetTop + (element as HTMLElement).offsetHeight / 2
  };

  const angle = Math.atan2(Math.abs(viewportCenter.height - elementCenter.y), Math.abs(viewportCenter.width - elementCenter.x));
  const translateX = Math.abs(Math.cos(angle) * offsetDistance);
  const translateY = Math.abs(Math.sin(angle) * offsetDistance);
  const maxDistance = Math.sqrt(Math.pow(viewportCenter.width, 2) + Math.pow(viewportCenter.height, 2));
  const currentDistance = Math.sqrt(Math.pow(viewportCenter.width - elementCenter.x, 2) + Math.pow(viewportCenter.height - elementCenter.y, 2));
  const distanceFactor = currentDistance / maxDistance;

  const rotationX = ((elementCenter.y < viewportCenter.height ? -1 : 1) * (translateY / offsetDistance) * maxRotation * distanceFactor);
  const rotationY = ((elementCenter.x < viewportCenter.width ? 1 : -1) * (translateX / offsetDistance) * maxRotation * distanceFactor);
  const translateZ = maxZTranslation * distanceFactor;

  return {
    x: elementCenter.x < viewportCenter.width ? -translateX : translateX,
    y: elementCenter.y < viewportCenter.height ? -translateY : translateY,
    z: translateZ,
    rotateX: rotationX,
    rotateY: rotationY
  };
};

export default function App() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  useGSAP(() => {
    // Frame animation
    const frame = document.querySelector('.frame');
    const frameTitle = frame?.querySelector('.frame__title');

    if (frame && frameTitle) {
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: frame,
          start: 'clamp(top bottom)',
          end: 'bottom top',
          scrub: true
        }
      })
      .to(frame, {
        yPercent: 35,
        scale: 0.95,
        startAt: { filter: 'brightness(100%)' },
        filter: 'brightness(70%)'
      })
      .to(frameTitle, {
        xPercent: -80
      }, 0);
    }

    // Grid 1
    const grid1 = document.querySelector('[data-grid-first]');
    if (grid1) {
      const gridImages = grid1.querySelectorAll('.grid__img');
      gsap.timeline({
        defaults: { ease: 'sine' },
        scrollTrigger: {
          trigger: grid1,
          start: 'center center',
          end: '+=250%',
          pin: grid1.parentNode as Element,
          scrub: 0.5,
        }
      })
      .from(gridImages, {
        stagger: 0.07,
        y: () => gsap.utils.random(window.innerHeight, window.innerHeight * 1.8)
      })
      .from(grid1.parentNode?.querySelector('.content__title') as Element, {
        duration: 1.2,
        ease: 'power4',
        yPercent: 180,
        autoAlpha: 0
      }, 0.8);
    }

    // Grid 2
    const grid2 = document.querySelector('[data-grid-second]');
    if (grid2) {
      const gridImages = grid2.querySelectorAll('.grid__img');
      const middleIndex = Math.floor(gridImages.length / 2);
      gsap.timeline({
        defaults: { ease: 'power3' },
        scrollTrigger: {
          trigger: grid2,
          start: 'center center',
          end: '+=250%',
          pin: grid2.parentNode as Element,
          scrub: 0.5,
        }
      })
      .from(gridImages, {
        stagger: { amount: 0.3, from: 'center' },
        y: window.innerHeight,
        transformOrigin: '50% 0%',
        rotation: pos => {
          const distanceFromCenter = Math.abs(pos - middleIndex);
          return pos < middleIndex ? distanceFromCenter * 3 : distanceFromCenter * -3;
        },
      })
      .from(grid2.querySelectorAll('.grid__item'), {
        stagger: { amount: 0.3, from: 'center' },
        yPercent: 100,
        autoAlpha: 0
      }, 0);
    }

    // Grid 3
    const grid3 = document.querySelector('[data-grid-third]');
    if (grid3) {
      const gridImages = grid3.querySelectorAll('.grid__img');
      gsap.timeline({
        defaults: { ease: 'power3' },
        scrollTrigger: {
          trigger: grid3,
          start: 'center center',
          end: '+=200%',
          pin: grid3.parentNode as Element,
          scrub: 0.2,
        }
      })
      .from(gridImages, {
        stagger: 0.06,
        y: window.innerHeight,
        rotation: () => gsap.utils.random(-15,15),
        transformOrigin: '50% 0%'
      })
      .fromTo(gridImages, {
        filter: 'brightness(100%)'
      }, {
        ease: 'none',
        stagger: 0.06,
        filter: pos => pos < gridImages.length-1 ? 'brightness(20%)' : 'brightness(100%)'
      }, 0)
      .from(grid3.querySelectorAll('.grid__item'), {
        xPercent: pos => pos%2 ? 100 : -100,
        autoAlpha: 0
      }, 0.06*gridImages.length);
    }

    // Grid 4
    const grid4 = document.querySelector('[data-grid-fourth]');
    if (grid4) {
      const gridImages = grid4.querySelectorAll('.grid__img');
      gsap.timeline({
        defaults: { ease: 'expo' },
        scrollTrigger: {
          trigger: grid4,
          start: 'center center',
          end: '+=200%',
          pin: grid4.parentNode as Element,
          scrub: 0.2,
        }
      })
      .set(grid4, {perspective: 1000})
      .fromTo(gridImages, {
        x: (_, el) => calculateInitialTransform(el).x,
        y: (_, el) => calculateInitialTransform(el).y,
        z: (_, el) => calculateInitialTransform(el).z,
        rotateX: (_, el) => calculateInitialTransform(el).rotateX*.5,
        rotateY: (_, el) => calculateInitialTransform(el).rotateY,
        autoAlpha: 0,
        scale: 0.7,
      }, {
        x: 0,
        y: 0,
        z: 0,
        rotateX: 0,
        rotateY: 0,
        autoAlpha: 1,
        scale: 1,
        stagger: {
          amount: 0.2,
          from: 'center',
          grid: [4, 9]
        }
      });
    }

    // Grid 4 v2
    const grid4v2 = document.querySelector('[data-grid-fourth-v2]');
    if (grid4v2) {
      const gridImages = grid4v2.querySelectorAll('.grid__img');
      gsap.timeline({
        defaults: { ease: 'power4' },
        scrollTrigger: {
          trigger: grid4v2,
          start: 'center center',
          end: '+=200%',
          pin: grid4v2.parentNode as Element,
          scrub: 0.2,
        }
      })
      .set(grid4v2, {perspective: 1200})
      .fromTo(gridImages, {
        x: (_, el) => calculateInitialTransform(el, 900).x,
        y: (_, el) => calculateInitialTransform(el, 600).y,
        z: (_, el) => calculateInitialTransform(el, 250, 300, -3000).z,
        rotateX: (_, el) => calculateInitialTransform(el, 250, -160, -3000).rotateX,
        rotateY: (_, el) => calculateInitialTransform(el, 250, -160, -3000).rotateY,
        autoAlpha: 0,
        scale: 0.4,
      }, {
        x: 0,
        y: 0,
        z: 0,
        rotateX: 0,
        rotateY: 0,
        autoAlpha: 1,
        scale: 1,
        stagger: {
          amount: 0.15,
          from: 'center',
          grid: [4, 9]
        }
      });
    }

    // Grid 5
    const grid5 = document.querySelector('[data-grid-fifth]');
    if (grid5) {
      const gridImages = grid5.querySelectorAll('.grid__img');
      gsap.timeline({
        defaults: { ease: 'sine' },
        scrollTrigger: {
          trigger: grid5,
          start: 'center center',
          end: '+=250%',
          pin: grid5.parentNode as Element,
          scrub: 0.3,
        }
      })
      .set(grid5, {perspective: 1000})
      .from(gridImages, {
        stagger: {
          amount: 0.4,
          from: 'random',
          grid: [4,9]
        },
        y: window.innerHeight,
        rotationX: -70,
        transformOrigin: '50% 0%',
        z: -900,
        autoAlpha: 0
      });
    }

    // Grid 6
    const grid6 = document.querySelector('[data-grid-sixth]');
    if (grid6) {
      const gridImages = grid6.querySelectorAll('.grid__img');
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: grid6,
          start: 'center center',
          end: '+=200%',
          pin: grid6.parentNode as Element,
          scrub: 0.5,
        }
      })
      .from(gridImages, {
        stagger: {
          amount: 0.03,
          from: 'edges',
          grid: [3,3]
        },
        scale: 0.7,
        autoAlpha: 0
      })
      .from(grid6, {
        scale: .7,
        skewY: 5,
      }, 0);
    }

    // Grid 7
    const grid7 = document.querySelector('[data-grid-seventh]');
    if (grid7) {
      const gridImages = grid7.querySelectorAll('.grid__img');
      gsap.timeline({
        defaults: { ease: 'power1' },
        scrollTrigger: {
          trigger: grid7,
          start: 'center center',
          end: '+=150%',
          pin: grid7.parentNode as Element,
          scrub: 0.5,
        }
      })
      .fromTo(gridImages, {
        yPercent: -102,
      }, {
        stagger: 0.08,
        yPercent: 0,
      })
      .from(Array.from(gridImages).map(img => img.querySelector('.grid__img-inner')), {
        stagger: 0.08,
        yPercent: 102,
      }, 0)
      .from(grid7.querySelectorAll('.grid__item'), {
        yPercent: 20,
        stagger: gridImages.length/2*0.08,
        autoAlpha: 0,
      }, 0);
    }

    // Grid 8
    const grid8 = document.querySelector('[data-grid-eighth]');
    if (grid8) {
      const gridImages = grid8.querySelectorAll('.grid__img');
      gsap.timeline({
        defaults: { ease: 'expo' },
        scrollTrigger: {
          trigger: grid8,
          start: 'center center',
          end: '+=250%',
          pin: grid8.parentNode as Element,
          scrub: true,
        }
      })
      .set(grid8, {perspective: 2000})
      .from(gridImages, {
        stagger: {
          amount: 0.8,
          from: 'start'
        },
        rotationY: 65,
        transformOrigin: '0% 50%',
        z: -200,
        yPercent: 10
      })
      .from(gridImages, {
        stagger: {
          amount: 0.8,
          from: 'start'
        },
        duration: 0.2,
        autoAlpha: 0
      }, 0);
    }

    // Grid 9
    const grid9 = document.querySelector('[data-grid-ninth]');
    if (grid9) {
      const gridImages = grid9.querySelectorAll('.grid__img');
      gsap.timeline({
        defaults: { ease: 'power3' },
        scrollTrigger: {
          trigger: grid9,
          start: 'center center',
          end: '+=200%',
          pin: grid9.parentNode as Element,
          scrub: true,
        }
      })
      .from(gridImages, {
        transformOrigin: '100% -450%',
        stagger: 0.07,
        scaleX: 1.05,
        skewX: 15,
        xPercent: 50,
        rotation: -10,
        autoAlpha: 0
      });
    }

    // Refresh ScrollTrigger after a small delay to ensure layout is complete
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

  }, { scope: container });

  return (
    <main ref={container} className="bg-[#f5e1e0] text-[#3d2b2b]">
      <header className="frame">
        <h2 className="frame__title">enxhithemuaa</h2>
        <div className="frame__subline type-tiny">
          <span>Make-up artist</span>
          <nav className="frame__links flex-line">
            <a href="#book">Book an Appointment</a>
            <a href="#studio">Our Studio</a>
          </nav>
        </div>
        <nav className="frame__tags flex-line type-tiny">
          <span>London Pro Makeup & Hair Artist | Bridal</span>
        </nav>
        <span className="frame__logo">EM</span>
      </header>

      <section className="content content--padded content--compact">
        <h4 className="type-tiny">Intro</h4>
        <p className="content__text">Immerse yourself in a visual experience that celebrates human beauty through enxhithemuaa's artistry.</p>
      </section>

      <section className="content content--full content--padded">
        <div className="grid grid--spaced" data-grid-first>
          {[...Array(17)].map((_, i) => (
            <div key={i} className={`grid__img pos-${i + 1}`} style={{ backgroundImage: `url(${getImg(i)})` }}></div>
          ))}
        </div>
        <div className="content__title">
          <h2 className="content__title-main">Elegance</h2>
          <p className="type-tiny right end">Captured in every moment</p>
        </div>
      </section>

      <section className="content content--padded content--compact">
        <h4 className="type-tiny">About</h4>
        <p className="content__text">Shadow and light blur the line between seen and felt. Soft, muted tones reveal the beauty hidden in plain sight—raw, intimate, and timeless.</p>
      </section>

      <section className="content content--padded">
        <div className="grid grid--columns grid--spaced" data-grid-second>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="grid__img" style={{ backgroundImage: `url(${getImg(i + 2)})` }}></div>
          ))}
          <div className="grid__item pos-6">
              <h4 className="type-tiny">Vision</h4>
              <p>Unveiling the unseen</p>
          </div>
          <div className="grid__item pos-7">
              <h4 className="type-tiny">Focus</h4>
              <p>Where color meets form</p>
          </div>
          <div className="grid__item pos-18">
              <h4 className="type-tiny">Essence</h4>
              <p>Moments in motion</p>
          </div>
        </div>
      </section>

      <section className="content content--padded content--compact">
        <h4 className="type-tiny">Journey</h4>
        <p className="content__text">From quiet city corners to London's hazy light—Enxhi captures the fleeting beauty of everyday life with an intimate, timeless touch.</p>
      </section>

      <section className="content content--padded content--full">
        <div className="grid grid--columns grid--spaced grid--single" data-grid-third>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="grid__img pos-2" style={{ backgroundImage: `url(${getImg(i + 4)})` }}></div>
          ))}
          <div className="grid__item acenter pos-1">
            <h4 className="type-tiny">Craft</h4>
            <p>Her craft reveals the quiet beauty in life's fleeting moments.</p>
          </div>
          <div className="grid__item acenter pos-4">
            <h4 className="type-tiny">Perspective</h4>
            <p>Her perspective finds depth in stillness, where the unseen speaks.</p>
          </div>
        </div>
      </section>

      <section className="content content--padded content--compact">
        <h4 className="type-tiny">Work Ethics</h4>
        <p className="content__text">Meticulous attention to detail and unwavering dedication. Every project pushes creative boundaries with discipline and passion.</p>
      </section>

      <section className="content content--padded content--full">
        <div className="grid grid--spaced grid--small" data-grid-fourth>
          {[...Array(36)].map((_, i) => (
            <div key={i} className="grid__img" style={{ backgroundImage: `url(${getImg(i)})` }}></div>
          ))}
        </div>
      </section>

      <section className="content content--full">
        <div className="grid grid--small" data-grid-fourth-v2>
          {[...Array(36)].map((_, i) => (
            <div key={i} className="grid__img" style={{ backgroundImage: `url(${getImg(i + 3)})` }}></div>
          ))}
        </div>
      </section>

      <section className="content content--padded content--compact">
        <h4 className="type-tiny">Inspiration</h4>
        <p className="content__text">Drawn to fleeting light, quiet moments, and the beauty found in imperfection and transience.</p>
      </section>

      <section className="content content--padded content--full">
        <div className="grid grid--spaced grid--wide" data-grid-fifth>
          {[...Array(20)].map((_, i) => (
            <div key={i} className="grid__img" style={{ backgroundImage: `url(${getImg(i + 1)})` }}></div>
          ))}
        </div>
        <div className="content__title">
          <h2 className="content__title-main">Explorations</h2>
          <p className="type-tiny right end">Nothing left unseen</p>
        </div>
      </section>

      <section className="content content--padded content--compact" id="studio">
        <h4 className="type-tiny">Our Studio</h4>
        <p className="content__text">Where stillness meets creativity. A space of patience, light, and quiet observation.</p>
      </section>

      <section className="content content--full content--cutoff">
        <div className="grid grid--spaced grid--zoomed" data-grid-sixth>
          {[...Array(9)].map((_, i) => (
            <div key={i} className="grid__img" style={{ backgroundImage: `url(${getStudioImg(i)})` }}></div>
          ))}
        </div>
        <div className="content__title">
          <h2 className="content__title-main">Sanctuary</h2>
          <p className="type-tiny right end">Where beauty begins</p>
        </div>
      </section>

      <section className="content content--padded content--compact">
        <h4 className="type-tiny">Collaborations</h4>
        <p className="content__text">Blending perspectives with fellow artists and designers to push creative boundaries.</p>
      </section>

      <section className="content content--full content--padded">
        <div className="grid grid--column" data-grid-seventh>
          <div className="grid__item span-3">
                <h4 className="type-tiny">Opalescent</h4>
                <p>Their hearts glow softly, bound by a love so pure.</p>
            </div>
          <div className="grid__img ar-rect span-2">
            <div className="grid__img-inner" style={{ backgroundImage: `url(${getImg(0)})` }}></div>
          </div>
          <div className="grid__img ar-wide">
            <div className="grid__img-inner" style={{ backgroundImage: `url(${getImg(1)})` }}></div>
          </div>
          <div className="grid__img ar-wide span-2">
            <div className="grid__img-inner" style={{ backgroundImage: `url(${getImg(2)})` }}></div>
          </div>
          <div className="grid__img span-2 ar-narrow">
            <div className="grid__img-inner" style={{ backgroundImage: `url(${getImg(3)})` }}></div>
          </div>
          <div className="grid__img ar-wide">
            <div className="grid__img-inner" style={{ backgroundImage: `url(${getImg(4)})` }}></div>
          </div>
          <div className="grid__img ar-wide span-2">
            <div className="grid__img-inner" style={{ backgroundImage: `url(${getImg(5)})` }}></div>
          </div>
          <div className="grid__img span-2 ar-narrow">
            <div className="grid__img-inner" style={{ backgroundImage: `url(${getImg(0)})` }}></div>
          </div>

          <div className="grid__item span-3">
            <h4 className="type-tiny">Softness</h4>
            <p>Blissful serenity embraces their world in gentle tones.</p>
          </div>
          <div className="grid__img span-2 ar-narrow">
            <div className="grid__img-inner" style={{ backgroundImage: `url(${getImg(1)})` }}></div>
          </div>
          <div className="grid__img ar-wide span-2">
            <div className="grid__img-inner" style={{ backgroundImage: `url(${getImg(2)})` }}></div>
          </div>
          <div className="grid__img ar-rect">
            <div className="grid__img-inner" style={{ backgroundImage: `url(${getImg(3)})` }}></div>
          </div>
          <div className="grid__img ar-wide span-2">
            <div className="grid__img-inner" style={{ backgroundImage: `url(${getImg(4)})` }}></div>
          </div>
          <div className="grid__img ar-narrow span-2">
            <div className="grid__img-inner" style={{ backgroundImage: `url(${getImg(5)})` }}></div>
          </div>
          <div className="grid__img ar-wide span-3">
            <div className="grid__img-inner" style={{ backgroundImage: `url(${getImg(0)})` }}></div>
          </div>
        </div>
      </section>

      <section className="content content--padded content--compact">
        <h4 className="type-tiny">Style</h4>
        <p className="content__text">Rooted in subtlety—muted tones, soft textures, and a timeless, understated aesthetic.</p>
      </section>

      <section className="content content--full">
        <div className="grid grid--tiny" data-grid-eighth>
          {[...Array(36)].map((_, i) => (
            <div key={i} className="grid__img" style={{ backgroundImage: `url(${getImg(i + 2)})` }}></div>
          ))}
        </div>
      </section>

      <section className="content content--padded content--compact">
        <h4 className="type-tiny">Future</h4>
        <p className="content__text">Exploring intimacy and impermanence through immersive, sensory experiences beyond the frame.</p>
      </section>

      <section className="content content--full">
        <div className="grid grid--columns" data-grid-ninth>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="grid__img" style={{ backgroundImage: `url(${getImg(i + 4)})` }}></div>
          ))}
        </div>
      </section>

      <section className="content content--padded" id="book">
        <h4 className="type-tiny">Book an Appointment</h4>
        <div className="mt-6 max-w-2xl">
          <form className="flex flex-col gap-2.5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest text-[#3d2b2b]/60">Name</label>
                <input
                  type="text"
                  className="w-full bg-white/40 border border-[#3d2b2b]/15 rounded-lg px-4 py-2.5 text-[#3d2b2b] focus:outline-none focus:border-[#8b5e5e] focus:ring-1 focus:ring-[#8b5e5e]/30 transition-all placeholder:text-[#3d2b2b]/30"
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest text-[#3d2b2b]/60">Email</label>
                <input
                  type="email"
                  className="w-full bg-white/40 border border-[#3d2b2b]/15 rounded-lg px-4 py-2.5 text-[#3d2b2b] focus:outline-none focus:border-[#8b5e5e] focus:ring-1 focus:ring-[#8b5e5e]/30 transition-all placeholder:text-[#3d2b2b]/30"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-widest text-[#3d2b2b]/60">Select a Service</label>
              <div className="flex flex-wrap gap-2">
                <input type="radio" name="service" id="bridal" value="bridal" className="service-radio" />
                <label htmlFor="bridal" className="service-label">Bridal Makeup</label>

                <input type="radio" name="service" id="event" value="event" className="service-radio" />
                <label htmlFor="event" className="service-label">Special Event</label>

                <input type="radio" name="service" id="editorial" value="editorial" className="service-radio" />
                <label htmlFor="editorial" className="service-label">Editorial / Fashion</label>

                <input type="radio" name="service" id="lesson" value="lesson" className="service-radio" />
                <label htmlFor="lesson" className="service-label">1-on-1 Lesson</label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest text-[#3d2b2b]/60">Date</label>
                <div className="date-picker-wrapper">
                  <input
                    type="date"
                    className="w-full bg-white/40 border border-[#3d2b2b]/15 rounded-lg px-4 py-2.5 text-[#3d2b2b] focus:outline-none focus:border-[#8b5e5e] focus:ring-1 focus:ring-[#8b5e5e]/30 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest text-[#3d2b2b]/60">Time</label>
                <div className="time-picker-wrapper">
                  <input
                    type="time"
                    className="w-full bg-white/40 border border-[#3d2b2b]/15 rounded-lg px-4 py-2.5 text-[#3d2b2b] focus:outline-none focus:border-[#8b5e5e] focus:ring-1 focus:ring-[#8b5e5e]/30 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest text-[#3d2b2b]/60">Message</label>
              <textarea
                rows={3}
                className="w-full bg-white/40 border border-[#3d2b2b]/15 rounded-lg px-4 py-2.5 text-[#3d2b2b] focus:outline-none focus:border-[#8b5e5e] focus:ring-1 focus:ring-[#8b5e5e]/30 transition-all resize-none placeholder:text-[#3d2b2b]/30"
                placeholder="Tell us about your vision or any special requests..."
              />
            </div>

            <button
              type="submit"
              className="mt-2 px-8 py-3 bg-[#3d2b2b] text-[#f5e1e0] rounded-lg text-sm uppercase tracking-widest hover:bg-[#8b5e5e] transition-colors duration-300"
            >
              Request Booking
            </button>
          </form>
        </div>
      </section>

      <footer className="page-footer type-tiny">
        <span>enxhithemuaa</span>
        <span>London Pro Makeup & Hair Artist</span>
        <a href="#book">Book an Appointment</a>
      </footer>
    </main>
  );
}
