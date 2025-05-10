import style from "./Reviews.comp.module.css";
import five_stars from "../../../assets/main_page/5_stars.svg";
import four_stars from "../../../assets/main_page/4_stars.svg";
import elon from "../../../assets/main_page/mask_otzyv.svg";
import sadyr from "../../../assets/main_page/zhaparov_otzyv.svg";
import said from "../../../assets/main_page/davlatov_otzyv.svg";
import { useTranslation } from "react-i18next";

export default function Reviews() {
  const { t } = useTranslation();

  const users = [
    {
      name: t("reviews.elon.name"),
      img_stars: five_stars,
      img_pers: elon,
      message: t("reviews.elon.message"),
    },
    {
      name: t("reviews.sadyr.name"),
      img_stars: five_stars,
      img_pers: sadyr,
      message: t("reviews.sadyr.message"),
    },
    {
      name: t("reviews.said.name"),
      img_stars: four_stars,
      img_pers: said,
      message: t("reviews.said.message"),
    },
  ];

  return (
    <div style={{ background: "none" }} id="otzyv">
      <div className={style.cards}>
        {users.map((user) => (
          <div className={style.card} id={user.name} key={user.name}>
            <div id={style.info}>
              <div className={style.img_star}>
                <img src={user.img_stars} alt="" />
              </div>
              <div className={style.name}>{user.name}</div>
              <div className={style.info}>{user.message}</div>
            </div>
            <div className={style.img}>
              <img src={user.img_pers} alt="" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
