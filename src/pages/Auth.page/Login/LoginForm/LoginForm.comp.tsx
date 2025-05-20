import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import style from "./LoginForm.module.css";
import "../../common.style.css";
import AuthLayout from "../../../../components/general/Auth/AuthLayout/AuthLayout.comp";
import style_auth from "../../../../components/general/Auth/AuthHeader/AuthHeader.module.css";
import style_btn_back from "../../../FAQ/FAQ.module.css";

import { AuthContext, UserContext } from "../../../../App";
import { useTranslation } from "react-i18next";

interface User {
  username: string;
  role: string;
}

export default function LoginForm() {
  const { t } = useTranslation();
  const [, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [commonError, setCommonError] = useState("");
  const navigate = useNavigate();

  const [isAuth, setIsAuth] = useContext(AuthContext);
  const [, setUserContext] = useContext(UserContext);

  useEffect(() => {
    if (isAuth) {
      navigate("/dashboard");
    }
  }, [isAuth, navigate]);

  const validate = () => {
    let isValid = true;

    if (!username.trim()) {
      setUsernameError(t("login.usernameRequired"));
      isValid = false;
    } else {
      setUsernameError("");
    }

    if (!password.trim()) {
      setPasswordError(t("login.passwordRequired"));
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validate()) {
      return;
    }

    try {
      setCommonError("");
      const authResponse = await axios.post(
        "http://16.171.3.5:8080/api/v1/auth/authenticate",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const token = authResponse.data.token;
      localStorage.setItem("access_token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Fetch all users and find the logged-in user
      const usersResponse = await axios.get(
        "http://16.171.3.5:8080/api/v1/users"
      );
      const users = usersResponse.data;
      const user = users.find((u: any) => u.username === username);
      if (user) {
        localStorage.setItem("user_id", user.id);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        setUserContext(user);
        setIsAuth(true);
        navigate("/dashboard");
      } else {
        setCommonError("Пользователь не найден после входа");
      }
    } catch (error) {
      console.error("Ошибка входа:", error);
      setCommonError(t("login.error"));
    }
  };

  return (
    <div style={{ background: "none" }}>
      <button
        onClick={() => navigate("/")}
        className={style_btn_back.backButton}
        id={style.back_btn}
      >
        ←
      </button>
      <AuthLayout
        title={t("login.title")}
        buttons={{
          next: { text: t("login.login"), onClick: handleLogin },
          prev: { link: "/register", text: t("login.back") },
          relink: { link: "/register", text: t("login.createAccount") },
        }}
      >
        <div className="main">
          <div className={style_auth.progressContainer}>
            <div className={style_auth.step} id={style.active}>
              <span className={style_auth.stepText_login}>
                {t("login.enterAccount")}
              </span>
            </div>
          </div>

          <div className="container_auth">
            <h3 className="step_auth" id="h3_auth">
              {t("login.enterAccount")}
            </h3>
          </div>

          <div className="value_auth">
            <div id={style.box_auth}>
              <div id={style.form_auth}>
                <div>
                  <label>{t("login.username")}</label>
                  <input
                    type="text"
                    placeholder={t("login.usernamePlaceholder")}
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setUsernameError("");
                    }}
                  />
                  {usernameError && <p className="error">{usernameError}</p>}
                </div>

                <div>
                  <label>{t("login.password")}</label>
                  <input
                    type="password"
                    placeholder={t("login.passwordPlaceholder")}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                    }}
                  />
                  {passwordError && <p className="error">{passwordError}</p>}
                </div>
              </div>

              {commonError && (
                <p style={{ color: "red", textAlign: "center" }}>
                  {commonError}
                </p>
              )}

              <div className={style.wrapp_button_auth}>
                <button className={style.button_auth} onClick={handleLogin}>
                  {t("login.login")}
                </button>
                <div className={style.relink_btn}>
                  <a
                    href="/register"
                    className={style.relink_btn}
                    style={{ background: "none", textAlign: "center" }}
                  >
                    {t("login.noAccount")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthLayout>
    </div>
  );
}
