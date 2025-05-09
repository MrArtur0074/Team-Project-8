import React from "react";
import style from "./AuthHeader.module.css";

interface StepProgressProps {
  currentStep: number;
}

const steps = ["Выбор типа аккаунта", "Ввод данных", "Подтверждение почты"];

const AuthHeader: React.FC<StepProgressProps> = ({ currentStep }) => {
  return (
    <div className={style.progressContainer}>
      {steps.map((step, index) => (
        <div
          key={index}
          className={`${style.step} ${currentStep === index + 1 ? style.active : ""}`}
        >
          <span className={style.stepNumber}>{index + 1}</span>
          <span className={style.stepText}>{step}</span>
        </div>
      ))}
    </div>
  );
};

export default AuthHeader;
