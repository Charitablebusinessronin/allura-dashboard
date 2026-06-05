import { createBrowserRouter } from "react-router";
import { AppShell } from "./components/AppShell";
import { DreamsPage } from "./pages/DreamsPage";
import { GovernancePage } from "./pages/GovernancePage";
import { KanbanPage } from "./pages/KanbanPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AppShell,
    children: [
      { index: true, Component: DreamsPage },
      { path: "dreams", Component: DreamsPage },
      { path: "governance", Component: GovernancePage },
      { path: "kanban", Component: KanbanPage },
    ],
  },
]);
