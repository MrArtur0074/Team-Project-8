import style from "./ChooseAccount.module.css";
import "../../common.style.css";
import AuthLayout from "../../../../components/general/Auth/AuthLayout/AuthLayout.comp";
import style_aurh from "../../../../components/general/Auth/AuthHeader/AuthHeader.module.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function ChooseAccount() {
  const [selected, setSelected] = useState("admin");
  const { t } = useTranslation();

  return (
    <div style={{ background: "none" }}>
      <AuthLayout
        title={t("chooseAccount.title")}
        buttons={{
          next: { link: "/register_admin", text: t("chooseAccount.continue") },
          prev: { link: "/", text: t("chooseAccount.back") },
          relink: {
            link: "/login",
            text: t("chooseAccount.alreadyHaveAccount"),
          },
        }}
      >
        <div className="main">
          <div className={style_aurh.progressContainer}>
            <div className={style_aurh.step} id={style_aurh.active}>
              <span className={style_aurh.stepNumber}>1</span>
              <span className={style_aurh.stepText}>
                {t("chooseAccount.accountTypeSelection")}
              </span>
            </div>
            <div
              className={style_aurh.step}
              style={{ marginLeft: "-1rem", zIndex: "1" }}
            >
              <span className={style_aurh.stepNumber}>2</span>
              <span className={style_aurh.stepText}>
                {t("chooseAccount.dataEntry")}
              </span>
            </div>
            <div className={style_aurh.step} id={style_aurh.last_item}>
              <span className={style_aurh.stepNumber}>3</span>
              <span className={style_aurh.stepText}>
                {t("chooseAccount.emailConfirmation")}
              </span>
            </div>
          </div>
          <div className="container_auth">
            <h3 className="step_auth" id="h3_auth">
              {t("chooseAccount.step1")}
            </h3>
            <h3 id="h3_auth">{t("chooseAccount.chooseAccountType")}</h3>
            <p className="p_auth">
              {t("chooseAccount.accountTypeDescription")}
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
              {t("chooseAccount.user")}
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
              {t("chooseAccount.administrator")}
            </label>
          </div>
        </div>
      </AuthLayout>
    </div>
  );
}
