import styles from "./HowUse.comp.module.css";
import img1 from "../../../assets/main_page/img__1.svg";
import img2 from "../../../assets/main_page/img__2.svg";
import img3 from "../../../assets/main_page/img__3.svg";
import img4 from "../../../assets/main_page/img__4.svg";
import { useTranslation, Trans } from "react-i18next";

export default function HowUse() {
  const { t } = useTranslation();
  const cards = t("mainPageHowUse.cards", { returnObjects: true }) as Array<{
    title: string;
    description: string;
  }>;

  return (
    <div>
      <div className={styles.container_wrapper}>
        <div className={styles.container} id="how_use">
          <div className={styles.title}>
            <Trans i18nKey="mainPageHowUse.title">
              Что такое <span>Anonimo?</span>
            </Trans>
          </div>
          <p>
            <Trans i18nKey="mainPageHowUse.desc">
              Anonimo - это онлайн-платформа, где сотрудники могут анонимно
              проходить опросы, созданные их компанией. <br />
              Администраторы задают важные вопросы - от условий труда до рабочих
              процессов - а сотрудники честно отвечают, не раскрывая личность.{" "}
              <br />
              Компания получает агрегированные результаты и использует их для
              принятия обоснованных решений и улучшения рабочей среды.
            </Trans>
          </p>
        </div>
        <div className={styles.howItWork}>
          <div className={styles.title_howItWork}>
            {t("mainPageHowUse.howItWork")}
          </div>
          <div className={styles.cards}>
            {cards.map((card, idx) => (
              <div
                className={`${styles.card} ${styles[`card_${idx + 1}`]}`}
                key={idx}
              >
                <img src={[img1, img2, img3, img4][idx]} alt="" />
                <div style={{ background: "none" }}>
                  <div className={styles.card_title}>{card.title}</div>
                  <div className={styles.card_description}>
                    {card.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
