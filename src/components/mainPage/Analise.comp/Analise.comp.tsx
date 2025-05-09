import Graph from "../GraphAnalise/Graph.comp";
import Reviews from "../ReviewsAnalise/Reviews.comp";
import style from "./Analise.comp.module.css";
// import bg from "../../../assets/common/bg_analise.svg";
import bg from "../../../assets/main_page/LinesBG (2) 1.svg";

// import stumb_1 from "../../../assets/common/img_stub.svg";
// import stumb_2 from "../../../assets/common/linegraph_stub.svg";

export default function Analise() {
  return (
    <div>
      <div className={style.container}>
        <img src={bg} alt="" className={style.bg} />
        <div className={style.left_side}>
          <Reviews />
        </div>
        <div className={style.right_side}>
          <div className={style.title}>
            Анализируйте отзывы и <span>улучшайте сервис</span>
          </div>
          <div className={style.info}>
            Ваши отзывы формируют реальные данные! Следите за динамикой мнений,
            выявляйте тенденции и принимайте обоснованные решения.
          </div>
          <div className={style.graph} style={{ borderRadius: "30px" }}>
            <Graph />
          </div>
        </div>
      </div>
    </div>
  );
}
