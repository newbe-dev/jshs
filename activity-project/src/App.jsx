import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ActivityPage from "./components/pages/ActivityPage";
import ActivityApplyPage from "./components/pages/ActivityApplyPage";
import ActivityCreatePage from "./components/pages/ActivityCreatePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>root</div>, //homepage
  },
  {
    path: "/activity",
    element: <ActivityPage />,
  },
  {
    path: "/activity/apply",
    element: <ActivityApplyPage />,
  },
  {
    path: "/activity/create",
    element: <ActivityCreatePage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
