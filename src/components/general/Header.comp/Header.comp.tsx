import { NavLink } from "react-router-dom";
import style from "./Header.comp.module.css";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { t } = useTranslation();
  const btns = [
    { value: t("header.about"), link: "/", direction: "about_us" },
    { value: t("header.reviews"), link: "/", direction: "otzyv" },
    { value: t("header.contacts"), link: "/", direction: "contacts" },
  ];

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div>
      <div className="container_wrapper">
        <div className={style.container}>
          <div className={style.logo}>
            <a href="/">Anonimo</a>
          </div>
          <div className={style.nav}>
            <div
              style={{ background: "none", display: "flex" }}
              id={style.nav_btns}
            >
              {btns.map((item) => (
                <div
                  className={style.item}
                  key={item.direction}
                  onClick={() => scrollToSection(item.direction)}
                >
                  <NavLink
                    to={item.link}
                    id={style.btn}
                    style={{ background: "none" }}
                  >
                    {item.value}
                  </NavLink>
                </div>
              ))}
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
}
