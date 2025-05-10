import style from "./Settings.module.css";
import icon from "../../assets/common/AnonimoIcon.svg";
import { useNavigate } from "react-router-dom";
import { AuthContext, UserContext } from "../../App";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Modal from "../../components/general/Settings/Modal/Modal";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../../components/general/LanguageSwitcher/LanguageSwitcher";

export default function Settings() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [, setIsAuth] = useContext(AuthContext);
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

    // Debug logs
    console.log("Current token:", token);
    console.log("Request data:", {
      id: user.id,
      username: newUsername,
      email: user.email,
      password: newPassword,
      role: user.role,
      managerCode: newManagerCode,
      enabled: user.enabled,
      authorities: user.authorities,
      accountNonExpired: user.accountNonExpired,
      credentialsNonExpired: user.credentialsNonExpired,
      accountNonLocked: user.accountNonLocked,
    });
    console.log("Authorization header:", `Bearer ${token}`);

    if (!token) {
      console.error("Нет токена, данные не могут быть обновлены");
      return;
    }

    axios
      .put(
        "http://localhost:8080/api/v1/users/me",
        {
          id: user.id,
          username: newUsername,
          email: user.email,
          password: newPassword,
          role: user.role,
          managerCode: newManagerCode,
          enabled: user.enabled,
          authorities: user.authorities,
          accountNonExpired: user.accountNonExpired,
          credentialsNonExpired: user.credentialsNonExpired,
          accountNonLocked: user.accountNonLocked,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("Success response:", res.data);
        setUser(res.data);
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error("Ошибка при изменении данных:", error);
        console.error("Error response data:", error.response?.data);
        console.error("Error status:", error.response?.status);
        console.error("Error headers:", error.response?.headers);
      });
  };

  return (
    <div>
      <div className={style.container}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 16,
          }}
        >
          <LanguageSwitcher />
        </div>
        <div className={style.card}>
          <div className={style.logo_icon}>
            <img src={icon} alt="" />
          </div>
          <div className={style.info}>
            <h2>{t("settings.myProfile")}</h2>
            <div>
              <div className={style.block}>
                <div>
                  <div className={style.up_side}>{t("settings.username")}</div>
                  <div className={style.value}>{user.username}</div>
                </div>
                <div>
                  <div className={style.up_side}>{t("settings.role")}</div>
                  <div className={style.value}>{user.role}</div>
                </div>
              </div>
              <div className={style.block}>
                <div>
                  <div className={style.up_side}>
                    {t("settings.managerCode")}
                  </div>
                  <div className={style.value}>{user.managerCode}</div>
                </div>
                <div>
                  <div className={style.up_side}>{t("settings.password")}</div>
                  <div className={style.value} style={{ paddingTop: "5px" }}>
                    * * * * *
                  </div>
                </div>
              </div>
            </div>
            <div className={style.btns}>
              <div
                className={style.btn_change_info}
                onClick={() => setIsModalOpen(true)}
              >
                {t("settings.editData")}
              </div>
              <div className={style.btn_del_account} onClick={handleLogout}>
                {t("settings.logout")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className={style.modal_content}>
            <h3>{t("settings.editData")}</h3>
            <div className={style.content_settings}>
              <div>
                <label>
                  {t("settings.username")}:
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                  />
                </label>
                <label>
                  {t("settings.managerCode")}:
                  <input
                    type="text"
                    value={newManagerCode}
                    onChange={(e) => setNewManagerCode(e.target.value)}
                  />
                </label>
              </div>
              <div>
                <label>
                  {t("settings.newPassword")}:
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </label>
                <label>
                  {t("settings.confirmPassword")}:
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </label>
              </div>
            </div>
            {passwordMatchError && (
              <div style={{ color: "red" }}>
                {t("settings.passwordsDontMatch")}
              </div>
            )}
            <div className={style.modal_buttons}>
              <button
                className={style.btn_del_account}
                onClick={handleChangeInfo}
              >
                {t("settings.save")}
              </button>
              <button
                className={style.btn_del_account}
                onClick={() => setIsModalOpen(false)}
              >
                {t("settings.close")}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
