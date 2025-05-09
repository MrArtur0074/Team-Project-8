import styleAuth from "../../../components/general/Auth/AuthHeader/AuthHeader.module.css";

export default function StepIndicator() {
  return (
    <div className={styleAuth.progressContainer}>
      <div
        className={styleAuth.step}
        id={styleAuth.active}
        style={{ borderRadius: "18px 18px 0px 0" }}
      >
        <span className={styleAuth.stepNumber}>1</span>
        <span className={styleAuth.stepText}>Заполнение данных</span>
      </div>
    </div>
  );
}
