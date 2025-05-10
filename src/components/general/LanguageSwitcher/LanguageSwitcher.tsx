import { useTranslation } from "react-i18next";
import style from "./LanguageSwitcher.module.css";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className={style.languageSwitcher}>
      <button
        type="button"
        className={`${style.langButton} ${i18n.language === "ru" ? style.active : ""}`}
        onClick={() => changeLanguage("ru")}
      >
        RU
      </button>
      <button
        type="button"
        className={`${style.langButton} ${i18n.language === "en" ? style.active : ""}`}
        onClick={() => changeLanguage("en")}
      >
        EN
      </button>
      <button
        type="button"
        className={`${style.langButton} ${i18n.language === "ky" ? style.active : ""}`}
        onClick={() => changeLanguage("ky")}
      >
        KY
      </button>
    </div>
  );
};
