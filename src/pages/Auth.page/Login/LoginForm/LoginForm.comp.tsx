import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import style from "./LoginForm.module.css";
import "../../common.style.css";
import AuthLayout from "../../../../components/general/Auth/AuthLayout/AuthLayout.comp";
import style_auth from "../../../../components/general/Auth/AuthHeader/AuthHeader.module.css";
import { AuthContext, UserContext } from "../../../../App";

interface User {
  username: string;
  role: string;
}

export default function LoginForm() {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [commonError, setCommonError] = useState("");
  const navigate = useNavigate();

  const [isAuth] = useContext(AuthContext);
  const [, setUserContext] = useContext(UserContext);

  useEffect(() => {
    if (isAuth) {
      navigate("/dashboard");
    }
  }, [isAuth, navigate]);

  const validate = () => {
    let isValid = true;

    if (!username.trim()) {
      setUsernameError("Пожалуйста, введите юзернейм");
      isValid = false;
    } else {
      setUsernameError("");
    }

    if (!password.trim()) {
      setPasswordError("Пожалуйста, введите пароль");
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
        "http://localhost:8080/api/v1/auth/authenticate",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const token = authResponse.data.token;
      localStorage.setItem("access_token", token);

      const userResponse = await axios.get(
        "http://localhost:8080/api/v1/users/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const userData = userResponse.data;
      setUser(userData);
      setUserContext(userData);
      setIsAuth(true);
      navigate("/dashboard");
    } catch (error) {
      console.error("Ошибка входа:", error);
      setCommonError("Неверные данные. Попробуйте снова.");
    }
  };

  return (
    <div style={{ background: "none" }}>
      <AuthLayout
        title="Авторизация"
        buttons={{
          next: { text: "Войти", onClick: handleLogin },
          prev: { link: "/register", text: "Вернуться" },
          relink: { link: "/register", text: "Создать аккаунт" },
        }}
      >
        <div className="main">
          <div className={style_auth.progressContainer}>
            <div className={style_auth.step} id={style.active}>
              <span className={style_auth.stepText_login}>Вход в систему</span>
            </div>
          </div>

          <div className="container_auth">
            <h3 className="step_auth" id="h3_auth">
              Войдите в свой аккаунт
            </h3>
          </div>

          <div className="value_auth">
            <div id={style.box_auth}>
              <div id={style.form_auth}>
                <div>
                  <label>Юзернейм</label>
                  <input
                    type="text"
                    placeholder="Введите свой юзернейм"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setUsernameError("");
                    }}
                  />
                  {usernameError && <p className="error">{usernameError}</p>}
                </div>

                <div>
                  <label>Пароль</label>
                  <input
                    type="password"
                    placeholder="Введите пароль"
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
                  Войти
                </button>
                <div className={style.relink_btn}>
                  <a
                    href="/register"
                    className={style.relink_btn}
                    style={{ background: "none", textAlign: "center" }}
                  >
                    Все еще нет аккаунта?
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
