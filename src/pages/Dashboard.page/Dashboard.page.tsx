import { useEffect, useState, useContext } from "react";
import style from "./Dashboard.page.module.css";
import style_alert from "../../components/mainPage/Banner.comp/Banner.comp.module.css";
import axios from "axios";
import { NavLink } from "react-router-dom";
import QuestionCard from "../../components/general/dashboard/questionCard/questionCard.comp";
import Input from "../../components/general/Input/Input";
import img1_icon from "../../assets/dashboard/Group 189.svg";
import img2_icon from "../../assets/dashboard/Group 190.svg";
import search from "../../assets/common/search.svg";
import { useNavigate } from "react-router-dom";
import { UserContext, LoadingContext } from "../../App";
import { useTranslation } from "react-i18next";

interface Survey {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  companyName: string;
}

const Dashboard = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [filteredSurveys, setFilteredSurveys] = useState<Survey[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [showAlert, setShowAlert] = useState(false);
  const [surveyToDelete, setSurveyToDelete] = useState<number | null>(null);
  const [isLoadingSurveys, setIsLoadingSurveys] = useState(true);
  const navigate = useNavigate();
  const [user] = useContext(UserContext);
  const isLoadingUser = useContext(LoadingContext);
  const { t } = useTranslation();

  // Функция поиска по названию
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = surveys.filter((survey) =>
      survey.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSurveys(filtered);
  };

  // Функция фильтрации
  const handleFilter = (filter: string) => {
    setActiveFilter(filter);
    let filtered = [...surveys];

    switch (filter) {
      case "new":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "old":
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      default:
        break;
    }

    if (searchQuery) {
      filtered = filtered.filter((survey) =>
        survey.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredSurveys(filtered);
  };

  const handleStartSurvey = (id: number) => {
    navigate(`/survey/${id}`);
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      axios
        .get("http://16.171.3.5:8080/api/v1/surveys")
        .then((response) => {
          if (Array.isArray(response.data)) {
            setSurveys(response.data);
            setFilteredSurveys(response.data);
          }
        })
        .catch((error) => {
          console.error("Ошибка:", error);
        })
        .finally(() => {
          setIsLoadingSurveys(false);
        });
    } else {
      setIsLoadingSurveys(false);
    }
  }, []);

  if (isLoadingUser || isLoadingSurveys) {
    return (
      <div className={style.container}>
        <p>{t("dashboard.loading")}</p>
      </div>
    );
  }

  const handleDeleteSurvey = (id: number) => {
    setSurveyToDelete(id); // Сохраняем ID опросника для удаления
    setShowAlert(true); // Показываем модальное окно
  };

  const confirmDelete = () => {
    if (surveyToDelete !== null) {
      // Check if user has permission to delete
      if (user.role !== "MANAGER" && user.role !== "ADMIN") {
        console.error("User does not have permission to delete surveys");
        setShowAlert(false);
        return;
      }

      const token = localStorage.getItem("access_token");
      console.log("Token from localStorage:", token); // Debug log

      if (!token) {
        console.error("No authorization token found");
        setShowAlert(false);
        return;
      }

      // Use the same axios instance configuration as in useEffect
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      axios
        .delete(`http://16.171.3.5:8080/api/v1/surveys/${surveyToDelete}`)
        .then(() => {
          setSurveys((prev) => prev.filter((s) => s.id !== surveyToDelete));
          setShowAlert(false);
          window.location.reload();
        })
        .catch((error) => {
          console.error("Ошибка при удалении опросника:", error);
          if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", error.response.data);
          }
          setShowAlert(false);
        });
    }
  };

  return (
    <div>
      <div className={style.container}>
        <div className={style.search_dashboard}>
          <div className={style.search_dashboard_input}>
            <Input
              type="text"
              placeholder={t("dashboard.search")}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              maxLength={50}
              minLength={2}
            />
            <button>
              <img src={search} alt="" />
            </button>
          </div>
          <div className={style.btns_search_dashboard}>
            <button
              onClick={() => handleFilter("new")}
              className={activeFilter === "new" ? style.active : ""}
            >
              {t("dashboard.new")}
            </button>
            <button
              onClick={() => handleFilter("old")}
              className={activeFilter === "old" ? style.active : ""}
            >
              {t("dashboard.old")}
            </button>
            {user.role === "USER" && (
              <>
                <button className={style.disabled} title={t("dashboard.soon")}>
                  {t("dashboard.notPassed")}
                </button>
                <button className={style.disabled} title={t("dashboard.soon")}>
                  {t("dashboard.passed")}
                </button>
              </>
            )}
          </div>
        </div>

        {user.role === "MANAGER" || user.role === "ADMIN" ? (
          <div className={style.head_dashboard}>
            <div>
              <NavLink to="/create_survey" className={style.btn_create_surv}>
                {t("dashboard.createSurvey")}
              </NavLink>
              <img src={img1_icon} alt="" />
            </div>
            <div>
              <NavLink to="/feedback" className={style.btn_create_surv}>
                {t("dashboard.analytics")}
              </NavLink>
              <img src={img2_icon} alt="" />
            </div>
          </div>
        ) : user.role === "USER" ? (
          <div className={style.head_dashboard_user}>
            <h3 style={{ marginBottom: "1rem" }}>
              {t("dashboard.yourSurveys")}
            </h3>
          </div>
        ) : null}

        <div>
          <div>
            {Array.isArray(filteredSurveys) && filteredSurveys.length > 0 ? (
              filteredSurveys.map((survey) => (
                <QuestionCard
                  key={survey.id}
                  id={survey.id}
                  title={survey.title}
                  info={survey.description}
                  date={new Date(survey.createdAt).toLocaleDateString("ru-RU")}
                  company_name={survey.companyName || t("dashboard.noName")}
                  onDelete={handleDeleteSurvey}
                  onStart={user.role === "USER" ? handleStartSurvey : undefined}
                />
              ))
            ) : (
              <p className={style.alert}>
                {searchQuery
                  ? t("dashboard.notFound", { query: searchQuery })
                  : t("dashboard.noSurveys")}
              </p>
            )}
          </div>
        </div>
      </div>

      {showAlert && (
        <div className={style_alert.alert_modal}>
          <div className={style_alert.alert_box}>
            <p>{t("dashboard.confirmDelete")}</p>
            <button onClick={confirmDelete}>{t("dashboard.yes")}</button>
            <button onClick={() => setShowAlert(false)}>
              {t("dashboard.no")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
