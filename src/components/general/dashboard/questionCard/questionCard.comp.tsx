import React, { useContext } from "react";
import style from "./questionCard.module.css";
import { UserContext } from "../../../../App";
import { useTranslation } from "react-i18next";

interface DashboardProps {
  id: number;
  title: string;
  info: string;
  date: string;
  company_name: string;
  onDelete?: (id: number) => void;
  onStart?: (id: number) => void;
}

const QuestionCard: React.FC<DashboardProps> = ({
  id,
  info,
  date,
  title,
  // company_name,
  onDelete,
  onStart,
}) => {
  const [user] = useContext(UserContext); // получаем данные о пользователе из контекста
  const userRole = user.role;
  const { t } = useTranslation();

  return (
    <div>
      <div className={style.card}>
        <div className={style.left}>
          <div className={style.company_name}>
            {t("questionCard.topic")}: {title}
          </div>
          {/* <div className={style.title}>Тема опросника: {title}</div> */}
          <div className={style.info}>{info}</div>
        </div>
        <div className={style.right}>
          <div>
            <div className={style.date}>
              {t("questionCard.created")}: {date}
            </div>
          </div>
          {userRole === "MANAGER" || userRole === "ADMIN" ? (
            <div className={style.btns}>
              <div className={style.btn}>{t("questionCard.results")}</div>
              <button
                className={style.btn_delete}
                onClick={() => onDelete?.(id)}
              >
                {t("questionCard.delete")}
              </button>
            </div>
          ) : userRole === "USER" ? (
            <div className={style.btn} onClick={() => onStart?.(id)}>
              {t("questionCard.start")}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
