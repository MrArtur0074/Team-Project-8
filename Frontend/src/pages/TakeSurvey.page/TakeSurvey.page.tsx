import glob_style from "../Dashboard.page/Dashboard.page.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import style from "../CreateSurvey.page/CreateSurvey.module.css";
import style_take_surv from "./TakeSurvey.module.css";
import { usePrompt } from "../../hooks/useNavigationBlocker";
import { UserContext } from "../../App";

interface Option {
  id: number;
  text: string;
}

interface Question {
  id: number;
  text: string;
  type: string; // TEXT или MULTIPLE_CHOICE
  options?: Option[]; // Вот это используем вместо answers
}

interface Survey {
  id: number;
  title: string;
  description: string;
  questions: Question[];
}

interface Answer {
  question_id: number;
  content: string;
}

interface ValidationError {
  [key: number]: string;
}

export default function TakeSurvey() {
  const { id } = useParams();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [errors, setErrors] = useState<ValidationError>({});
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: number]: string;
  }>({});
  // const [user, setUser] = useContext(UserContext);
  const navigate = useNavigate();
  const isFormDirty = true;

  usePrompt(
    isFormDirty,
    "Вы уверены, что хотите уйти? Несохранённые изменения будут потеряны."
  );

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ""; // Это нужно оставить — чтобы браузер показал системный алерт
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.error("Нет токена, доступ запрещён");
      return;
    }

    axios
      .get(`http://localhost:8080/api/v1/surveys/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setSurvey(res.data))
      .catch((err) => console.error("Ошибка при получении опросника:", err));
  }, [id]);

  const validateAnswer = (
    questionId: number,
    content: string
  ): string | null => {
    if (!content.trim()) {
      return "Ответ не может быть пустым";
    }
    if (content.trim().length < 3) {
      return "Ответ должен содержать минимум 3 символа";
    }
    return null;
  };

  const handleAnswerChange = (questionId: number, content: string) => {
    const error = validateAnswer(questionId, content);
    setErrors((prev) => ({
      ...prev,
      [questionId]: error || "",
    }));

    setAnswers((prevAnswers) => {
      const updatedAnswers = prevAnswers.filter(
        (answer) => answer.question_id !== questionId
      );
      updatedAnswers.push({ question_id: questionId, content });
      return updatedAnswers;
    });
  };

  const handleRadioChange = (questionId: number, optionText: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionText,
    }));
    handleAnswerChange(questionId, optionText);
  };

  const handleSubmit = () => {
    if (!survey) return;

    const newErrors: ValidationError = {};
    let hasErrors = false;

    survey.questions.forEach((question) => {
      const answer = answers.find((a) => a.question_id === question.id);
      if (!answer) {
        if (
          question.type === "MULTIPLE_CHOICE" &&
          !selectedOptions[question.id]
        ) {
          newErrors[question.id] = "Пожалуйста, выберите один из вариантов";
        } else {
          newErrors[question.id] = "Ответ не может быть пустым";
        }
        hasErrors = true;
        return;
      }

      const error = validateAnswer(question.id, answer.content);
      if (error) {
        newErrors[question.id] = error;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      alert("Пожалуйста, исправьте ошибки в ответах перед отправкой.");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("Нет токена для отправки ответов");
      return;
    }

    const formattedAnswers = answers
      .map((a) => {
        const question = survey.questions.find((q) => q.id === a.question_id);

        if (!question) return null;

        const base = {
          answerContent: a.content,
          question: {
            id: question.id,
          },
        };

        if (question.type === "MULTIPLE_CHOICE") {
          const selectedOption = question.options?.find(
            (opt) => opt.text === a.content
          );
          return {
            ...base,
            selectedOptionId: selectedOption?.id ?? null,
          };
        }

        return base;
      })
      .filter(Boolean); // удаляет null

    axios
      .post(
        `http://localhost:8080/api/survey-responses/${survey?.id}`,
        formattedAnswers,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("Ответы отправлены:", response.data);
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Ошибка при отправке ответов:", error);
        alert(
          "Произошла ошибка при отправке ответов. Пожалуйста, попробуйте снова."
        );
      });
  };

  if (!survey) return <p>Загрузка...</p>;

  return (
    <div>
      <div className={glob_style.container}>
        <div id={style.container} style={{ marginBottom: "2rem" }}>
          <div className={style_take_surv.wrapper_head}>
            <h2 className={style_take_surv.title}>
              <strong>Тема опросника: </strong> {survey.title}
            </h2>
            <p className={style_take_surv.description}>
              <strong>Описание:</strong> {survey.description}
            </p>
          </div>

          <div className={style_take_surv.questions_container}>
            {survey.questions.map((q: Question, index) => (
              <div
                key={q.id}
                className={style.question_box}
                style={{ padding: "2rem 2rem" }}
              >
                <div className={style_take_surv.question_up_side}>
                  <p className={style_take_surv.title_input}>
                    <span>
                      Вопрос {index + 1} / {survey.questions.length}
                    </span>
                  </p>

                  <p className={style_take_surv.question}>{q.text}</p>
                </div>

                {q.type === "TEXT" ? (
                  <div>
                    <input
                      type="text"
                      placeholder="Введите ответ"
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      className={errors[q.id] ? style.input_error : ""}
                    />
                    {errors[q.id] && (
                      <p className={style.error_message}>{errors[q.id]}</p>
                    )}
                  </div>
                ) : q.type === "MULTIPLE_CHOICE" && q.options ? (
                  <div className={style_take_surv.radio_options}>
                    {q.options.map((opt) => (
                      <label
                        key={opt.id}
                        className={`${style_take_surv.radio_container} ${
                          selectedOptions[q.id] === opt.text
                            ? style_take_surv.selected
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          checked={selectedOptions[q.id] === opt.text}
                          onChange={() => handleRadioChange(q.id, opt.text)}
                        />
                        <span className={style_take_surv.custom_radio}></span>
                        <span className={style_take_surv.value_auth}>
                          {opt.text}
                        </span>
                      </label>
                    ))}

                    {errors[q.id] && (
                      <p className={style_take_surv.error_message}>
                        {errors[q.id]}
                      </p>
                    )}
                  </div>
                ) : (
                  <p>Тип вопроса не поддерживается</p>
                )}
              </div>
            ))}
          </div>

          <button className={style.btn_success} onClick={handleSubmit}>
            Отправить ответы
          </button>
        </div>
      </div>
    </div>
  );
}
