import { useEffect, useRef } from "react";
import style from "./Aboutus.comp.module.css";
// import logo from "../../../assets/common/logo_main.svg";

import eldar from "../../../assets/team_imgs/photo_2025-02-17_15-25-01.jpg";
import tilek from "../../../assets/team_imgs/photo_2025-02-05_20-11-37.jpg";
import aruuke from "../../../assets/team_imgs/photo_2025-03-18_19-14-06 1.svg";
import argen from "../../../assets/team_imgs/photo_2025-02-19_22-27-09.jpg";
import { useTranslation } from "react-i18next";

interface TeamMember {
  name: string;
  surname: string;
  position: string;
  img: string;
  id: string;
}

export default function Aboutus() {
  const { t } = useTranslation();
  const team: TeamMember[] = [
    {
      name: t("aboutus.names.Арууке"),
      surname: t("aboutus.surnames.Аскатова"),
      position: t("aboutus.backend"),
      img: aruuke,
      id: "item_1",
    },
    {
      name: t("aboutus.names.Тилекмат"),
      surname: t("aboutus.surnames.Ажыгулов"),
      position: t("aboutus.frontend"),
      img: tilek,
      id: "item_2",
    },
    {
      name: t("aboutus.names.Элдар"),
      surname: t("aboutus.surnames.Мурхалидинов"),
      position: t("aboutus.marketing"),
      img: eldar,
      id: "item_3",
    },
    {
      name: t("aboutus.names.Арген"),
      surname: t("aboutus.surnames.Шамыров"),
      position: t("aboutus.design"),
      img: argen,
      id: "item_4",
    },
  ];

  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const imgContainer = entry.target.querySelector(`.${style.img}`);
          const img = imgContainer?.querySelector("img");

          if (entry.isIntersecting) {
            entry.target.classList.add(style.visible);
            imgContainer?.classList.add(style.visible);
            img?.classList.add(style.visible);
          } else {
            entry.target.classList.remove(style.visible);
            imgContainer?.classList.remove(style.visible);
            img?.classList.remove(style.visible);
          }
        });
      },
      { threshold: 0.7 }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={style.container} id="about_us">
      <div className={style.title}>
        {t("aboutus.title")} <span>{t("aboutus.titleSpan")}</span>
      </div>
      <div className={style.cards}>
        {team.map((member, index) => (
          <div
            key={member.id}
            className={`${style.card} ${style[member.id]}`}
            ref={(el) => {
              if (el) cardsRef.current[index] = el;
            }}
            id={member.id}
          >
            <div className={style.img}>
              <img src={member.img} alt={member.name} />
            </div>
            <div style={{ background: "none" }} id={style.wrapper_info}>
              <div className={style.name}>
                {member.name} <br /> {member.surname}
              </div>
              <div className={style.position}>{member.position}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
