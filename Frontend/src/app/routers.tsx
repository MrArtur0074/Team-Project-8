import { createBrowserRouter } from "react-router-dom";
import MainPage from "../pages/MainPage.page/MainPage.page";
import NoPage from "../pages/NoPage.page/NoPage.page";
import Dashboard from "../pages/Dashboard.page/Dashboard.page";
import LoginForm from "../pages/Auth.page/Login/LoginForm/LoginForm.comp";
import LayoutSideBar from "../components/general/LayoutSideBar";
import Settings from "../pages/Settings.page/Settings.page";
// import Surveys from "../pages/Surveys.page/Surveys.page";
import RegisterRoot from "../pages/Auth.page/Register/ChooseAccount/RegisterRoot";
import CreateSurvey from "../pages/CreateSurvey.page/CreateSurvey.page";
import TakeSurvey from "../pages/TakeSurvey.page/TakeSurvey.page";

const sidebarRoutes = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/settings", element: <Settings /> },
  { path: "/survey/:id", element: <TakeSurvey /> },
  { path: "/create_survey", element: <CreateSurvey /> },
];

const sidebarWrappedRoutes = sidebarRoutes.map((route) => ({
  path: route.path,
  element: <LayoutSideBar />,
  children: [{ path: "", element: route.element }],
}));

export const routers = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/register",
    element: <RegisterRoot />,
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  ...sidebarWrappedRoutes,
  {
    path: "/*",
    element: <NoPage />,
  },
]);
