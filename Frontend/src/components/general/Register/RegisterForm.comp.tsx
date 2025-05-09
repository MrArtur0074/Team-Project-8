import { useEffect, useState } from "react";
import style from "../../../pages/Auth.page/Register/ChooseAccount/ChooseAccount.module.css";
import "../../../pages/Auth.page/common.style.css";

type Props = {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  username: string;
  setUsername: (val: string) => void;
  selectedRole: string;
  setValidateFn: (validateFn: () => boolean) => void;
};

export default function RegisterForm({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  username,
  setUsername,
  selectedRole,
  setValidateFn,
}: Props) {
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const validate = () => {
    let isValid = true;

    if (!email.trim()) {
      setEmailError("Пожалуйста, введите электронную почту");
      isValid = false;
    } else if (!email.includes("@gmail.com")) {
      setEmailError("Неверный формат электронной почты");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Пожалуйста, введите пароль");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Пожалуйста, подтвердите пароль");
      isValid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError("Пароли не совпадают");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    if (selectedRole === "MANAGER") {
      if (!username.trim()) {
        setUsernameError("Пожалуйста, введите имя пользователя");
        isValid = false;
      } else {
        setUsernameError("");
      }
    }

    return isValid;
  };

  useEffect(() => {
    console.log("Setting validate function");
    setValidateFn(() => validate);
  }, [email, password, confirmPassword, username, selectedRole]);

  return (
    <div className="container_auth">
      <div className="value_auth">
        <div id={style.box_auth}>
          <div>
            <label>Электронная почта</label>
            <input
              type="email"
              placeholder="Введите свою почту"
              value={email}
              className={style.inputt}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
            />
            {emailError && <p className="error">{emailError}</p>}
          </div>

          {selectedRole === "MANAGER" && (
            <div>
              <label>Имя пользователя</label>
              <input
                type="text"
                placeholder="Введите имя пользователя"
                value={username}
                className={style.inputt}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setUsernameError("");
                }}
              />
              {usernameError && <p className="error">{usernameError}</p>}
            </div>
          )}

          <div>
            <label>Пароль</label>
            <input
              type="password"
              placeholder="Введите пароль"
              value={password}
              className={style.inputt}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
              }}
            />
            {passwordError && <p className="error">{passwordError}</p>}
          </div>
          <div>
            <label>Подтвердите пароль</label>
            <input
              type="password"
              placeholder="Введите пароль снова"
              value={confirmPassword}
              className={style.inputt}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setConfirmPasswordError("");
              }}
            />
            {confirmPasswordError && (
              <p className="error">{confirmPasswordError}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
