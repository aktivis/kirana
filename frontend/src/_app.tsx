import "@cloudscape-design/global-styles/index.css";
import {
  AppLayout,
  Flashbar,
  FlashbarProps,
} from "@cloudscape-design/components";
import { createRoot } from "react-dom/client";
import { StrictMode, useEffect, useState } from "react";
import { StateFlashbarContext } from "./utils/providers";
import Sidebar from "./views/components/commons/Sidebar";
import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  useLocation,
} from "react-router-dom";
import HomePage from "./views/pages/index";
import ResearchPage from "./views/pages/research";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: ":id", element: <ResearchPage /> },
    ],
  },
]);

export default function App() {
  const [messages, setMessages] = useState<FlashbarProps.MessageDefinition[]>(
    []
  );
  const [showDrawer, setShowDrawer] = useState(false);
  const currentURL = useLocation();

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
          notifications={<Flashbar items={messages} />}
          content={<Outlet />}
          navigation={<Sidebar />}
          onNavigationChange={() => setShowDrawer(!showDrawer)}
          navigationOpen={showDrawer}
          stickyNotifications
          navigationHide={currentURL.pathname === "/"}
          toolsHide={currentURL.pathname === "/"}
        />
      </StateFlashbarContext.Provider>
    </StrictMode>
  );
}

createRoot(document.getElementById("app")!).render(
  <RouterProvider router={router} />
);
