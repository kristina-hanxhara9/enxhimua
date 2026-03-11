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
        filter: 'brightness(30%)'
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
    <main ref={container} className="bg-[#0a0a0a] text-[#f5f5f5]">
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
          <span>📍London Pro Makeup & Hair Artist | Bridal</span>
        </nav>
        <span className="frame__logo">EM</span>
      </header>

      <section className="content content--padded">
        <h4 className="type-tiny">Intro</h4>
        <p className="content__text">Welcome to enxhithemuaa's makeup artistry portfolio. In a world dominated by speed and constant motion, enxhithemuaa's artistry invites you to slow down and immerse yourself in a visual experience that touches human beauty.</p>
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

      <section className="content content--padded">
        <h4 className="type-tiny">About</h4>
        <p className="content__text">Her brush captures the quiet ache of reality, where shadow and light blur the line between seen and felt. Soft, muted tones breathe life into the ordinary, revealing the sensual curves and fragile textures hidden in plain sight. Each look lingers in the tension of what’s almost forgotten, where touch and absence coexist. There’s no rush, no spectacle—just the raw, intimate beauty of life unfolding in quiet moments. Light grazes skin, shadows hold secrets, and the world feels both distant and deeply near.</p>
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

      <section className="content content--padded">
        <h4 className="type-tiny">Journey</h4>
        <p className="content__text">Enxhi grew up attuned to the gentle interplay of light and shadow in the city’s quieter corners. Her eye was drawn to the unnoticed beauty in the mundane, the softness in the grit. She relocated to London, where the hazy sunlight, muted colors, and sprawling landscapes deepened her introspective approach to art. There, she found inspiration in the delicate moments between movement and stillness, capturing the fleeting, sensual beauty of everyday life in a way that feels both intimate and timeless.</p>
      </section>

      <section className="content content--padded content--full">
        <div className="grid grid--columns grid--spaced grid--single" data-grid-third>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="grid__img pos-2" style={{ backgroundImage: `url(${getImg(i + 4)})` }}></div>
          ))}
          <div className="grid__item acenter pos-1">
            <h4 className="type-tiny">Craft</h4>
            <p>Her craft reveals the quiet beauty in life’s fleeting moments.</p>
          </div>
          <div className="grid__item acenter pos-4">
            <h4 className="type-tiny">Perspective</h4>
            <p>Her perspective finds depth in stillness, where the unseen speaks.</p>
          </div>
        </div>
      </section>

      <section className="content content--padded">
        <h4 className="type-tiny">Work Ethics</h4>
        <p className="content__text">Driven by a strong sense of discipline and dedication, her work ethic reflects a deep commitment to both her craft and personal growth. With a relentless focus on innovation, she consistently seeks to push the boundaries of her creativity, drawing inspiration from the diverse environments that have shaped her artistic journey. Each project is approached with meticulous attention to detail, often requiring long hours and unwavering determination to achieve the desired result.</p>
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

      <section className="content content--padded">
        <h4 className="type-tiny">Inspiration</h4>
        <p className="content__text">Enxhi draws inspiration from the quiet, in-between moments of everyday life—the fleeting light at dawn, the subtle movement of shadows, the way stillness can carry untold stories. She’s moved by the fragility of human existence, finding beauty in imperfection and transience. Nature plays a role too, but not in grand landscapes—rather, in the soft, textured layers of light filtering through a window or the delicate detail of wind stirring leaves.</p>
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

      <section className="content content--padded" id="studio">
        <h4 className="type-tiny">Our Studio</h4>
        <p className="content__text">The creative process begins with stillness and observation, letting the moment speak before any action is taken. It’s about immersing in the environment, feeling the quiet shifts in light, texture, and mood. Rather than forcing a scene, there’s a deep patience—waiting for the right interplay of shadow or the soft touch of light on a surface.</p>
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

      <section className="content content--padded">
        <h4 className="type-tiny">Collaborations</h4>
        <p className="content__text">Known for her openness to new ideas and innovative approaches, Enxhi thrives on the energy that comes from working with fellow artists, designers, and creative professionals. By blending unique perspectives and exploring diverse techniques, collaborations with Enxhi result in work that pushes artistic boundaries and connects with a wider audience.</p>
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

      <section className="content content--padded">
        <h4 className="type-tiny">Style</h4>
        <p className="content__text">Her style is rooted in subtlety and restraint, capturing the delicate balance between light and shadow, presence and absence. She gravitates toward muted, natural tones that evoke a sense of quiet intimacy, favoring soft textures and a timeless, understated aesthetic. There’s a rawness in her work, yet it never feels harsh—rather, it reveals the fragility and beauty found in life’s simplest moments.</p>
      </section>

      <section className="content content--full">
        <div className="grid grid--tiny" data-grid-eighth>
          {[...Array(36)].map((_, i) => (
            <div key={i} className="grid__img" style={{ backgroundImage: `url(${getImg(i + 2)})` }}></div>
          ))}
        </div>
      </section>

      <section className="content content--padded">
        <h4 className="type-tiny">Future</h4>
        <p className="content__text">Looking ahead, Enxhi envisions her work diving deeper into the exploration of intimacy and impermanence. She’s drawn to the idea of capturing moments that feel almost invisible—those fleeting seconds between stillness and motion, light and shadow. In the future, she hopes to experiment more with multimedia projects, blending photography with film and sound to create immersive, sensory experiences that evoke emotion beyond the frame.</p>
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
        <div className="mt-12 max-w-2xl">
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-[#f5f5f5]/60">Name</label>
                <input 
                  type="text" 
                  className="w-full bg-transparent border-b border-[#f5f5f5]/20 pb-2 text-[#f5f5f5] focus:outline-none focus:border-[#f5f5f5] transition-colors rounded-none"
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-[#f5f5f5]/60">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-transparent border-b border-[#f5f5f5]/20 pb-2 text-[#f5f5f5] focus:outline-none focus:border-[#f5f5f5] transition-colors rounded-none"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-[#f5f5f5]/60">Service</label>
              <select className="w-full bg-transparent border-b border-[#f5f5f5]/20 pb-2 text-[#f5f5f5] focus:outline-none focus:border-[#f5f5f5] transition-colors appearance-none rounded-none">
                <option value="" className="bg-[#0a0a0a]">Select a service</option>
                <option value="bridal" className="bg-[#0a0a0a]">Bridal Makeup</option>
                <option value="event" className="bg-[#0a0a0a]">Special Event</option>
                <option value="editorial" className="bg-[#0a0a0a]">Editorial / Fashion</option>
                <option value="lesson" className="bg-[#0a0a0a]">1-on-1 Lesson</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-[#f5f5f5]/60">Date & Time</label>
              <input 
                type="datetime-local" 
                className="w-full bg-transparent border-b border-[#f5f5f5]/20 pb-2 text-[#f5f5f5] focus:outline-none focus:border-[#f5f5f5] transition-colors rounded-none [color-scheme:dark]"
              />
            </div>

            <button 
              type="submit"
              className="mt-8 px-8 py-4 border border-[#f5f5f5]/20 text-sm uppercase tracking-widest hover:bg-[#f5f5f5] hover:text-[#0a0a0a] transition-colors duration-300"
            >
              Request Booking
            </button>
          </form>
        </div>
      </section>

      <footer className="page-footer type-tiny">
        <span>Created for enxhithemuaa</span>
        <span>Based on Codrops Demo</span>
        <a href="#book">Book an Appointment</a>
      </footer>
    </main>
  );
}
