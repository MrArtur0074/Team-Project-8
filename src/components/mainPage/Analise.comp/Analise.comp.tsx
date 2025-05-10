import Graph from "../GraphAnalise/Graph.comp";
import Reviews from "../ReviewsAnalise/Reviews.comp";
import style from "./Analise.comp.module.css";
// import bg from "../../../assets/common/bg_analise.svg";
import bg from "../../../assets/main_page/LinesBG (2) 1.svg";
import { useTranslation } from "react-i18next";

// import stumb_1 from "../../../assets/common/img_stub.svg";
// import stumb_2 from "../../../assets/common/linegraph_stub.svg";

export default function Analise() {
  const { t } = useTranslation();
  return (
    <div>
      <div className={style.container}>
        <img src={bg} alt="" className={style.bg} />
        <div className={style.left_side}>
          <Reviews />
        </div>
        <div className={style.right_side}>
          <div className={style.title}>
            {t("analise.title")} <span>{t("analise.titleSpan")}</span>
          </div>
          <div className={style.info}>{t("analise.info")}</div>
          <div className={style.graph} style={{ borderRadius: "30px" }}>
            <Graph />
          </div>
        </div>
      </div>
    </div>
  );
}
