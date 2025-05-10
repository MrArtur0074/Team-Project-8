import { NavLink, useLocation, useNavigate } from "react-router-dom";
import style from "./Sidebar.module.css";
import img1 from "../../../assets/sidebar/img_sidebar1.svg";
import img3 from "../../../assets/sidebar/img_sidebar3.svg";
import { useTranslation } from "react-i18next";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleNavigation = (path: string) => {
    console.log("Current path:", location.pathname); // Отладочный вывод

    // Если мы на странице создания или прохождения опроса, генерируем событие
    if (
      location.pathname.includes("create-survey") ||
      location.pathname.includes("take-survey") ||
      location.pathname.includes("survey") // Добавляем более общую проверку
    ) {
      console.log("Survey page detected, showing alert"); // Отладочный вывод
      const event = new CustomEvent("navigationAttempt", { detail: { path } });
      window.dispatchEvent(event);
    } else {
      console.log("Normal page, using navigation"); // Отладочный вывод
      navigate(path);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.logo}>
        <a href="/">Anonimo</a>
      </div>
      <nav className={style.btns}>
        <ul>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => (isActive ? style.active : "")}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation("/dashboard");
              }}
            >
              <img src={img1} alt="" /> {t("sidebar.surveys")}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) => (isActive ? style.active : "")}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation("/profile");
              }}
            >
              <img src={img3} alt="" /> {t("sidebar.profile")}
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
