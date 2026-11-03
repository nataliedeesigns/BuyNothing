import { useEffect, useState } from "react";

/** Matches the design breakpoint: below 1024px uses the mobile layouts. */
export const MOBILE_QUERY = "(max-width: 1023px)";

export function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches);
  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const onChange = () => setMobile(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return mobile;
}
