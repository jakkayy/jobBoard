"use client";

import { useEffect, useState } from "react";
import { getStoredToken } from "@/lib/auth-token";

export function NavAuthButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getStoredToken());
  }, []);

  if (isLoggedIn) return null;

  return (
    <a
      href="/login"
      className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
    >
      Sign in
    </a>
  );
}
