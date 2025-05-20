import { Input } from "@mantine/core";
import style_feedback from "./Reviews.page.module.css";
import style from "../../pages/Dashboard.page/Dashboard.page.module.css";
import img_icon from "../../assets/common/icon_send.svg";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import img_user from "../../assets/common/AnonimoIcon.svg";
import { UserContext } from "../../App";
import { useTranslation } from "react-i18next";

interface Review {
  id: number;
  name: string;
  text: string;
  rating: number;
  read?: boolean;
}

export default function Reviews() {
  const [feedbackText, setFeedbackText] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [user] = useContext(UserContext);
  const { t } = useTranslation();

  // Получаем фидбэки при загрузке
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get<Review[]>(
        "http://16.171.3.5:8080/api/reviews"
      );
      setReviews(response.data);
    } catch (error) {
      console.error("Ошибка при получении фидбэков", error);
    }
  };

  const generateAnonymousName = () => {
    const randomId = Math.floor(1000 + Math.random() * 9000); // от 1000 до 9999
    return `anonymous${randomId}`;
  };

  const handleSend = async () => {
    if (feedbackText.trim().length < 2) return;

    try {
      const newReview = {
        name: generateAnonymousName(), // Генерируем имя
        text: feedbackText.trim(),
        rating: 0,
        read: false,
      };

      await axios.post("http://16.171.3.5:8080/api/reviews", newReview);
      setFeedbackText("");
      fetchReviews();
    } catch (error) {
      console.error("Ошибка при отправке фидбэка", error);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await axios.put(
        `http://16.171.3.5:8080/api/reviews/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      fetchReviews();
    } catch (error) {
      console.error("Ошибка при отметке фидбэка как прочитанного", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://16.171.3.5:8080/api/reviews/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      fetchReviews();
    } catch (error) {
      console.error("Ошибка при удалении фидбэка", error);
    }
  };

  return (
    <div className={style.container}>
      <h2 className={style_feedback.feedback_title}>{t("reviews.title")}</h2>
      <h3 className={style_feedback.feedback_subtitle}>{t("reviews.title")}</h3>
      <div className={style.search_dashboard}>
        <div className={style.search_dashboard_input}>
          <Input
            type="text"
            placeholder={t("reviews.leaveFeedback")}
            className={style_feedback.search_dashboard_input_input}
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            maxLength={150}
            minLength={2}
          />
          <button
            onClick={handleSend}
            className={style_feedback.search_dashboard_input_button}
          >
            <img src={img_icon} alt="send" />
          </button>
        </div>
      </div>

      <div className={style_feedback.feedback_list}>
        {reviews.map((review) => (
          <div key={review.id} className={style_feedback.feedback_item}>
            <img src={img_user} alt="" />
            <div className={style_feedback.feedback_content}>
              <strong>{review.name}</strong>
              <p>{review.text}</p>
            </div>
            {(user.role === "MANAGER" || user.role === "ADMIN") &&
              !review.read && (
                <div className={style_feedback.feedback_actions}>
                  <button
                    onClick={() => handleMarkAsRead(review.id)}
                    className={style_feedback.mark_read_button}
                    title={t("reviews.markAsRead")}
                  >
                    ✓
                  </button>
                </div>
              )}
            {user.role === "ADMIN" && (
              <button
                onClick={() => handleDelete(review.id)}
                className={style_feedback.delete_button}
                title={t("reviews.deleteReview")}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
