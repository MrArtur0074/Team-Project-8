import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../../../../components/general/Auth/AuthLayout/AuthLayout.comp";
import RegisterForm from "../../../../components/general/Register/RegisterForm.comp";
import StepIndicator from "../../../../components/general/Register/StepIndicator.comp";
import RoleSelector from "../../../../components/general/Register/RoleSelector.comp";
import "../../common.style.css";
import style from "./ChooseAccount.module.css";
import style_btn_back from "../../../FAQ/FAQ.module.css";
import { UserContext, AuthContext } from "../../../../App";
import { useTranslation } from "react-i18next";

interface RegisteredUser {
  id: string | number;
  username: string;
  email: string;
  role: string;
  assigned_manager_code?: string;
}

export default function RegisterRoot() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<"MANAGER" | "USER">("MANAGER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [, setUserContext] = useContext(UserContext);
  const [isAuth, setIsAuth] = useContext(AuthContext);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const validateFormRef = useRef(() => true);
  const [user, setUser] = useState<RegisteredUser | null>(null);
  const [assignManagerCode, setAssignManagerCode] = useState("");
  const assignInputRef = useRef(null);
  const [assignStatus, setAssignStatus] = useState<string | null>(null);

  useEffect(() => {
    if (isAuth) {
      navigate("/dashboard");
    }
  }, [isAuth, navigate]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      console.log("/dashboard");
    }
  }, []);

  const handleSubmit = async () => {
    setIsSubmitted(true);
    if (!validateFormRef.current()) {
      return;
    }
    if (password !== confirmPassword) {
      setError(t("register.form.passwordsDontMatch"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Remove Authorization header for registration request
      delete axios.defaults.headers.common["Authorization"];
      const response = await axios.post(
        "http://16.171.3.5:8080/api/v1/auth/register",
        {
          email,
          username,
          password,
          role: selected.toUpperCase(),
        }
      );
      const { token, username: registeredUsername } = response.data;
      localStorage.setItem("access_token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // Fetch all users and find the registered user
      const usersResponse = await axios.get(
        "http://16.171.3.5:8080/api/v1/users"
      );
      const users: RegisteredUser[] = usersResponse.data;
      const user = users.find((u) => u.username === registeredUsername);
      if (user) {
        localStorage.setItem("user_id", String(user.id));
        localStorage.setItem("user", JSON.stringify(user));
        setUserContext(user);
        setIsAuth(true);
        console.log("Пользователь сохранен:", user);
        navigate("/dashboard");
      } else {
        setError("Пользователь не найден после регистрации");
      }
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        (err as Record<string, unknown>).response
      ) {
        const response = (err as Record<string, unknown>).response as {
          status: number;
        };
        if (response.status === 403) {
          setError(t("register.error.forbidden"));
        } else if (response.status === 400) {
          setError(t("register.error.invalidData"));
        } else {
          setError(t("register.error.server"));
        }
      } else if (
        err &&
        typeof err === "object" &&
        "request" in err &&
        (err as Record<string, unknown>).request
      ) {
        setError(t("register.error.noResponse"));
      } else {
        setError(t("register.error.general"));
      }
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignManager = async () => {
    if (user && user.role === "USER") {
      try {
        const response = await axios.put(
          `http://16.171.3.5:8080/api/v1/users/${user.id}/assigned_manager_code`,
          {
            assigned_manager_code: assignManagerCode,
          }
        );
        if (response.data.assigned_manager_code) {
          setUser(response.data);
          setAssignStatus("success");
          navigate("/dashboard");
        } else {
          setAssignStatus("error");
        }
      } catch {
        setAssignStatus("error");
      }
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
        title={t("register.title")}
        buttons={{
          next: {
            text: t("register.next"),
            onClick: async () => {},
            link: "/next-step",
          },
          prev: {
            link: "/previous-step",
            text: t("register.previous"),
          },
          relink: {
            link: "/relink",
            text: t("register.alreadyHaveAccount"),
          },
        }}
      >
        <div className="main">
          <StepIndicator />
          <div className="container_auth">
            <h3 className="step_auth" id="h3_auth">
              {t("register.fillData")}
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
            validateFormRef={validateFormRef}
            isSubmitted={isSubmitted}
          />
          <div className={style.wrapp_button_auth}>
            <button
              className={style.button_auth}
              onClick={async () => {
                setIsSubmitted(true);
                if (validateFormRef.current && validateFormRef.current()) {
                  await handleSubmit();
                }
              }}
              disabled={loading}
            >
              {loading ? t("register.loading") : t("register.register")}
            </button>

            <div className={style.relink_btn}>
              <a
                href="/login"
                className={style.relink_btn}
                style={{ background: "none" }}
              >
                {t("register.alreadyHaveAccount")}
              </a>
            </div>
          </div>
          {user && user.role === "USER" && (
            <div
              style={{
                marginTop: 32,
                padding: 24,
                border: "1.5px solid #acacac88",
                background: "#1a1e20",
              }}
            >
              <div style={{ marginBottom: 8, fontWeight: 600 }}>
                {t("settings.managerCode")}
              </div>
              <input
                ref={assignInputRef}
                type="text"
                value={user.assigned_manager_code || assignManagerCode}
                onChange={(e) => setAssignManagerCode(e.target.value)}
                placeholder={t("settings.managerCode")}
                style={{
                  padding: 8,
                  width: "100%",
                  borderRadius: 4,
                  border: "1px solid #ccc",
                  marginBottom: 8,
                }}
                disabled={!!user.assigned_manager_code}
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
                  cursor: user.assigned_manager_code
                    ? "not-allowed"
                    : "pointer",
                }}
                disabled={!!user.assigned_manager_code}
              >
                {t("settings.save")}
              </button>
              {assignStatus === "success" && (
                <div style={{ color: "#2e9962", marginTop: 8 }}>
                  Код успешно сохранён!
                </div>
              )}
            </div>
          )}
        </div>
      </AuthLayout>
    </div>
  );
}
