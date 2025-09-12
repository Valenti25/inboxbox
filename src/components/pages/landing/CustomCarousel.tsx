import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

const mockCarouselData = [
  {
    title: "Detail Feature #1",
    image: "/images/login-carousel-1.svg",
    description:
      "(1) ให้คุณจัดการทุกการสนทนาจาก LINE, Facebook, Instagram, WhatsApp ในแอปเดียว",
  },
  {
    title: "Detail Feature #2",
    image: "/images/login-carousel-1.svg",
    description:
      "(2) ให้คุณจัดการทุกการสนทนาจาก LINE, Facebook, Instagram, WhatsApp ในแอปเดียว",
  },
  {
    title: "Detail Feature #3",
    image: "/images/login-carousel-1.svg",
    description:
      "(3) ให้คุณจัดการทุกการสนทนาจาก LINE, Facebook, Instagram, WhatsApp ในแอปเดียว",
  },
];

function useIsDesktopAutoplay() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // PC: หน้ากว้างอย่างน้อย 1024px และมี pointer แบบเมาส์
    const mql = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const update = () => setIsDesktop(mql.matches);
    update();
    // Safari เก่าบางรุ่นไม่มี addEventListener บน MediaQueryList
    try {
      mql.addEventListener("change", update);
      return () => mql.removeEventListener("change", update);
    } catch {
      mql.addListener(update);
      return () => mql.removeListener(update);
    }
  }, []);

  return isDesktop;
}

function CustomCarousel() {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideCount, setSlideCount] = useState(0);

  // ==== ตั้งค่า autoplay เฉพาะเดสก์ท็อป ====
  const isDesktop = useIsDesktopAutoplay();
  const [isHovered, setIsHovered] = useState(false);
  const autoplayMs = 4000; // ปรับความเร็ว
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!api) return;
    setSlideCount(api.scrollSnapList().length);
    setCurrentSlide(api.selectedScrollSnap());

    const onSelect = () => setCurrentSlide(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      if (api.off) api.off("select", onSelect);
    };
  }, [api]);

  // Hover pause (เดสก์ท็อปเท่านั้น)
  useEffect(() => {
    if (!rootRef.current) return;
    const el = rootRef.current;
    const onEnter = () => setIsHovered(true);
    const onLeave = () => setIsHovered(false);
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Autoplay loop: เดสก์ท็อป & มี api & ไม่ hover & แท็บโฟกัส
  useEffect(() => {
    if (!api || !isDesktop) return;

    let id: number | null = null;

    const tick = () => {
      if (document.hidden) return; // หยุดตอนแท็บไม่โฟกัส
      if (isHovered) return;       // หยุดตอน hover
      // เลื่อนไปสไลด์ถัดไป
      api.scrollNext();
    };

    id = window.setInterval(tick, autoplayMs);

    // ถ้าผู้ใช้ลาก/คลิกเลื่อนด้วยตัวเอง ให้หยุด autoplay รอบนั้น
    const stopOnce = () => {
      if (id) {
        clearInterval(id);
        id = null;
      }
    };
    api.on("pointerDown", stopOnce);
    api.on("scroll", () => {}); // no-op แค่แน่ใจว่า api active

    // Pause/Resume เมื่อ visibility เปลี่ยน
    const onVis = () => {
      if (document.hidden && id) {
        clearInterval(id);
        id = null;
      } else if (!document.hidden && !id && !isHovered) {
        id = window.setInterval(tick, autoplayMs);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      if (id) clearInterval(id);
      if (api.off) api.off("pointerDown", stopOnce);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [api, isDesktop, isHovered, autoplayMs]);

  // ปุ่มจุด (ดอท)
  const dots = useMemo(() => Array.from({ length: slideCount }), [slideCount]);

  return (
    <div
      ref={rootRef}
      className="h-full flex flex-col gap-3 font-thai select-none"
    >
      <Carousel opts={{ loop: true }} setApi={setApi} className="h-full [&>div]:h-full">
        <CarouselContent className="h-full">
          {mockCarouselData.map((item, index) => (
            <CarouselItem key={index} className="h-full">
              <div className="space-y-6 flex flex-1 flex-col">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={0}
                  height={0}
                  className="h-auto object-contain w-full max-w-xl mx-auto block"
                  priority={index === 0}
                  draggable={false}
                />
                <div className="text-white space-y-2 text-left">
                  <Label className="text-3xl font-semibold">{item.title}</Label>
                  <Label className="text-sm">{item.description}</Label>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="flex gap-2 mt-3">
        {dots.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`w-3 h-3 rounded-full transition-opacity ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default CustomCarousel;
