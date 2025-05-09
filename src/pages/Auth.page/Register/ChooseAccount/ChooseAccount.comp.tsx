import style from "./ChooseAccount.module.css";
import "../../common.style.css";
import AuthLayout from "../../../../components/general/Auth/AuthLayout/AuthLayout.comp";
import style_aurh from "../../../../components/general/Auth/AuthHeader/AuthHeader.module.css";
import { useState } from "react";

export default function ChooseAccount() {
  const [selected, setSelected] = useState("admin");

  return (
    <div style={{ background: "none" }}>
      <AuthLayout
        title="Регистация"
        buttons={{
          next: { link: "/register_admin", text: "Продолжить" },
          prev: { link: "/", text: "Вернуться" },
          relink: { link: "/login", text: "Уже есть аккаунт?" },
        }}
      >
        <div className="main">
          <div className={style_aurh.progressContainer}>
            <div className={style_aurh.step} id={style_aurh.active}>
              <span className={style_aurh.stepNumber}>1</span>
              <span className={style_aurh.stepText}>Выбор типа аккаунта</span>
            </div>
            <div
              className={style_aurh.step}
              style={{ marginLeft: "-1rem", zIndex: "1" }}
            >
              <span className={style_aurh.stepNumber}>2</span>
              <span className={style_aurh.stepText}>Ввод данных</span>
            </div>
            <div className={style_aurh.step} id={style_aurh.last_item}>
              <span className={style_aurh.stepNumber}>3</span>
              <span className={style_aurh.stepText}>Подтверждение почты</span>
            </div>
          </div>
          <div className="container_auth">
            <h3 className="step_auth" id="h3_auth">
              Этап 1
            </h3>
            {/* <span></span> */}
            <h3 id="h3_auth">Выберите тип аккаунта</h3>
            <p className="p_auth">
              Создаете ли вы учетную запись пользователя или администратора?{" "}
              <br />
              Выберите подходящий вариант, чтобы продолжить.
            </p>
          </div>
          <div className={style.container}>
            <label className={style.radio_container}>
              <input
                type="radio"
                name="role"
                value="admin"
                checked={selected === "admin"}
                onChange={() => setSelected("admin")}
              />
              <span className={style.custom_radio}></span>
              Пользователь
            </label>
            <label className={style.radio_container}>
              <input
                type="radio"
                name="role"
                value="admin"
                checked={selected === "admin"}
                onChange={() => setSelected("admin")}
              />
              <span className={style.custom_radio}></span>
              Администратор
            </label>
          </div>
        </div>
      </AuthLayout>
    </div>
  );
}
