import style from "./Reviews.comp.module.css";
import five_stars from "../../../assets/main_page/5_stars.svg";
import four_stars from "../../../assets/main_page/4_stars.svg";

import elon from "../../../assets/main_page/mask_otzyv.svg";
import sadyr from "../../../assets/main_page/zhaparov_otzyv.svg";
import said from "../../../assets/main_page/davlatov_otzyv.svg";

const users = [
  {
    name: "Илон Маск",
    img_stars: five_stars,
    img_pers: elon,
    message: "Я узнал много нового о своих работниках и уволил больше половины",
  },
  {
    name: "Садыр Жапаров",
    img_stars: five_stars,
    img_pers: sadyr,
    message:
      "Приложение простое, но полезное. Главное – не бояться оставлять честные отзывы.",
  },
  {
    name: "Саид Давлатов",
    img_stars: four_stars,
    img_pers: said,
    message:
      "Быстро и удобно, не нужно проходить через кучу бюрократии, чтобы донести мысль.",
  },
];

export default function Reviews() {
  return (
    <div style={{ background: "none" }} id="otzyv">
      <div className={style.cards}>
        {users.map((user) => (
          <div className={style.card} id={user.name}>
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
