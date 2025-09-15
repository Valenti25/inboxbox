"use client";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";

type Props = {
  /** ใส่ path ใน public เช่น /lottie/login-desktop.json */
  src: string;
  className?: string;      // ใช้กำหนดขนาด เช่น w-16 h-16
  loop?: boolean;
  autoplay?: boolean;
};

export default function LottiePlayer({
  src="/images/Dark.json",
  className = "w-16 h-16",
  loop = true,
  autoplay = true,
}: Props) {
  const [data, setData] = useState<object | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const res = await fetch(src);
      const json = await res.json();
      if (alive) setData(json);
    })();
    return () => { alive = false; };
  }, [src]);

  if (!data) return null;

  return (
    <Lottie
      animationData={data}
      loop={loop}
      autoplay={autoplay}
      className={className}
      rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
    />
  );
}
