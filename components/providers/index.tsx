import type { ReactNode } from "react";
import { ClientProviders } from "./client";

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ClientProviders>
      {children}
    </ClientProviders>
  );
};
