import { useEffect, useState } from "react";
import style from "./Dashboard.page.module.css";
import style_alert from "../../components/mainPage/Banner.comp/Banner.comp.module.css";
import axios from "axios";
import { NavLink } from "react-router-dom";
import QuestionCard from "../../components/general/dashboard/questionCard/questionCard.comp";
import img1_icon from "../../assets/dashboard/Group 189.svg";
import img2_icon from "../../assets/dashboard/Group 190.svg";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [surveys, setSurveys] = useState<any[]>([]); // Начальное состояние — пустой массив
  const [userRole, setUserRole] = useState<string>("");
  const [showAlert, setShowAlert] = useState(false); // Для показа модального окна
  const [surveyToDelete, setSurveyToDelete] = useState<number | null>(null); // ID опросника для удаления
  const [isLoading, setIsLoading] = useState(true); // добавим
  const navigate = useNavigate();

  const handleStartSurvey = (id: number) => {
    navigate(`/survey/${id}`);
  };
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      axios
        .get("http://localhost:8080/api/v1/users/me")
        .then((res) => {
          const role = res.data.role;
          setUserRole(role);

          return axios.get("http://localhost:8080/api/v1/surveys");
        })
        .then((response) => {
          if (Array.isArray(response.data)) {
            setSurveys(response.data);
          }
        })
        .catch((error) => {
          console.error("Ошибка:", error);
        })
        .finally(() => {
          setIsLoading(false); // теперь точно загрузка завершена
        });
    } else {
      setIsLoading(false); // если нет токена, тоже завершаем загрузку
    }
  }, []);

  console.log("Текущая роль:", userRole);
  console.log("Опросники:", surveys);

  const handleDeleteSurvey = (id: number) => {
    setSurveyToDelete(id); // Сохраняем ID опросника для удаления
    setShowAlert(true); // Показываем модальное окно
  };

  const confirmDelete = () => {
    if (surveyToDelete !== null) {
      axios
        .delete(`http://localhost:8080/api/v1/surveys/${surveyToDelete}`)
        .then(() => {
          setSurveys((prev) => prev.filter((s) => s.id !== surveyToDelete));
          setShowAlert(false); // Закрываем модальное окно после успешного удаления
        })
        .catch((error) => {
          console.error("Ошибка при удалении опросника:", error);
          setShowAlert(false); // Закрываем модальное окно в случае ошибки
        });
    }
  };
  if (isLoading) {
    return (
      <div className={style.container}>
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div>
      <div className={style.container}>
        {userRole === "MANAGER" || userRole === "ADMIN" ? (
          // для MANAGER и ADMIN
          <div className={style.head_dashboard}>
            <div>
              <NavLink to="/create_survey" className={style.btn_create_surv}>
                Создать опросник
              </NavLink>
              <img src={img1_icon} alt="" />
            </div>
            <div>
              <NavLink to="/analytics" className={style.btn_create_surv}>
                Общая аналитика
              </NavLink>
              <img src={img2_icon} alt="" />
            </div>
          </div>
        ) : userRole === "USER" ? (
          // только для USER
          <div className={style.head_dashboard_user}>
            <h2>Ваши опросники</h2>
          </div>
        ) : null}

        <div>
          <div>
            {Array.isArray(surveys) && surveys.length > 0 ? (
              surveys.map((survey) => (
                <QuestionCard
                  key={survey.id}
                  id={survey.id}
                  title={survey.title}
                  info={survey.description}
                  date={new Date(survey.createdAt).toLocaleDateString("ru-RU")}
                  company_name={survey.companyName || "Без названия"}
                  onDelete={handleDeleteSurvey}
                  onStart={userRole === "USER" ? handleStartSurvey : undefined}
                />
              ))
            ) : (
              <p className={style.alert}>Упс, нет доступных опросников</p>
            )}
          </div>
        </div>
      </div>

      {/* Модальное окно */}
      {showAlert && (
        <div className={style_alert.alert_modal}>
          <div className={style_alert.alert_box}>
            <p>Вы действительно хотите удалить опросник?</p>
            <button onClick={confirmDelete}>Да</button>
            <button onClick={() => setShowAlert(false)}>Нет</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
