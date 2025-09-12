"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence, cubicBezier } from "motion/react";
import { cn } from "@/lib/utils";
import z from "zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import CustomCarousel from "@/components/pages/landing/CustomCarousel";
import LoginForm, {
  formSchema,
  FormValues as LoginFormValues,
} from "@/components/pages/landing/LoginForm";
import { useIsMobile } from "@/hooks/use-mobile";
import type React from "react";

/* ===== Type helpers: CSS Vars (แก้ปัญหา no-explicit-any) ===== */
type CSSVars<T extends string> = React.CSSProperties & Record<T, string | number>;
type StyleWithMbr = CSSVars<"--mbr">;

interface ComponentProps {
  step: number;
  form: UseFormReturn<LoginFormValues>;
  onSubmit: (values: LoginFormValues) => void;
}

/* ========================= Desktop ========================= */

function DesktopLanding({ step, form, onSubmit }: ComponentProps) {
  const refA = useRef<HTMLDivElement | null>(null);
  const [aHeight, setAHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = refA.current;
    if (!el) return;

    const measure = () => {
      const h = el.getBoundingClientRect().height;
      if (h && h > 0) setAHeight(Math.round(h));
    };

    measure();
    const raf1 = requestAnimationFrame(measure);
    const raf2 = requestAnimationFrame(measure);

    const ro = new ResizeObserver(measure);
    ro.observe(el);

    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [step]);

  const carouselContanierVariants = {
    step1: {
      width: "100%",
      height: "100%",
      borderRadius: 0,
      transition: { stiffness: 30, duration: 1 },
    },
    step2: {
      width: "50%",
      height: "auto",
      borderRadius: "24px",
      transition: { stiffness: 75, duration: 0.5 },
    },
    step3: {
      width: "50%",
      height: "auto",
      borderRadius: "24px",
      transition: { type: "tween", stiffness: 100, damping: 15 },
    },
    step4: {
      width: "50%",
      height: "auto",
      borderRadius: "24px",
      transition: { type: "tween", stiffness: 100, damping: 15 },
    },
    step6: {
      width: "50%",
      height: "auto",
      borderRadius: "24px",
      transition: { stiffness: 50, duration: 0.5 },
    },
  } as const;

  const loginContainerVariants = {
    hidden: { opacity: 0, scale: 1, x: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: cubicBezier(0.42, 0, 0.58, 1) },
    },
    exit: { opacity: 0, x: 0, transition: { duration: 0.6 } },
  } as const;

  return (
    <div className={cn("relative w-screen h-screen overflow-hidden flex items-center justify-center gap-6")}>
      <AnimatePresence mode="sync">
        {/* === Carousel Container === */}
        {step >= 1 && (
          <motion.div
            key="CarouselContainer"
            layout
            ref={refA}
            variants={carouselContanierVariants}
            initial="step1"
            animate={`step${step}` as keyof typeof carouselContanierVariants}
            exit="exit"
            transition={{ duration: 0.6, stiffness: 75 }}
            className={cn(
              "absolute flex items-center bg-[#F24822] drop-shadow-xl z-10 min-h-32 justify-center overflow-hidden",
              step >= 2,
              step >= 3 && "justify-start p-8",
              step >= 4 && "flex-col items-start min-w-lg max-h-[685px] min-h-[600px]",
              step === 6 && "static",
            )}
          >
            {/* Logo */}
            <motion.div layout transition={{ duration: 0.6, type: "tween" }}>
              <Image src={"/logo/logo.svg"} width={117} height={32} alt="Logo" />
            </motion.div>

            {/* Carousel */}
            {step >= 4 && (
              <motion.div
                key="CarouselContent"
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.6, ease: cubicBezier(0.42, 0, 0.58, 1) }}
                className="flex flex-col items-center text-center gap-4 w-full"
              >
                <CustomCarousel />
              </motion.div>
            )}
          </motion.div>
        )}

        {/* === Login container === */}
        {step >= 6 && (aHeight ?? 0) > 0 && (
          <motion.div
            key="LoginContainer"
            layout
            variants={loginContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ height: aHeight ?? undefined }}
            transition={{ duration: 0.6, ease: cubicBezier(0.42, 0, 0.58, 1) }}
            className={cn(
              "absolute min-w-md flex items-center z-0 bg-white rounded-3xl p-8 drop-shadow-xl border flex-col",
              step === 6 && "static max-w-1/5 gap-4",
            )}
          >
            <Image
              src={"/logo/logo-no-text.svg"}
              width={64}
              height={64}
              alt="Color Logo"
              className="mr-auto"
            />
            <LoginForm form={form} onSubmit={onSubmit} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ========================= Mobile ========================= */

function MobileLanding({ step, form, onSubmit }: ComponentProps) {
  // ---- ค่าคงที่ ----
  const BR = 16;                 // รัศมีมุม (px) เดียวกันทุก step หลัง 2
  const BG_IN_DELAY = 180;       // ดีเลย์ก่อนสลับพื้นหลังเป็นขาว (ms) เพื่อให้มุม “ล็อก” ก่อน

  // 1) จังหวะ scale/position ของกล่อง (ยังใช้ motion จัด layout)
  const containerVariants = {
    step1: {
      width: "100%",
      height: "100%",
      scale: 2,
      borderRadius: "0",
      transition: { duration: 0.55, ease: cubicBezier(0.2, 0.8, 0.2, 1) },
    },
    step2: {
      width: "auto",
      height: "auto",
      scale: 1,
      borderRadius: `${BR}px`,
      transition: { delay: 0.18, duration: 0.55, ease: cubicBezier(0.2, 0.8, 0.2, 1) },
    },
    step3: {
      width: "auto",
      height: "auto",
      scale: 1,
      borderRadius: `${BR}px`,
      transition: { delay: 0.22, duration: 0.55, ease: cubicBezier(0.2, 0.8, 0.2, 1) },
    },
    step4: {
      width: "90%",
      height: "auto",
      scale: 1,
      y: -12,
      borderRadius: `${BR}px`,
      transition: { delay: 0.18, duration: 0.55, ease: cubicBezier(0.2, 0.8, 0.2, 1) },
    },
    step6: {
      width: "90%",
      height: "auto",
      scale: 1,
      y: [-12, -4, 0] as number[],
      borderRadius: `${BR}px`,
      transition: {
        delay: 0.12,
        duration: 0.55,
        ease: cubicBezier(0.2, 0.8, 0.2, 1),
      },
    },
  } as const;

  const groupVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        delay: 0.22,
        staggerChildren: 0.08,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.48, ease: cubicBezier(0.2, 0.8, 0.2, 1) },
    },
  } as const;

  /** ---------- พื้นหลังแบบ “ล็อกมุมก่อน ค่อยเปลี่ยนสี” ---------- */
  const [bgPhase, setBgPhase] = useState<"orange" | "white">("orange");
  const phaseRef = useRef<"orange" | "white">("orange");
  const delayRef = useRef<number | null>(null);

  useEffect(() => {
    const want: "orange" | "white" = step < 3 ? "orange" : "white";
    if (phaseRef.current === want) return;
    phaseRef.current = want;

    if (delayRef.current) {
      clearTimeout(delayRef.current);
      delayRef.current = null;
    }

    if (want === "white") {
      delayRef.current = window.setTimeout(() => setBgPhase("white"), BG_IN_DELAY);
    } else {
      setBgPhase("orange");
    }

    return () => {
      if (delayRef.current) {
        clearTimeout(delayRef.current);
        delayRef.current = null;
      }
    };
  }, [step]);

  /** ---------- FIX FLICKER โลโก้: crossfade sync กับ bg ---------- */
  const [showWhiteLogo, setShowWhiteLogo] = useState(true);
  const logoTimer = useRef<number | null>(null);
  useEffect(() => {
    if (logoTimer.current) {
      clearTimeout(logoTimer.current);
      logoTimer.current = null;
    }
    if (phaseRef.current === "white") {
      setShowWhiteLogo(true);
      logoTimer.current = window.setTimeout(() => setShowWhiteLogo(false), BG_IN_DELAY);
    } else {
      setShowWhiteLogo(true);
    }
    return () => {
      if (logoTimer.current) {
        clearTimeout(logoTimer.current);
        logoTimer.current = null;
      }
    };
  }, [bgPhase]);

  // โลโก้ crossfade ที่ sync กับพื้นหลัง
  const CrossfadeLogo = ({ showWhite }: { showWhite: boolean }) => {
    const duration = 0.35;
    const size = 44;
    const layerStyle: React.CSSProperties = {
      WebkitBackfaceVisibility: "hidden",
      backfaceVisibility: "hidden",
      willChange: "opacity",
      transform: "translateZ(0)",
    };
    return (
      <div className="relative" style={{ width: size, height: size }} aria-hidden="true">
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={layerStyle}
          initial={false}
          animate={{ opacity: showWhite ? 1 : 0 }}
          transition={{ duration }}
        >
          <Image
            src={"/logo/logo-no-text-white.svg"}
            width={size}
            height={size}
            alt="White Logo"
            priority
            draggable={false}
          />
        </motion.div>
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={layerStyle}
          initial={false}
          animate={{ opacity: showWhite ? 0 : 1 }}
          transition={{ duration }}
        >
          <Image
            src={"/logo/logo-no-text.svg"}
            width={size}
            height={size}
            alt="Color Logo"
            priority
            draggable={false}
          />
        </motion.div>
      </div>
    );
  };

  // ------ style ของ wrapper ที่มี CSS var "--mbr" แบบ typed ------
  const wrapperStyle: StyleWithMbr = {
    transformOrigin: "50% 50%",
    transitionProperty: "background-color, border-radius, box-shadow",
    transitionDuration: "500ms",
    transitionTimingFunction: "ease-in-out",
    "--mbr": step >= 2 ? `${BR}px` : "0px",
    borderRadius: "var(--mbr)",
  };

  return (
    <div className={cn("relative w-screen h-screen overflow-hidden flex items-center justify-center gap-6")}>
      <motion.div
        key="MobileLoginContainer"
        layout="position"
        variants={containerVariants}
        initial="step1"
        animate={`step${step}` as keyof typeof containerVariants}
        transition={{ layout: { duration: 0 } }}
        style={wrapperStyle}
        className={cn(
          "absolute flex items-center drop-shadow-xl border z-10 min-h-fit justify-center overflow-hidden",
          "bg-transparent",
          step >= 6 && "flex p-6 flex-col gap-3",
        )}
      >
        {/* ชั้นพื้นหลังจริง แยกเป็น layer เพื่อดีเลย์เปลี่ยนสี แต่ใช้มุมเดียวกับ wrapper เสมอ */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: "var(--mbr)",
            backgroundColor: bgPhase === "white" ? "#ffffff" : "var(--color-primary, #F24822)",
            transition: `background-color 500ms ease-in-out, border-radius 500ms ease-in-out, box-shadow 500ms ease-in-out`,
          }}
        />

        {/* โลโก้ */}
        <div className={step < 6 ? "m-6" : "m-0"} style={{ position: "relative", zIndex: 1 }}>
          <CrossfadeLogo showWhite={showWhiteLogo} />
        </div>

        {step >= 6 && (
          <motion.div
            key="LoginGroup"
            variants={groupVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center text-center w-full h-full"
            style={{ position: "relative", zIndex: 1 }}
          >
            <motion.div variants={itemVariants}>
              <LoginForm form={form} onSubmit={onSubmit} hideForm={false} />
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

/* ========================= Root ========================= */

export default function LandingAnimation() {
  const [step, setStep] = useState(0);
  const isMobile = useIsMobile();
  const ready = isMobile !== undefined;

  useEffect(() => {
    if (ready) setStep(1);
  }, [ready]);

  const DEFAULT_TRANSITION_DURATION = isMobile ? 500 : 600;

  const desktopSequence = [
    { action: () => setStep(2) },
    { action: () => setStep(3) },
    { action: () => setStep(4) },
    { action: () => setStep(6) },
  ];

  const mobileSequence = [
    { action: () => setStep(2) },
    { action: () => setStep(3) },
    { action: () => setStep(4) },
    { action: () => setStep(6) },
  ];

  const sequence = isMobile ? mobileSequence : desktopSequence;

  useEffect(() => {
    let prevTime = 0;
    const timers = sequence.map(({ action }) => {
      const delayDuration = prevTime + DEFAULT_TRANSITION_DURATION;
      prevTime = delayDuration;
      return window.setTimeout(action, delayDuration);
    });
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "test@example.com", password: "1234" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <>
      {isMobile ? (
        <MobileLanding step={step} form={form} onSubmit={onSubmit} />
      ) : (
        <DesktopLanding step={step} form={form} onSubmit={onSubmit} />
      )}
      {/* DEBUG STEPPER
      <div className="absolute bottom-5 right-5 flex gap-2 z-50 bg-black/50 p-2 rounded">
        <button
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          className="bg-white text-black px-4 py-2 rounded-lg disabled:bg-white/20"
          disabled={step <= 1}
        >
          Prev
        </button>
        <span className="text-white text-2xl font-bold">{step}</span>
        <button
          onClick={() => setStep((s) => Math.min(6, s + 1))}
          className="bg-white text-black px-4 py-2 rounded-lg disabled:bg-white/20"
          disabled={step >= 6}
        >
          Next
        </button>
      </div>
      */}
    </>
  );
}
