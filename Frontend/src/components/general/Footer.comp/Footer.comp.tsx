import { NavLink } from "react-router-dom";
import style from "./Footer.comp.module.css";
import line from "../../../assets/common/line_foot.svg";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div>
      <div className={style.container}>
        <div
          className={style.container_wrapper}
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "start",
          }}
        >
          <div className={style.logo}>
            <a href="/">Anonimo</a>
          </div>
          <div className={style.wrapper}>
            <div className={style.links}>
              <div className={style.title}>Ссылки</div>
              <NavLink to="/" style={{ textDecoration: "none" }}>
                <div className={style.item}>О нас</div>
              </NavLink>
              <NavLink to="/" style={{ textDecoration: "none" }}>
                <div className={style.item}>Услуги</div>
              </NavLink>
              <NavLink to="/" style={{ textDecoration: "none" }}>
                <div className={style.item}>Отзывы</div>
              </NavLink>
              <NavLink to="/" style={{ textDecoration: "none" }}>
                <div className={style.item}>FAQ</div>
              </NavLink>
            </div>

            <div className={style.links}>
              <div className={style.title}>Навигация</div>
              <NavLink to="/" style={{ textDecoration: "none" }}>
                <div className={style.item}>Главная</div>
              </NavLink>
              <NavLink to="/" style={{ textDecoration: "none" }}>
                <div className={style.item}>Наши услуги</div>
              </NavLink>
              <NavLink to="/" style={{ textDecoration: "none" }}>
                <div className={style.item}>Новости</div>
              </NavLink>
              <NavLink to="/" style={{ textDecoration: "none" }}>
                <div className={style.item}>Отзывы</div>
              </NavLink>
            </div>

            <div className={style.links} id="contacts">
              <div className={style.title}>Контакты</div>
              <NavLink to="/" style={{ textDecoration: "none" }}>
                <div className={style.item}>Email</div>
              </NavLink>
              <NavLink to="/" style={{ textDecoration: "none" }}>
                <div className={style.item}>Телефон</div>
              </NavLink>
              <NavLink to="/" style={{ textDecoration: "none" }}>
                <div className={style.item}>Социальные сети</div>
              </NavLink>
            </div>
          </div>

          {/* <div className={style.links}>
            <div className={style.title}>Дополнительное</div>
            <NavLink to="/" style={{ textDecoration: "none" }}>
              <div className={style.item}>Выбор языка</div>
            </NavLink>
            <NavLink to="/" style={{ textDecoration: "none" }}>
              <div className={style.item}>Выбор языка</div>
            </NavLink>
          </div> */}
          <div className={style.btn_wrapp}>
            <div className={style.btn_up} onClick={scrollToTop}>
              <img src={line} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
