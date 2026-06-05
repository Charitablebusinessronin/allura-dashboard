import { RouterProvider } from "react-router";
import { PolicyProvider } from "../lib/policy/PolicyContext";
import { router } from "./routes";

export default function App() {
  return (
    <PolicyProvider>
      <RouterProvider router={router} />
    </PolicyProvider>
  );
}
