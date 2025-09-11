import * as React from "react";

const MOBILE_BREAKPOINT = 1024; // <=1023px = mobile/tablet

export function useIsMobile(breakpoint: number = MOBILE_BREAKPOINT): boolean {
  // ให้ค่าเริ่มต้นเป็น false เพื่อไม่ให้ type เป็น undefined
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(mql.matches);

    update(); // set ค่าเริ่มต้นตามขนาดปัจจุบัน

    // รองรับสเปกใหม่/เก่า
    if (mql.addEventListener) {
      mql.addEventListener("change", update);
      window.addEventListener("resize", update);
      return () => {
        mql.removeEventListener("change", update);
        window.removeEventListener("resize", update);
      };
    } else {
      mql.addListener(update);
      const onResize = () => update();
      window.addEventListener("resize", onResize);
      return () => {
        mql.removeListener(update);
        window.removeEventListener("resize", onResize);
      };
    }
  }, [breakpoint]);

  return isMobile;
}
