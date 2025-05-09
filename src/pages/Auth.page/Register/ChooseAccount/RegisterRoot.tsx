import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../../../../components/general/Auth/AuthLayout/AuthLayout.comp";
import RegisterForm from "../../../../components/general/Register/RegisterForm.comp";
import StepIndicator from "../../../../components/general/Register/StepIndicator.comp";
import RoleSelector from "../../../../components/general/Register/RoleSelector.comp";
import "../../common.style.css";
import style from "./ChooseAccount.module.css";

export default function RegisterRoot() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<"MANAGER" | "USER">("MANAGER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validateForm, setValidateForm] = useState<() => boolean>(
    () => () => true
  );

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      console.log("/dashboard");
    }
  }, []);

  const handleSubmit = async () => {
    // e.preventDefault();
    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/auth/register",
        {
          email,
          username,
          password,
          role: selected.toUpperCase(),
        }
      );

      localStorage.setItem("access_token", response.data.token);

      axios.defaults.headers.common["Authorization"] =
        `Bearer ${response?.data?.token}`;
      const userResponse = await axios.get(
        "http://localhost:8080/api/v1/users/me"
      );

      localStorage.setItem("user", JSON.stringify(userResponse.data));
      console.log("Пользователь сохранен:", localStorage.getItem("user"));
      navigate("/dashboard");
    } catch (err) {
      setError("Ошибка при регистрации");
      console.error(err);
    }
  };

  return (
    <div style={{ background: "none" }}>
      <AuthLayout
        title="Регистрация"
        buttons={{
          next: {
            text: "Next",
            onClick: async () => {},
            link: "/next-step",
          },
          prev: {
            link: "/previous-step",
            text: "Previous",
          },
          relink: {
            link: "/relink",
            text: "Relink",
          },
        }}
      >
        <div className="main">
          <StepIndicator />
          <div className="container_auth">
            <h3 className="step_auth" id="h3_auth">
              Заполните данные для регистрации
            </h3>
          </div>
          <RoleSelector selected={selected} setSelected={setSelected} />
          <RegisterForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            username={username}
            setUsername={setUsername}
            error={error}
            selectedRole={selected}
            setValidateFn={setValidateForm} // <-- передаем сюда
          />
          <div className={style.wrapp_button_auth}>
            <button
              className={style.button_auth}
              onClick={async () => {
                if (validateForm()) {
                  // сначала валидируем
                  await handleSubmit(); // если все ок, отправляем
                }
              }}
              disabled={loading}
            >
              {loading ? "Загружается..." : "Зарегистрироваться"}
            </button>

            <div className={style.relink_btn}>
              <a
                href="/login"
                className={style.relink_btn}
                style={{ background: "none" }}
              >
                Уже есть аккаунт?
              </a>
            </div>
          </div>
        </div>
      </AuthLayout>
    </div>
  );
}
