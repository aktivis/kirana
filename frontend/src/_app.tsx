import "@cloudscape-design/global-styles/index.css";
import {
  AppLayout,
  Flashbar,
  FlashbarProps,
} from "@cloudscape-design/components";
import { createRoot } from "react-dom/client";
import { StrictMode, useEffect, useState } from "react";
import HomePage from "./views/pages";
import { StateFlashbarContext } from "./utils/providers";

export default function App() {
  const [messages, setMessages] = useState<FlashbarProps.MessageDefinition[]>(
    []
  );

  useEffect(() => {
    if (messages.length) {
      const timer = setTimeout(() => {
        setMessages([]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  return (
    <StrictMode>
      <StateFlashbarContext.Provider value={setMessages}>
        <AppLayout
          stickyNotifications
          notifications={<Flashbar items={messages} />}
          content={<HomePage />}
          toolsHide
          navigationHide
        />
      </StateFlashbarContext.Provider>
    </StrictMode>
  );
}

createRoot(document.getElementById("app")!).render(<App />);
