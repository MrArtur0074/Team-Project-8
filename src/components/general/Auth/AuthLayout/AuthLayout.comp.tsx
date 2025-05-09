import React, { ReactNode } from "react";
import style from "./AuthLayout.module.css";
import bg_lines from "../../../../assets/auth/lines.svg";
// import left from "../../../../assets/auth/left.svg";
// import right from "../../../../assets/auth/right.svg";
// import { NavLink } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  buttons: {
    next: {
      text: string;
      onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; // Сделаем onClick необязательным
      link?: string; // Добавляем link как опцию
    };
    prev: { link: string; text: string };
    relink: { link: string; text: string };
  };
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  // buttons,
  title,
}) => {
  return (
    <div className={style.wrapper}>
      <div className="container_wrapper">
        <img src={bg_lines} alt="" className={style.line} />
        <div className={style.container}>
          <h2 className={style.title}>{title}</h2>
          {children}
          {/* <div className={style.btns}>
            <NavLink
              to={buttons.prev.link}
              className={style.btn}
              style={{ textDecoration: "none" }}
            >
              <img src={left} className={style.left_img} alt="" />
              {buttons.prev.text}
            </NavLink>

            <NavLink to={buttons.relink.link} className={style.relink}>
              {buttons.relink.text}
            </NavLink>

            <NavLink
              to={buttons.next.link}
              className={style.btn}
              style={{ textDecoration: "none" }}
            >
              {buttons.next.text}
              <img src={right} className={style.right_img} alt="" />
            </NavLink>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
