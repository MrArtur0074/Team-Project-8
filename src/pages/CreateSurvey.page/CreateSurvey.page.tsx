import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../App";
import style from "../Dashboard.page/Dashboard.page.module.css";
import style_survey from "./CreateSurvey.module.css";
// import style_alert from "../../components/mainPage/Banner.comp/Banner.comp.module.css";
import img_icon from "../../assets/common/icon (3).svg";
import img_add from "../../assets/dashboard/Group 189.svg";
import { useTranslation } from "react-i18next";

const CreateSurvey = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<any[]>([
    { type: "TEXT", text: "", choices: [] },
  ]);
  const [showAlert, setShowAlert] = useState(false);
  const [nextLocation, setNextLocation] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const navigate = useNavigate();
  const [user] = useContext(UserContext);
  const { t } = useTranslation();
  // Ошибки для каждого вопроса
  const [questionErrors, setQuestionErrors] = useState<string[]>([]);
  // Ошибки для названия и описания
  const [titleError, setTitleError] = useState<string>("");
  const [descError, setDescError] = useState<string>("");

  useEffect(() => {
    const hasChanges =
      title.trim() !== "" ||
      description.trim() !== "" ||
      questions.some(
        (q) =>
          q.text.trim() !== "" || q.choices.some((c: string) => c.trim() !== "")
      );
    setHasUnsavedChanges(hasChanges);
  }, [title, description, questions]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    const handleNavigationAttempt = (e: CustomEvent<{ path: string }>) => {
      if (hasUnsavedChanges) {
        setShowAlert(true);
        setNextLocation(e.detail.path);
      } else {
        navigate(e.detail.path);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener(
      "navigationAttempt",
      handleNavigationAttempt as EventListener
    );

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener(
        "navigationAttempt",
        handleNavigationAttempt as EventListener
      );
    };
  }, [hasUnsavedChanges, navigate]);

  if (!user || Object.keys(user).length === 0) {
    return <div>{t("createSurvey.loadingUser")}</div>;
  }

  const handleAddQuestion = () => {
    const newQuestion = { type: "TEXT", text: "", choices: [] };
    setQuestions([...questions, newQuestion]);
  };

  const handleQuestionTypeChange = (index: number, type: string) => {
    const updated = [...questions];
    updated[index].type = type;
    if (type === "MULTIPLE_CHOICE" && updated[index].choices.length === 0) {
      updated[index].choices = [""];
    }
    setQuestions(updated);
  };

  const handleRemoveQuestion = (index: number) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleQuestionTextChange = (index: number, text: string) => {
    const updated = [...questions];
    updated[index].text = text;
    setQuestions(updated);

    // Валидация при вводе
    let error = "";
    if (!text.trim()) {
      error = t("createSurvey.emptyQuestion", { num: index + 1 });
    } else if (text.trim().length < 3) {
      error = t("createSurvey.minLength", { num: index + 1 });
    }
    const newErrors = [...questionErrors];
    newErrors[index] = error;
    setQuestionErrors(newErrors);
  };

  const handleChoiceChange = (qIdx: number, cIdx: number, value: string) => {
    const updated = [...questions];
    updated[qIdx].choices[cIdx] = value;
    setQuestions(updated);
  };

  const handleAddChoice = (index: number) => {
    const updated = [...questions];
    updated[index].choices.push("");
    setQuestions(updated);
  };

  const handleRemoveChoice = (qIdx: number, cIdx: number) => {
    const updated = [...questions];
    updated[qIdx].choices.splice(cIdx, 1);
    setQuestions(updated);
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    let error = "";
    if (!value.trim()) {
      error = t("createSurvey.emptyTitle");
    } else if (value.trim().length < 3) {
      error = t("createSurvey.minTitleLength");
    }
    setTitleError(error);
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    let error = "";
    if (!value.trim()) {
      error = t("createSurvey.emptyDescription");
    } else if (value.trim().length < 3) {
      error = t("createSurvey.minDescriptionLength");
    }
    setDescError(error);
  };

  const handleSaveSurvey = () => {
    if (!user.username) return console.error("Нет пользователя");

    if (!title.trim() || questions.length === 0) {
      alert(t("createSurvey.titleAndQuestionRequired"));
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].text.trim()) {
        alert(t("createSurvey.emptyQuestion", { num: i + 1 }));
        return;
      }
      if (questions[i].text.trim().length < 3) {
        alert(t("createSurvey.minLength", { num: i + 1 }));
        return;
      }
      if (
        questions[i].type === "MULTIPLE_CHOICE" &&
        questions[i].choices.filter((c: string) => c.trim() !== "").length === 0
      ) {
        alert(t("createSurvey.optionRequired", { num: i + 1 }));
        return;
      }
    }

    const surveyData = {
      title,
      description,
      // createdBy: { username: user.username },
      questions: questions.map((q) => ({
        text: q.text,
        type: q.type,
        ...(q.type === "MULTIPLE_CHOICE" && {
          options: q.choices
            .filter((c: string) => c.trim() !== "")
            .map((c: string) => ({ text: c })),
        }),
      })),
    };

    console.log(surveyData);

    axios
      .post("http://localhost:8080/api/v1/surveys", surveyData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then(() => {
        setHasUnsavedChanges(false);
        navigate("/dashboard");
      })
      .then(() => console.log(surveyData))
      .catch((err) => console.error("Ошибка:", err));
  };

  return (
    <div className={style.container}>
      <div className="survey-container" id={style_survey.container}>
        <div>
          <h3>{t("createSurvey.surveyTitle")}</h3>
          <input
            className="input"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder={t("createSurvey.enterSurveyTitle")}
          />
          {titleError && (
            <p style={{ color: "#ff4d4f", marginTop: 4 }}>{titleError}</p>
          )}
        </div>
        <div>
          <h3>{t("createSurvey.description")}</h3>
          <textarea
            className="textarea"
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder={t("createSurvey.enterDescription")}
          />
          {descError && (
            <p style={{ color: "#ff4d4f", marginTop: 4 }}>{descError}</p>
          )}
        </div>

        <h2>{t("createSurvey.questions")}</h2>
        <div className={style_survey.block}>
          {questions.map((q, i) => (
            <div className={style_survey.question_box} key={i}>
              <div>
                <div className={style_survey.head_survey}>
                  <label>{`${t("createSurvey.question")} ${i + 1}`}</label>
                  <button
                    className={style_survey.btn_secondary}
                    onClick={() => handleRemoveQuestion(i)}
                  >
                    {t("createSurvey.deleteQuestion")}
                  </button>
                </div>
                <input
                  className="input"
                  value={q.text}
                  onChange={(e) => handleQuestionTextChange(i, e.target.value)}
                  placeholder={t("createSurvey.enterQuestion")}
                />
                {questionErrors[i] && (
                  <p style={{ color: "#ff4d4f", marginTop: 4 }}>
                    {questionErrors[i]}
                  </p>
                )}
              </div>
              <div>
                <label>{t("createSurvey.questionType")}</label>
                <select
                  className={style_survey.select}
                  style={{ background: "none" }}
                  value={q.type}
                  onChange={(e) => handleQuestionTypeChange(i, e.target.value)}
                >
                  <option value="TEXT">{t("createSurvey.text")}</option>
                  <option value="MULTIPLE_CHOICE">
                    {t("createSurvey.multipleChoice")}
                  </option>
                </select>
              </div>
              {q.type === "MULTIPLE_CHOICE" && (
                <div className={style_survey.choices}>
                  {q.choices.map((c: string, j: number) => (
                    <div className={style_survey.choice} key={j}>
                      <img src={img_icon} alt="" />
                      <input
                        className={style_survey.input}
                        value={c}
                        placeholder={`${t("createSurvey.option")} ${j + 1}`}
                        onChange={(e) =>
                          handleChoiceChange(i, j, e.target.value)
                        }
                      />
                      <button
                        className={style_survey.btn_del_answer}
                        style={{ marginLeft: "8px" }}
                        onClick={() => handleRemoveChoice(i, j)}
                      >
                        {t("createSurvey.removeOption")}
                      </button>
                    </div>
                  ))}

                  <div
                    className={style_survey.btn_add_option}
                    onClick={() => handleAddChoice(i)}
                  >
                    {t("createSurvey.addOption")}
                    <img src={img_add} alt="" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={style_survey.actions}>
          <button
            className={style_survey.btn_primary_add_survey}
            onClick={handleAddQuestion}
          >
            {t("createSurvey.addQuestion")}
          </button>
          <button
            className={style_survey.btn_success}
            onClick={handleSaveSurvey}
          >
            {t("createSurvey.saveSurvey")}
          </button>
        </div>
      </div>
      {/* {showAlert && (
        <div className={style_alert.alert_modal}>
          <div className={style_alert.alert_box}>
            <p>
              Вы точно хотите покинуть эту страницу? Изменения н будут
              сохранены.
            </p>
            <button
              onClick={() => {
                setShowAlert(false);
                if (nextLocation) navigate(nextLocation);
              }}
            >
              Да
            </button>
            <button onClick={() => setShowAlert(false)}>Нет</button>
          </div>
        </div>
      )} */}

      {showAlert && (
        <div className={style_survey.alert_modal}>
          <div className={style_survey.alert_box}>
            <p>{t("createSurvey.leavePage")}</p>
            <div className={style_survey.alert_buttons}>
              <button
                onClick={() => {
                  setShowAlert(false);
                  if (nextLocation) navigate(nextLocation);
                }}
              >
                {t("alert.yes")}
              </button>
              <button onClick={() => setShowAlert(false)}>
                {t("alert.no")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateSurvey;
