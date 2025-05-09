import { NavLink } from "react-router-dom";
import style from "./Header.comp.module.css";

export default function Header() {
  const btns = [
    { value: "О нас", link: "/", direction: "about_us" },
    { value: "Отзывы", link: "/", direction: "otzyv" },
    { value: "Контакты", link: "/", direction: "contacts" },
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
            {btns.map((item) => (
              <div
                className={style.item}
                key={item.link}
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
        </div>
      </div>
    </div>
  );
}
