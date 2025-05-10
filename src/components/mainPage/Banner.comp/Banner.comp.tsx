import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import StatsCounter from "../CounterBanner/StatsCounter.comp";
import style from "./Banner.comp.module.css";
import bg from "../../../assets/main_page/anonimo_bg.svg";
// import line from "../../../assets/main_page/LineBG.svg";
import { AuthContext } from "../../../App";
import { useTranslation } from "react-i18next";

export default function Banner() {
  const [showAlert, setShowAlert] = useState(false);
  const [isAuth] = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleButtonClick = (
    e: React.MouseEvent<HTMLAnchorElement>, // Типизация события
    target: string // Типизация параметра
  ) => {
    e.preventDefault();
    if (isAuth) {
      setShowAlert(true); // Показываем алерт
    } else {
      navigate(target); // Если не авторизован, сразу идем на страницу
    }
  };

  return (
    <div>
      {showAlert && (
        <div className={style.alert_modal}>
          <div className={style.alert_box}>
            <p>{t("banner.alreadyAuth")}</p>
            <button onClick={() => navigate("/dashboard")}>
              {t("banner.yes")}
            </button>
            <button onClick={() => setShowAlert(false)}>
              {t("banner.no")}
            </button>
          </div>
        </div>
      )}
      <div className={style.component}>
        <div className={style.left_side}>
          <div className={style.title}>
            {t("banner.title")} <br />
            <span>{t("banner.anonimo")}</span>
          </div>
          <div className={style.info}>{t("banner.subtitle")}</div>
          <div className={style.btns}>
            {isAuth ? (
              <NavLink
                to="/dashboard"
                style={{
                  textDecoration: "none",
                  display: "flex",
                  justifyContent: "center",
                  background: "none",
                }}
              >
                <div className={style.btn_reg}>{t("banner.dashboard")}</div>
              </NavLink>
            ) : (
              <NavLink
                to="/register"
                onClick={(e) => handleButtonClick(e, "/register")}
                style={{
                  textDecoration: "none",
                  display: "flex",
                  justifyContent: "center",
                  background: "none",
                }}
              >
                <div className={style.btn_reg}>{t("banner.register")}</div>
              </NavLink>
            )}

            {isAuth ? null : (
              <NavLink
                to="/login"
                onClick={(e) => handleButtonClick(e, "/login")}
                style={{
                  textDecoration: "none",
                  display: "flex",
                  justifyContent: "center",
                  background: "none",
                }}
              >
                <div className={style.btn_aut}>{t("banner.login")}</div>
              </NavLink>
            )}
          </div>
          <div className={style.statistic}>
            <StatsCounter />
          </div>
        </div>
        <div className={style.right_side}>
          {/* <img src={line} alt="Line" className={style.line} /> */}

          <img src={bg} alt="Background" className={style.bg_anonimo} />
        </div>
      </div>
    </div>
  );
}
