import styleAuth from "../../../components/general/Auth/AuthHeader/AuthHeader.module.css";
import { useTranslation } from "react-i18next";

export default function StepIndicator() {
  const { t } = useTranslation();

  return (
    <div className={styleAuth.progressContainer}>
      <div
        className={styleAuth.step}
        id={styleAuth.active}
        style={{ borderRadius: "18px 18px 0px 0" }}
      >
        <span className={styleAuth.stepNumber}>1</span>
        <span className={styleAuth.stepText}>
          {t("register.stepIndicator.dataEntry")}
        </span>
      </div>
    </div>
  );
}
