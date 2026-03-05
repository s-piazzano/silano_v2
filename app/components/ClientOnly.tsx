"use client";

import { useEffect, useState } from "react";

export default function ClientOnly({ children }: { children?: React.ReactNode, key?: React.Key }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <>{children}</>;
}
