"use client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

/* ===== data ตัวอย่าง ===== */
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

/* ===== เดสก์ท็อปแบบกว้าง: แค่กว้างพอ และไม่ reduce motion ===== */
function useIsDesktopWide() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const mqWidth = window.matchMedia("(min-width: 1024px)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setOk(mqWidth.matches && !mqReduce.matches);
    update();
    const on = (mql: MediaQueryList) => {
      try { mql.addEventListener("change", update); }
      catch { mql.addListener(update); }
    };
    const off = (mql: MediaQueryList) => {
      try { mql.removeEventListener("change", update); }
      catch { mql.removeListener(update); }
    };
    [mqWidth, mqReduce].forEach(on);
    return () => [mqWidth, mqReduce].forEach(off);
  }, []);
  return ok;
}

export default function CustomCarousel() {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const isDesktop = useIsDesktopWide();
  const [hovered, setHovered] = useState(false);
  const autoplayMs = 4000;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<number | null>(null);

  /* ===== helper: start/stop ===== */
  const stop = () => {
    if (intervalRef.current != null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  const start = () => {
    if (!api || !isDesktop) return;
    if (intervalRef.current != null) return;
    intervalRef.current = window.setInterval(() => {
      if (document.hidden) return;
      if (hovered) return;
      api.scrollNext();
    }, autoplayMs);
  };

  /* ===== sync embla ===== */
  useEffect(() => {
    if (!api) return;
    const setAll = () => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap());
    };
    setAll();
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("reInit", setAll);
    api.on("select", onSelect);
    return () => {
      api.off?.("reInit", setAll);
      api.off?.("select", onSelect);
    };
  }, [api]);

  /* ===== hover pause ===== */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onEnter = () => setHovered(true);
    const onLeave = () => setHovered(false);
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  /* ===== lifecycle autoplay ===== */
  useEffect(() => {
    if (!api || !isDesktop) { stop(); return; }
    start();

    const onPointerDown = () => stop();
    const onPointerUp = () => start();
    const onVisibility = () => (document.hidden ? stop() : start());

    api.on("pointerDown", onPointerDown);
    api.on("pointerUp", onPointerUp);
    api.on("settle", onPointerUp); // กันบางเคส pointerUp ไม่ยิง
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      api.off?.("pointerDown", onPointerDown);
      api.off?.("pointerUp", onPointerUp);
      api.off?.("settle", onPointerUp);
      document.removeEventListener("visibilitychange", onVisibility);
      stop();
    };
  }, [api, isDesktop, hovered, autoplayMs]);

  const dots = useMemo(() => Array.from({ length: count }), [count]);

  return (
    <div ref={rootRef} className="h-full flex flex-col gap-3 font-thai select-none">
      <Carousel opts={{ loop: true }} setApi={setApi} className="h-full [&>div]:h-full">
        <CarouselContent className="h-full">
          {mockCarouselData.map((item, i) => (
            <CarouselItem key={i} className="h-full">
              <div className="space-y-6 flex flex-1 flex-col">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={0}
                  height={0}
                  className="h-auto object-contain w-full max-w-xl mx-auto block"
                  priority={i === 0}
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
        {dots.map((_, i) => (
          <button
            key={i}
            onClick={() => { api?.scrollTo(i); stop(); start(); }}
            className={`w-3 h-3 rounded-full transition-opacity ${i === current ? "bg-white" : "bg-white/50"}`}
            aria-label={`ไปสไลด์ที่ ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}