import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import StatsCounter from "../CounterBanner/StatsCounter.comp";
import style from "./Banner.comp.module.css";
import bg from "../../../assets/main_page/anonimo_bg.svg";
import line from "../../../assets/main_page/LineBG.svg";
import { AuthContext } from "../../../App";

export default function Banner() {
  const [showAlert, setShowAlert] = useState(false);
  const [isAuth] = useContext(AuthContext);
  const navigate = useNavigate();

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
            <p>Вы уже авторизованы. Хотите перейти на дешборд?</p>
            <button onClick={() => navigate("/dashboard")}>Да</button>
            <button onClick={() => setShowAlert(false)}>Нет</button>
          </div>
        </div>
      )}
      <div className={style.component}>
        <div className={style.left_side}>
          <div className={style.title}>
            Оставьте отзыв <br />
            <span>Анонимно</span>
          </div>
          <div className={style.info}>
            Ваш голос имеет значение! Безопасно делитесь своими мыслями,
            оставаясь анонимными, и помогайте компании становиться лучше.
          </div>
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
                <div className={style.btn_reg}>Опросники</div>
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
                <div className={style.btn_reg}>Регистрация</div>
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
                <div className={style.btn_aut}>Вход</div>
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
