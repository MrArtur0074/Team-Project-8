import { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./FAQ.module.css";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../../components/general/LanguageSwitcher/LanguageSwitcher";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  const faqData: FAQItem[] = [
    { question: t("faq.q1"), answer: t("faq.a1") },
    { question: t("faq.q2"), answer: t("faq.a2") },
    { question: t("faq.q3"), answer: t("faq.a3") },
    { question: t("faq.q4"), answer: t("faq.a4") },
    { question: t("faq.q5"), answer: t("faq.a5") },
    { question: t("faq.q6"), answer: t("faq.a6") },
    { question: t("faq.q7"), answer: t("faq.a7") },
    { question: t("faq.q8"), answer: t("faq.a8") },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={style.faqContainer}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <button onClick={() => navigate("/")} className={style.backButton}>
          ←
        </button>
        <LanguageSwitcher />
      </div>

      <h1 className={style.title}>{t("faq.title")}</h1>
      <div className={style.faqList}>
        {faqData.map((item, index) => (
          <div key={index} className={style.faqItem}>
            <button
              className={`${style.question} ${openIndex === index ? style.active : ""}`}
              onClick={() => toggleAccordion(index)}
            >
              {item.question}
              <span className={style.icon}>
                {openIndex === index ? "−" : "+"}
              </span>
            </button>
            <div
              className={`${style.answer} ${openIndex === index ? style.show : ""}`}
            >
              {item.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
