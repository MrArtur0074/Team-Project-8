import style from "./Settings.module.css";
import icon from "../../assets/common/AnonimoIcon.svg";
import { useNavigate } from "react-router-dom";
import { AuthContext, UserContext } from "../../App";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Modal from "../../components/general/Settings/Modal/Modal";

export default function Settings() {
  const navigate = useNavigate();

  const [_, setIsAuth] = useContext(AuthContext);
  const [user, setUser] = useContext(UserContext);

  // Состояние для управления открытием/закрытием модального окна
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState(user.username);
  const [newManagerCode, setNewManagerCode] = useState(user.managerCode);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsAuth(false);
    setUser({});
    navigate("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    axios
      .get("http://localhost:8080/api/v1/users/me")
      .then((res) => {
        setIsAuth(true);
        setUser(res.data);
      })
      .catch((error) => {
        console.error("Ошибка при получении профиля пользователя:", error);
        if (error.response?.status === 403) {
          localStorage.removeItem("access_token"); // Удаляем недействительный токен
          setIsAuth(false);
        }
      });
  }, []);

  const handleChangeInfo = () => {
    if (newPassword !== confirmPassword) {
      setPasswordMatchError("Пароли не совпадают");
      return;
    }
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.error("Нет токена, данные не могут быть обновлены");
      return;
    }

    axios
      .put(
        "http://localhost:8080/api/v1/users/me", // Поменяй на реальный эндпоинт для изменения данных
        {
          username: newUsername,
          managerCode: newManagerCode,
          password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setUser(res.data);
        setIsModalOpen(false); // Закрываем модальное окно после успешного обновления
      })
      .catch((error) => {
        console.error("Ошибка при изменении данных:", error);
      });
  };

  return (
    <div>
      <div className={style.container}>
        <div className={style.card}>
          <div className={style.logo_icon}>
            <img src={icon} alt="" />
          </div>
          <div className={style.info}>
            <h2>Мой Профиль</h2>
            <div>
              <div className={style.block}>
                <div>
                  <div className={style.up_side}>юзернейм:</div>
                  <div className={style.value}>{user.username}</div>
                </div>
                <div>
                  <div className={style.up_side}>роль:</div>
                  <div className={style.value}>{user.role}</div>
                </div>
              </div>
              <div className={style.block}>
                <div>
                  <div className={style.up_side}>менеджер код:</div>
                  <div className={style.value}>{user.managerCode}</div>
                </div>
                <div>
                  <div className={style.up_side}>пароль:</div>
                  <div className={style.value} style={{ paddingTop: "5px" }}>
                    * * * * *
                  </div>
                </div>
              </div>
            </div>
            <div className={style.btns}>
              <div
                className={style.btn_change_info}
                onClick={() => setIsModalOpen(true)} // Открытие модального окна
              >
                Изменить данные
              </div>
              <div className={style.btn_del_account} onClick={handleLogout}>
                Выйти из аккаунта
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className={style.modal_content}>
            <h3>Изменить данные</h3>
            <div className={style.content_settings}>
              <div>
                <label>
                  Юзернейм:
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                  />
                </label>
                <label>
                  Код менеджера:
                  <input
                    type="text"
                    value={newManagerCode}
                    onChange={(e) => setNewManagerCode(e.target.value)}
                  />
                </label>
              </div>
              <div>
                <label>
                  Новый пароль:
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </label>
                <label>
                  Подтверждение пароля:
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </label>
              </div>
            </div>
            {passwordMatchError && (
              <div style={{ color: "red" }}>{passwordMatchError}</div>
            )}
            <div className={style.modal_buttons}>
              <button
                className={style.btn_del_account}
                onClick={handleChangeInfo}
              >
                Сохранить
              </button>
              <button
                className={style.btn_del_account}
                onClick={() => setIsModalOpen(false)}
              >
                Закрыть
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
