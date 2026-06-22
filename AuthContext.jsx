import { useContext, useEffect, useState, createContext } from "react";
import api from "./src/api";
import { useDispatch } from "react-redux";
import { setCredentials, setUserLoading } from "./src/redux/credentialsSlice";

export const AuthContext = createContext();

const initialSettings = {
  theme: null,
  menuCollapse: false,
};

const getSystemTheme = () => {
  return window.matchMedia("(prefers-color-scheme)").matches ? "dark" : "light";
};

const getStoredSettings = () => {
  const settings = localStorage.getItem("settings");
  return settings ? JSON.parse(settings) : initialSettings;
};

const saveSettings = (settings) => {
  localStorage.setItem("settings", JSON.stringify(settings));
};

export const ContextProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const set = getStoredSettings();
    return set || initialSettings;
  });

  // auth user
  // const [user, setUser] = useState(null);
  // const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const saveSettings = (settings) => {
    localStorage.setItem("settings", JSON.stringify(settings));
  };

  useEffect(() => {
    const theme = settings.theme || getSystemTheme();
    document.documentElement.setAttribute("data-theme", theme);
  }, [settings.theme]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = () => {
      setSettings((previous) => ({
        ...previous,
        theme: media.matches ? "dark" : "light",
      }));
    };

    handleThemeChange();
    media.addEventListener("change", handleThemeChange);

    return () => media.removeEventListener("change", handleThemeChange);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      dispatch(setUserLoading(true));
      try {
        const validatedUser = await api.get("/auth/validate", {
          withCredentials: true,
        });
        dispatch(
          setCredentials({
            user: validatedUser?.data?.data,
            token: validatedUser?.data?.token,
          }),
        );
        dispatch(setUserLoading(false));
      } catch (error) {
        //console.error(`Auth effect check error: `, error);
        dispatch(setCredentials(null));
        dispatch(setUserLoading(false));
      } finally {
        dispatch(setUserLoading(false));
      }
    };

    checkAuth();
  }, []);

  const setCollapse = () => {
    const init = settings;
    setSettings((previous) => ({
      ...previous,
      menuCollapse: !previous.menuCollapse,
    }));
    saveSettings({ ...init, menuCollapse: !init.menuCollapse });
  };

  const setCollapseWithValue = (value) => {
    const init = settings;
    setSettings((previous) => ({
      ...previous,
      menuCollapse: value,
    }));
    saveSettings({ ...init, menuCollapse: value });
  };

  // login function
  const login = (userData) => {
    dispatch(setCredentials(userData));
  };

  // logout function
  const logout = async () => {
    dispatch(setCredentials(null));
  };

  return (
    <AuthContext.Provider
      value={{
        settings,
        setCollapse,
        setCollapseWithValue,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
