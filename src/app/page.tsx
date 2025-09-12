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

/* ===== Type helpers ===== */
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
    <div
      className={cn(
        "relative w-screen h-screen overflow-hidden flex items-center mx-auto text-center justify-center gap-6",
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
              "absolute flex items-center bg-[#F24822]  drop-shadow-xl z-10 min-h-32 justify-center overflow-hidden",
              step >= 2,
              step >= 3 && "justify-start p-8",
              step >= 4 &&
                "flex-col items-start min-w-lg max-h-[700px] min-h-[610px]",
              step === 6 && "static",
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
              step === 6 && "static max-w-1/5 gap-4",
            )}
          >
            <LoginForm form={form} onSubmit={onSubmit} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ========================= Mobile ========================= */

function MobileLanding({ step, form, onSubmit }: ComponentProps) {
  const BR = 16;

  // 👇 ปรับ timing ให้ดรอปช้าลงและนุ่มขึ้น
  const MOBILE_ANIM = {
    container: 0.8,
    fade: 0.9,          // เดิม 0.7
    stagger: 0,
    delay2: 0.22,
    delay3: 0.26,
    delay4: 0.22,
    delay6: 0.36,       // เดิม 0.16 – หน่วงก่อนเริ่มดรอป
    contentDelay: 0.14, // เดิม 0.08
    contentDur: 0.28,

    dropDur: 2.1,       // เวลาเลื่อนลงของ step6
    itemFadeDur: 0.7,   // เฟดของคอนเทนต์ภายใน
  };

  const ease = cubicBezier(0.2, 0.8, 0.2, 1);
  const springy = cubicBezier(0.16, 1, 0.3, 1); // นุ่มหนึบเวลาลง

  const containerVariants = {
    step1: {
      width: "100%",
      height: "100%",
      scale: 2,
      transition: { duration: MOBILE_ANIM.container, ease },
    },
    step2: {
      width: "auto",
      height: "auto",
      scale: 1,
      transition: {
        delay: MOBILE_ANIM.delay2,
        duration: MOBILE_ANIM.container,
        ease,
      },
    },
    step3: {
      width: "auto",
      height: "auto",
      scale: 1,
      transition: {
        delay: MOBILE_ANIM.delay3,
        duration: MOBILE_ANIM.container,
        ease,
      },
    },
    step4: {
      width: "90%",
      height: "auto",
      scale: 1,
      y: -12,
      transition: {
        delay: MOBILE_ANIM.delay4,
        duration: MOBILE_ANIM.container,
        ease,
      },
    },
    // 👇 ทำดรอปให้ช้าลงอย่างเห็นได้ชัด
    step6: {
      width: "90%",
      height: "auto",
      scale: 1,
      y: [-12, -8, -4, -2, 0] as number[],
      transition: {
        delay: MOBILE_ANIM.delay6,
        duration: MOBILE_ANIM.dropDur,
        ease: springy,
      },
    },
  } as const;

  const groupVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        delay: MOBILE_ANIM.contentDelay,
        staggerChildren: 0,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: -4 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: MOBILE_ANIM.itemFadeDur, ease },
    },
  } as const;

  // ล็อก radius + ปิด transition radius ของ Motion
  const wrapperStyle: StyleWithMbr = {
    "--mbr": `${BR}px`,
    borderRadius: "var(--mbr)",
    transformOrigin: "50% 50%",
    contain: "paint",
    transitionProperty: "background-color, box-shadow",
    transitionDuration: `${MOBILE_ANIM.container * 1000}ms`,
    transitionTimingFunction: "ease-in-out",
  };

  const isOrange = step < 4;
  const bgTransition = { duration: MOBILE_ANIM.fade, ease };

  const PRE_LOGO_SIZE = 44;
  const FORM_LOGO_SIZE = 96;

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
        animate={`step${step}` as keyof typeof containerVariants}
        transition={{ layout: { duration: 0 }, borderRadius: { duration: 0 } }}
        style={wrapperStyle}
        className={cn(
          "absolute flex items-center drop-shadow-xl border z-10 min-h-fit justify-center overflow-hidden",
          "bg-transparent",
          step >= 6 && "flex p-6 flex-col gap-3",
        )}
      >
        {/* พื้นหลังสองชั้น — คลิปด้วย clipPath ให้มุมติดไปพร้อมกันทุกเฟรม */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: "var(--mbr)",
            clipPath: "inset(0 round var(--mbr))",
            backgroundColor: "var(--color-primary, #F24822)",
            willChange: "opacity",
            transform: "translateZ(0)",
          }}
          initial={false}
          animate={{ opacity: isOrange ? 1 : 0 }}
          transition={bgTransition}
        />
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: "var(--mbr)",
            clipPath: "inset(0 round var(--mbr))",
            backgroundColor: "#ffffff",
            willChange: "opacity",
            transform: "translateZ(0)",
          }}
          initial={false}
          animate={{ opacity: isOrange ? 0 : 1 }}
          transition={bgTransition}
        />

        {/* โลโก้ก่อนฟอร์ม */}
        {step < 6 && (
          <div className="m-6" style={{ position: "relative", zIndex: 1 }}>
            <div
              className="relative"
              style={{ width: PRE_LOGO_SIZE, height: PRE_LOGO_SIZE }}
            >
              <AnimatePresence mode="popLayout">
                <motion.div
                  key="pre-logos"
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0 } }}
                >
                  {/* #1 ไอคอนขาว (พื้นส้ม) */}
                  <motion.div
                    className="absolute inset-0"
                    style={{ willChange: "opacity", transform: "translateZ(0)" }}
                    initial={false}
                    animate={{ opacity: isOrange ? 1 : 0 }}
                    transition={bgTransition}
                  >
                    <Image
                      src={"/logo/logo-no-text-white.svg"}
                      width={PRE_LOGO_SIZE}
                      height={PRE_LOGO_SIZE}
                      alt="Logo White"
                      priority
                      draggable={false}
                    />
                  </motion.div>

                  {/* #2 ไอคอนสี (พื้นขาว) */}
                  <motion.div
                    className="absolute inset-0"
                    style={{ willChange: "opacity", transform: "translateZ(0)" }}
                    initial={false}
                    animate={{ opacity: isOrange ? 0 : 1 }}
                    transition={bgTransition}
                  >
                    <Image
                      src={"/logo/logo-no-text.svg"}
                      width={PRE_LOGO_SIZE}
                      height={PRE_LOGO_SIZE}
                      alt="Logo Color"
                      priority
                      draggable={false}
                    />
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* กลุ่มฟอร์ม + โลโก้ #3 */}
        {step >= 6 && (
          <motion.div
            key="LoginGroup"
            variants={groupVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center text-center w/full h/full"
            style={{
              position: "relative",
              zIndex: 1,
              willChange: "opacity, transform",
            }}
          >
            <motion.div variants={itemVariants} className="mb-4 mt-5">
              <Image
                src={"/logo/inblock.svg"}
                width={FORM_LOGO_SIZE}
                height={FORM_LOGO_SIZE}
                alt="App Icon Large"
                priority
                draggable={false}
              />
            </motion.div>
            <motion.div variants={itemVariants} className="w-full">
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
      </div> */}
    </>
  );
}
