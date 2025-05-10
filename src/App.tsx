import "./common.css";
import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import { RouterProvider } from "react-router-dom";
import { routers } from "./app/routers.tsx";
import { createTheme, MantineProvider } from "@mantine/core";
import React, { useEffect, useState, createContext } from "react";
import axios from "axios";
import "./i18n/i18n.ts";

export const AuthContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>]
>([false, () => {}]);
export const UserContext = createContext<
  [any, React.Dispatch<React.SetStateAction<any>>]
>([{}, () => {}]);

export const LoadingContext = createContext<boolean>(false);

const theme = createTheme({});

const App = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    console.log("Токен при запуске:", token); // Для отладки
    if (!token) {
      setIsLoading(false);
      return;
    }

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
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <AuthContext.Provider value={[isAuth, setIsAuth]}>
        <UserContext.Provider value={[user, setUser]}>
          <LoadingContext.Provider value={isLoading}>
            <RouterProvider router={routers} />
          </LoadingContext.Provider>
        </UserContext.Provider>
      </AuthContext.Provider>
    </MantineProvider>
  );
};

export default App;
