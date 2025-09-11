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
    <div
      className={cn(
        "relative w-screen h-screen overflow-hidden flex items-center justify-center gap-6",
      )}
    >
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
              step >= 4 &&
                "flex-col items-start min-w-lg max-h-[685px] min-h-[600px] ",
              step == 6 && "static",
            )}
          >
            {/* Logo */}
            <motion.div layout transition={{ duration: 0.6, type: "tween" }}>
              <Image
                src={"/logo/logo.svg"}
                width={117}
                height={32}
                alt="Logo"
              />
            </motion.div>

            {/* Carousel */}
            {step >= 4 && (
              <motion.div
                key="CarouselContent"
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{
                  duration: 0.6,
                  ease: cubicBezier(0.42, 0, 0.58, 1),
                }}
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
              step == 6 && "static max-w-1/5 gap-4",
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
  const containerVariants = {
    step1: { width: "100%", height: "100%", scale: 2, "--r": "0px" },
    step2: { width: "auto", height: "auto", scale: 1, "--r": "16px" },
    step3: { width: "auto", height: "auto", scale: 1, "--r": "16px" },
    step4: { width: "90%", height: "auto", scale: 1, y: -12, "--r": "16px" },
    step6: {
      width: "90%",
      height: "auto",
      scale: 1,
      y: [-12, -4, 0] as number[],
      "--r": "16px",
      transition: { duration: 0.55, ease: cubicBezier(0.2, 0.8, 0.2, 1) },
    },
  } as const;

  const groupVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        delay: 0.08,
        staggerChildren: 0.06,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: cubicBezier(0.2, 0.8, 0.2, 1) },
    },
  } as const;

  /** ---------- FIX FLICKER ---------- */
  const [showWhiteLogo, setShowWhiteLogo] = useState(true);
  const phaseRef = useRef<"orange" | "white">("orange");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const nextPhase: "orange" | "white" = step < 3 ? "orange" : "white";
    if (phaseRef.current === nextPhase) return;
    phaseRef.current = nextPhase;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (nextPhase === "orange") {
      setShowWhiteLogo(true);
    } else {
      setShowWhiteLogo(true);
      timerRef.current = window.setTimeout(() => setShowWhiteLogo(false), 220);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [step]);
  /** -------------------------------- */

  // โลโก้ crossfade — คงอยู่ทั้งสองรูป, ไม่ re-mount, ปิดการ transform ที่ layer รูป
  const CrossfadeLogo = ({ showWhite }: { showWhite: boolean }) => {
    const duration = 0.35;
    const ease = cubicBezier(0.42, 0, 0.58, 1);
    const delayColorIn = 0.18;
    const size = 44;

    const layerStyle: React.CSSProperties = {
      // iOS/Safari opacity/transform glitch mitigation
      WebkitBackfaceVisibility: "hidden",
      backfaceVisibility: "hidden",
      willChange: "opacity",
      transform: "translateZ(0)",
    };

    const whiteVariants = {
      visible: { opacity: 1, transition: { duration, ease, delay: 0 } },
      hidden: { opacity: 0, transition: { duration, ease, delay: 0 } },
    } as const;

    const colorVariants = {
      visible: {
        opacity: 1,
        transition: { duration, ease, delay: delayColorIn },
      },
      hidden: { opacity: 0, transition: { duration, ease, delay: 0 } },
    } as const;

    return (
      <div
        className="relative"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        {/* WHITE */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={layerStyle}
          initial={false}
          variants={whiteVariants}
          animate={showWhite ? "visible" : "hidden"}
        >
          <Image
            src={"/logo/logo-no-text-white.svg"}
            width={size}
            height={size}
            alt="White Logo"
            draggable={false}
            priority
          />
        </motion.div>

        {/* COLOR */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={layerStyle}
          initial={false}
          variants={colorVariants}
          animate={showWhite ? "hidden" : "visible"}
        >
          <Image
            src={"/logo/logo-no-text.svg"}
            width={size}
            height={size}
            alt="Color Logo"
            draggable={false}
            priority
          />
        </motion.div>
      </div>
    );
  };

  return (
    <div
      className={cn(
        "relative w-screen h-screen overflow-hidden flex items-center justify-center gap-6",
      )}
    >
      <motion.div
        key="MobileLoginContainer"
        layout="position"
        variants={containerVariants}
        initial="step1"
        animate={`step${step}`}
        transition={{ layout: { duration: 0 } }}
        style={{ transformOrigin: "50% 50%", borderRadius: "var(--r)" }}
        className={cn(
          // เพิ่ม transition-colors ให้พื้นหลังเปลี่ยนเนียน ไม่กระตุกไปชนกับ crossfade
          "absolute flex items-center drop-shadow-xl border z-10 min-h-fit justify-center overflow-hidden will-change-transform transition-colors duration-300",
          step < 3 ? "bg-primary" : "bg-white",
          step >= 6 && "flex p-6 flex-col gap-3",
        )}
      >
        {/* ห่อโลโก้ด้วย div ที่ "ไม่มี transform" ลดโอกาส glitch บน iOS */}
        <div className={step < 6 ? "m-6" : "m-0"}>
          <CrossfadeLogo showWhite={showWhiteLogo} />
        </div>

        {step >= 6 && (
          <motion.div
            key="LoginGroup"
            variants={groupVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center text-center w-full h-full"
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
    { action: () => setStep(2), delay: 0 },
    { action: () => setStep(3) },
    { action: () => setStep(4) },
    { action: () => setStep(6) },
  ];

  const mobileSequence = [
    { action: () => setStep(2), delay: 0 },
    { action: () => setStep(3) },
    { action: () => setStep(4) },
    { action: () => setStep(6) },
  ];

  const sequence = isMobile ? mobileSequence : desktopSequence;

  useEffect(() => {
    let prevTime = 0;
    const timers = sequence.map(({ action, delay = 0 }) => {
      const delayDuration = prevTime + (delay || DEFAULT_TRANSITION_DURATION);
      prevTime = delayDuration;
      return setTimeout(action, delayDuration);
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
      {/* DEV-NOTE: Open this for debugging each step */}
      {/* <div className="absolute bottom-5 right-5 flex gap-2 z-50 bg-black/50 p-2"> <button onClick={prevStep} className="bg-white text-black px-4 py-2 rounded-lg disabled:bg-white/20" disabled={step === 1} > Prev </button> <span className="text-white text-2xl text-bold">{step}</span> <button onClick={nextStep} className="bg-white text-black px-4 py-2 rounded-lg disabled:bg-white/20" > Next </button> </div> */}
    </>
  );
}
