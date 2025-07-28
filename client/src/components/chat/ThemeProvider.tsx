import { ThemeProvider as BaseThemeProvider } from "@/hooks/useTheme";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function ThemeProvider({ children }: Props) {
  return <BaseThemeProvider>{children}</BaseThemeProvider>;
}
