import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar.comp";

const LayoutSideBar: React.FC = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 p-6 w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default LayoutSideBar;
