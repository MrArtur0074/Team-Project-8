import { useEffect, useState } from "react";
import style from "../../../pages/Auth.page/Register/ChooseAccount/ChooseAccount.module.css";
import "../../../pages/Auth.page/common.style.css";
import { useTranslation } from "react-i18next";

import { MutableRefObject } from "react";

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
  validateFormRef: MutableRefObject<() => boolean>;
  error: string;
  isSubmitted: boolean;
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
  validateFormRef,
  isSubmitted,
}: Props) {
  const { t } = useTranslation();
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const validate = () => {
    let isValid = true;

    // Проверяем email
    if (!email.trim()) {
      setEmailError(t("register.form.emailRequired"));
      isValid = false;
    } else if (!email.includes("@gmail.com")) {
      setEmailError(t("register.form.emailInvalid"));
      isValid = false;
    } else {
      setEmailError("");
    }

    // Проверяем пароль
    if (!password) {
      setPasswordError(t("register.form.passwordRequired"));
      isValid = false;
    } else {
      setPasswordError("");
    }

    // Проверяем подтверждение пароля
    if (!confirmPassword) {
      setConfirmPasswordError(t("register.form.confirmPasswordRequired"));
      isValid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError(t("register.form.passwordsDontMatch"));
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    // Проверяем имя пользователя для администратора
    if (selectedRole === "MANAGER") {
      if (!username.trim()) {
        setUsernameError(t("register.form.usernameRequired"));
        isValid = false;
      } else if (username.trim().length < 3) {
        setUsernameError(t("register.form.usernameMinLength"));
        isValid = false;
      } else {
        setUsernameError("");
      }
    }

    return isValid;
  };

  useEffect(() => {
    validateFormRef.current = validate;
    // eslint-disable-next-line
  }, [email, password, confirmPassword, username, selectedRole]);

  const handleFieldChange = (
    field: string,
    value: string,
    setter: (val: string) => void
  ) => {
    setter(value);
    // Ошибки обновятся при следующем isSubmitted
  };

  return (
    <div className="container_auth">
      <div className="value_auth">
        <div id={style.box_auth}>
          <div>
            <label>{t("register.form.email")}</label>
            <input
              type="email"
              placeholder={t("register.form.emailPlaceholder")}
              value={email}
              className={style.inputt}
              onChange={(e) =>
                handleFieldChange("email", e.target.value, setEmail)
              }
            />
            {isSubmitted && emailError && <p className="error">{emailError}</p>}
          </div>

          {selectedRole === "MANAGER" && (
            <div>
              <label>{t("register.form.username")}</label>
              <input
                type="text"
                placeholder={t("register.form.usernamePlaceholder")}
                value={username}
                className={style.inputt}
                onChange={(e) =>
                  handleFieldChange("username", e.target.value, setUsername)
                }
              />
              {isSubmitted && usernameError && (
                <p className="error">{usernameError}</p>
              )}
            </div>
          )}

          <div>
            <label>{t("register.form.password")}</label>
            <input
              type="password"
              placeholder={t("register.form.passwordPlaceholder")}
              value={password}
              className={style.inputt}
              onChange={(e) =>
                handleFieldChange("password", e.target.value, setPassword)
              }
            />
            {isSubmitted && passwordError && (
              <p className="error">{passwordError}</p>
            )}
          </div>
          <div>
            <label>{t("register.form.confirmPassword")}</label>
            <input
              type="password"
              placeholder={t("register.form.confirmPasswordPlaceholder")}
              value={confirmPassword}
              className={style.inputt}
              onChange={(e) =>
                handleFieldChange(
                  "confirmPassword",
                  e.target.value,
                  setConfirmPassword
                )
              }
            />
            {isSubmitted && confirmPasswordError && (
              <p className="error">{confirmPasswordError}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
