import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createContext, useContext } from "react";

type AppContextValues = {
  workDayLength: number;
};

export const AppContext = createContext<AppContextValues | undefined>(
  undefined
);

export const useAppContext = () => {
  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error("No AppContext.Provider found when calling useAppContext");
  }

  return appContext;
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppContext.Provider value={{ workDayLength: 7.6 }}>
      <Component {...pageProps} />
    </AppContext.Provider>
  );
}
