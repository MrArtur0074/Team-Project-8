import style from "./Settings.module.css";
import icon from "../../assets/common/AnonimoIcon.svg";
import copy_icon from "../../assets/common/copy_icon.svg";
import { useNavigate } from "react-router-dom";
import { AuthContext, UserContext } from "../../App";
import { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import Modal from "../../components/general/Settings/Modal/Modal";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../../components/general/LanguageSwitcher/LanguageSwitcher";

export default function Settings() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [, setIsAuth] = useContext(AuthContext);
  const [user, setUser] = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState(user.username);
  const [newManagerCode, setNewManagerCode] = useState(user.managerCode);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [copied, setCopied] = useState(false);
  const [assignManagerCode, setAssignManagerCode] = useState("");
  const [assignStatus, setAssignStatus] = useState<string | null>(null);
  const assignInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsAuth(false);
    setUser({});
    navigate("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const id = localStorage.getItem("user_id");
    if (!token || !id) {
      setIsAuth(false);
      return;
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    axios
      .get(`http://16.171.3.5:8080/api/v1/users/${id}`)
      .then((res) => {
        setIsAuth(true);
        setUser(res.data);
      })
      .catch((error) => {
        console.error("Ошибка при получении профиля пользователя:", error);
        if (error.response?.status === 403) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_id");
          setIsAuth(false);
          navigate("/");
        }
      });
  }, []);

  const handleChangeInfo = () => {
    if (newPassword !== confirmPassword) {
      setPasswordMatchError("Пароли не совпадают");
      return;
    }
    const token = localStorage.getItem("access_token");
    const id = localStorage.getItem("user_id");

    if (!token || !id) {
      console.error("Нет токена или id, данные не могут быть обновлены");
      setIsAuth(false);
      navigate("/");
      return;
    }

    axios
      .put(
        `http://16.171.3.5:8080/api/v1/users/${id}`,
        {
          username: newUsername,
          email: user.email,
          password: newPassword || undefined,
          role: user.role,
          managerCode: newManagerCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setUser(res.data);
        setIsModalOpen(false);
        // Обновляем токен если он изменился
        if (res.data.token) {
          localStorage.setItem("access_token", res.data.token);
        }
      })
      .catch((error) => {
        console.error("Ошибка при изменении данных:", error);
        if (error.response?.status === 403) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_id");
          setIsAuth(false);
          navigate("/");
        }
      });
  };

  const handleAssignManager = async () => {
    setAssignStatus(null);
    const token = localStorage.getItem("access_token");
    if (!token) {
      setAssignStatus("no_token");
      return;
    }
    try {
      await axios.post(
        "http://16.171.3.5:8080/api/v1/users/assign-manager",
        { managerCode: assignManagerCode },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAssignStatus("success");
      setAssignManagerCode("");
      navigate("/dashboard");
      if (assignInputRef.current) assignInputRef.current.value = "";
    } catch (err) {
      setAssignStatus("error");
    }
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
                  <div
                    className={style.value}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {user.managerCode}
                    {(user.role === "MANAGER" || user.role === "ADMIN") && (
                      <button
                        className={style.copy_btn}
                        onClick={() => {
                          navigator.clipboard.writeText(user.managerCode);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 1500);
                        }}
                        title={t("settings.copy")}
                      >
                        <img
                          src={copy_icon}
                          alt="copy"
                          style={{ width: "18px", height: "18px" }}
                        />
                      </button>
                    )}
                    {(user.role === "MANAGER" || user.role === "ADMIN") &&
                      copied && (
                        <span style={{ color: "#2e9962", fontSize: "12px" }}>
                          {t("settings.copied")}
                        </span>
                      )}
                  </div>
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
        {user.role === "USER" && (
          <div
            style={{
              marginTop: 32,
              padding: 24,
              border: "1.5px solid #acacac88",
              background: "#1a1e20",
              // maxWidth: 700,
            }}
          >
            <div style={{ marginBottom: 8, fontWeight: 600 }}>
              {t("settings.managerCode")}
            </div>
            <input
              ref={assignInputRef}
              type="text"
              value={assignManagerCode}
              onChange={(e) => setAssignManagerCode(e.target.value)}
              placeholder={t("settings.managerCode")}
              style={{
                padding: 8,
                width: "100%",
                borderRadius: 4,
                border: "1px solid #ccc",
                marginBottom: 8,
              }}
            />
            <button
              onClick={handleAssignManager}
              style={{
                padding: "8px 20px",
                borderRadius: 4,
                background: "#237249",
                color: "#fff",
                border: "none",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {t("settings.save")}
            </button>
            {assignStatus === "success" && (
              <div style={{ color: "#2e9962", marginTop: 8 }}>
                {t("settings.copied")}
              </div>
            )}
            {assignStatus === "error" && (
              <div style={{ color: "#e03131", marginTop: 8 }}>
                {t("settings.passwordsDontMatch")}
              </div>
            )}
            {assignStatus === "no_token" && (
              <div style={{ color: "#e03131", marginTop: 8 }}>No token</div>
            )}
          </div>
        )}
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
