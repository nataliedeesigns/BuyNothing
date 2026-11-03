import type { ReactNode } from "react";
import { FiltersProvider } from "./filters";
import { GivingProvider } from "./giving";
import { InterestProvider } from "./interests";
import { MessagesProvider } from "./messages";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <InterestProvider>
      <FiltersProvider>
        <GivingProvider>
          <MessagesProvider>{children}</MessagesProvider>
        </GivingProvider>
      </FiltersProvider>
    </InterestProvider>
  );
}
