import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import style from "./Surveys.module.css";

interface Question {
  id: string;
  type: string;
  text: string;
  options?: string[];
}

interface Survey {
  id: string;
  title: string;
  questions: Question[];
}

export default function SurveyPage() {
  let { id } = useParams();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [responses, setResponses] = useState<{ [key: string]: string }>({});

  const mockSurveys: Survey[] = [
    {
      id: "survey1",
      title: "Опрос по разработке",
      questions: [
        {
          id: "q1",
          type: "radio",
          text: "Каким фреймворком вы пользуетесь?",
          options: ["React", "Vue", "Angular"],
        },
        {
          id: "q2",
          type: "text",
          text: "Напишите ваш любимый язык программирования",
        },
      ],
    },
    {
      id: "survey2",
      title: "Опрос по фильмам",
      questions: [
        {
          id: "q1",
          type: "radio",
          text: "Какой ваш любимый жанр?",
          options: ["Боевик", "Комедия", "Драма"],
        },
        {
          id: "q2",
          type: "text",
          text: "Какой фильм последний раз смотрели?",
        },
      ],
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      const foundSurvey = mockSurveys.find((s) => s.id === id);
      if (foundSurvey) {
        setSurvey(foundSurvey);
      } else {
        setError("Опросник не найден");
      }
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleChange = (questionId: string, value: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    console.log("Ответы пользователя:", responses);
    alert("Спасибо за участие в опросе!");
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!survey) return <div>Опросник не найден</div>;

  return (
    <div className={style.container}>
      <h1 className={style.company_name}>АруукеFest.kg</h1>
      <h2 className={style.survey_name}>Тема: {survey.title}</h2>
      <form className={style.block} onSubmit={(e) => e.preventDefault()}>
        {survey.questions.map((q, index) => (
          <div key={q.id} className={style.block_2}>
            <p className={style.number_quest}>
              Вопрос {index + 1} / {survey.questions.length}
            </p>
            <p>{q.text}</p>
            {q.type === "radio" ? (
              q.options?.map((option) => (
                <label key={option}>
                  <input
                    type="radio"
                    name={q.id}
                    value={option}
                    checked={responses[q.id] === option}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                  />
                  {option}
                </label>
              ))
            ) : (
              <input
                type="text"
                className={style.input_text}
                placeholder="Введите ваш ответ"
                value={responses[q.id] || ""}
                onChange={(e) => handleChange(q.id, e.target.value)}
              />
            )}
          </div>
        ))}
        <div className={style.btn_submit}>
          <button onClick={handleSubmit} className={style.btn_main}>
            Отправить
          </button>
        </div>
      </form>
    </div>
  );
}
