"use client"; // Required for Next.js

import { MiniKit } from "@worldcoin/minikit-js";
import { ReactNode, useEffect } from "react";

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    MiniKit.install("app_cbc2eecc118531aa94de22e012c41449");
    console.log(MiniKit.isInstalled());
  }, []);


  return <>{children}</>;
}
