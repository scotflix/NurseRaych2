import { useState, useEffect, useRef } from "react";
import { ChevronRight, ChevronLeft, Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "Master’s Student in Nurse Anesthesia, driving the mission to provide free surgical and anesthesia services to underserved communities.",
    author: "Rachel ",
    role: "Founder & Visionary Leader",
    avatar: `${import.meta.env.BASE_URL}images/image1.jpeg`,
  },
  {
    quote:
      "Computer Science major and lead developer of the organization’s digital platforms, ensuring our mission reaches and impacts more people.",
    author: "Bradley Ongus",
    role: "Technology & Operations Strategist",
    avatar: `${import.meta.env.BASE_URL}images/image8.jpeg`,
  },
  {
    quote:
      "Assistant Nurse and Community Health Officer, dedicated to connecting the organization’s mission with the needs of the people we serve.",
    author: "Josephine Akinyi",
    role: "Community Health Advocate",
    avatar: `${import.meta.env.BASE_URL}images/image9.png`,
  },
];

export default function Testimonials() {
  const DURATION = 900;
  const AUTOPLAY = 5000;

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [visible, setVisible] = useState<number[]>(isMobile ? [0] : [0, 1]);
  const [slides, setSlides] = useState<number[]>(
    isMobile ? [0, 1] : [0, 1, 2]
  );
  const [positions, setPositions] = useState<number[]>(
    isMobile ? [0, 100] : [0, 50, 100]
  );
  const [disableTransition, setDisableTransition] = useState(false);

  const isAnimatingRef = useRef(false);
  const visibleRef = useRef(visible);

  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  useEffect(() => {
    if (isMobile) {
      const next = (visible[0] + 1) % testimonials.length;
      setSlides([visible[0], next]);
    } else {
      const third = (visible[1] + 1) % testimonials.length;
      setSlides([visible[0], visible[1], third]);
    }
  }, [isMobile]);

  const slideNextRef = useRef<() => void>(() => {});
  const slidePrevRef = useRef<() => void>(() => {});

  useEffect(() => {
    slideNextRef.current = slideNext;
    slidePrevRef.current = slidePrev;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (slideNextRef.current) slideNextRef.current();
    }, AUTOPLAY);
    return () => clearInterval(interval);
  }, []);

  function slideNext() {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const curVisible = visibleRef.current;
    if (isMobile) {
      const nextIndex = (curVisible[0] + 1) % testimonials.length;
      setSlides([curVisible[0], nextIndex]);
      setDisableTransition(false);
      requestAnimationFrame(() => setPositions([-100, 0]));

      setTimeout(() => {
        setVisible([nextIndex]);
        const afterNext = (nextIndex + 1) % testimonials.length;
        setSlides([nextIndex, afterNext]);
        setDisableTransition(true);
        setPositions([0, 100]);

        setTimeout(() => {
          setDisableTransition(false);
          isAnimatingRef.current = false;
        }, 20);
      }, DURATION);
    } else {
      const nextIndex = (curVisible[1] + 1) % testimonials.length;
      const nextNext = (nextIndex + 1) % testimonials.length;

      setSlides([curVisible[0], curVisible[1], nextIndex]);
      setDisableTransition(false);
      requestAnimationFrame(() => setPositions([-50, 0, 50]));

      setTimeout(() => {
        const newVisible = [curVisible[1], nextIndex];
        setVisible(newVisible);
        setSlides([newVisible[0], newVisible[1], nextNext]);
        setDisableTransition(true);
        setPositions([0, 50, 100]);

        setTimeout(() => {
          setDisableTransition(false);
          isAnimatingRef.current = false;
        }, 20);
      }, DURATION);
    }
  }

  function slidePrev() {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const curVisible = visibleRef.current;
    if (isMobile) {
      const prevIndex =
        (curVisible[0] - 1 + testimonials.length) % testimonials.length;
      setDisableTransition(true);
      setSlides([prevIndex, curVisible[0]]);
      setPositions([-100, 0]);

      requestAnimationFrame(() => {
        setDisableTransition(false);
        setPositions([0, 100]);
      });

      setTimeout(() => {
        setVisible([prevIndex]);
        const afterPrev = (prevIndex + 1) % testimonials.length;
        setSlides([prevIndex, afterPrev]);
        setDisableTransition(true);
        setPositions([0, 100]);
        setTimeout(() => {
          setDisableTransition(false);
          isAnimatingRef.current = false;
        }, 20);
      }, DURATION);
    } else {
      const prevIndex =
        (curVisible[0] - 1 + testimonials.length) % testimonials.length;
      const nextThird = (curVisible[0] + 1) % testimonials.length;

      setDisableTransition(true);
      setSlides([prevIndex, curVisible[0], curVisible[1]]);
      setPositions([-50, 0, 50]);

      requestAnimationFrame(() => {
        setDisableTransition(false);
        setPositions([0, 50, 100]);
      });

      setTimeout(() => {
        const newVisible = [prevIndex, curVisible[0]];
        setVisible(newVisible);
        setSlides([newVisible[0], newVisible[1], nextThird]);
        setDisableTransition(true);
        setPositions([0, 50, 100]);
        setTimeout(() => {
          setDisableTransition(false);
          isAnimatingRef.current = false;
        }, 20);
      }, DURATION);
    }
  }

  function SlideCard({ idx }: { idx: number }) {
    const t = testimonials[idx];
    return (
      <div className="p-3 flex flex-col items-center">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 flex flex-col items-center text-center gap-4">
          <div className="w-80 h-80 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-cyan-400 p-1 shadow-2xl">
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-800 border-4 border-white/20">
              <img
                src={t.avatar}
                alt={t.author}
                className="w-full h-full   object-center "
              />
            </div>
          </div>
          <div className="max-w-lg">
            <Quote className="w-6 h-6 text-purple-400 mb-2 mx-auto" />
            <blockquote className="text-white/80 text-sm leading-relaxed italic mb-3 break-words">
              “{t.quote}”
            </blockquote>
            <div>
              <cite className="text-cyan-300 font-semibold block">
                {t.author}
              </cite>
              <p className="text-white/70 text-xs">{t.role}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function slideStyle(i: number): React.CSSProperties {
    const left = positions[i];
    const transitionStyle = disableTransition
      ? "none"
      : `left ${DURATION}ms ease`;
    return {
      left: `${left}%`,
      transition: transitionStyle,
      width: isMobile ? "100%" : "50%",
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      boxSizing: "border-box",
      padding: "0.5rem",
    };
  }

  return (
    <div className="mb-16">
      <h3 className="text-3xl font-bold text-white text-center mb-8">
        PIONEERS
      </h3>
      <div className="relative max-w-4xl mx-auto">
        <button
          onClick={slidePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={slideNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <div
          className="relative overflow-hidden flex items-center"
          style={{ minHeight: "500px" }}
        >
          {slides.map((slideIdx, i) => (
            <div key={i} style={slideStyle(i)}>
              <SlideCard idx={slideIdx} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
