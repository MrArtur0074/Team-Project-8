import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../App";
import style from "../Dashboard.page/Dashboard.page.module.css";
import style_survey from "./CreateSurvey.module.css";
// import style_alert from "../../components/mainPage/Banner.comp/Banner.comp.module.css";
import img_icon from "../../assets/common/icon (3).svg";
import img_add from "../../assets/dashboard/Group 189.svg";

const CreateSurvey = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<any[]>([
    { type: "TEXT", text: "", choices: [] },
  ]);
  // const [showAlert, setShowAlert] = useState(false);
  // const [nextLocation, setNextLocation] = useState<string | null>(null);
  const navigate = useNavigate();
  const [user] = useContext(UserContext);

  if (!user || Object.keys(user).length === 0) {
    return <div>Загрузка пользователя...</div>;
  }

  const handleAddQuestion = () => {
    const newQuestion = { type: "TEXT", text: "", choices: [] };
    setQuestions([...questions, newQuestion]);
  };

  // const handleNavigateAway = (url: string) => {
  //   if (questions.length > 0 || title || description) {
  //     setShowAlert(true);
  //     setNextLocation(url);
  //   } else {
  //     navigate(url);
  //   }
  // };

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

  const handleSaveSurvey = () => {
    if (!user.username) return console.error("Нет пользователя");

    if (!title.trim() || questions.length === 0) {
      alert("Пожалуйста, добавьте название и хотя бы один вопрос.");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].text.trim()) {
        alert(`Пожалуйста, заполните текст для вопроса ${i + 1}`);
        return;
      }

      if (
        questions[i].type === "MULTIPLE_CHOICE" &&
        questions[i].choices.filter((c: string) => c.trim() !== "").length === 0
      ) {
        alert(`Добавьте хотя бы один вариант ответа для вопроса ${i + 1}`);
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
      .then(() => navigate("/dashboard"))
      .then(() => console.log(surveyData))
      .catch((err) => console.error("Ошибка:", err));
  };

  return (
    <div className={style.container}>
      <div className="survey-container" id={style_survey.container}>
        <div>
          <h3>Тема опросника</h3>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Введите название опросника"
          />
        </div>
        <div>
          <h3>Описание</h3>
          <textarea
            className="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Введите описание"
          />
        </div>

        <h2>Вопросы:</h2>
        <div className={style_survey.block}>
          {questions.map((q, i) => (
            <div className={style_survey.question_box} key={i}>
              <div>
                <div className={style_survey.head_survey}>
                  <label>{`Вопрос ${i + 1}`}</label>
                  <button
                    className={style_survey.btn_secondary}
                    onClick={() => handleRemoveQuestion(i)}
                  >
                    Удалить вопрос
                  </button>
                </div>
                <input
                  className="input"
                  value={q.text}
                  onChange={(e) => handleQuestionTextChange(i, e.target.value)}
                  placeholder="Введите вопрос"
                />
              </div>
              <div>
                <label>Тип вопроса</label>
                <select
                  className={style_survey.select}
                  style={{ background: "none" }}
                  value={q.type}
                  onChange={(e) => handleQuestionTypeChange(i, e.target.value)}
                >
                  <option value="TEXT">Текст</option>
                  <option value="MULTIPLE_CHOICE">Множественный выбор</option>
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
                        placeholder={`Вариант ${j + 1}`}
                        onChange={(e) =>
                          handleChoiceChange(i, j, e.target.value)
                        }
                      />
                      <button
                        className={style_survey.btn_del_answer}
                        style={{ marginLeft: "8px" }}
                        onClick={() => handleRemoveChoice(i, j)}
                      >
                        Убрать
                      </button>
                    </div>
                  ))}

                  <div
                    className={style_survey.btn_add_option}
                    onClick={() => handleAddChoice(i)}
                  >
                    Добавить вариант
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
            Добавить вопрос
          </button>
          <button
            className={style_survey.btn_success}
            onClick={handleSaveSurvey}
          >
            Сохранить опрос
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
    </div>
  );
};

export default CreateSurvey;
