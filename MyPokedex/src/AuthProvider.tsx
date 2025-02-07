import React from "react";
import { createContext, ReactNode, useContext, useState } from "react";
import toast from "react-hot-toast";

const SERVER_LOGIN_SERVICE_URL = import.meta.env.VITE_SERVER_LOGIN_API_URL;
const SERVER_SIGNUP_SERVICE_URL = import.meta.env.VITE_SERVER_SIGNUP_API_URL;

// TODO: CHECK WHAT HAPPENS WITH THIS INTERFACE

export interface AuthResponse {
  user?: { username: string; password: string };
  error?: string;
}

interface AuthContextType {
  isUserSignedIn: boolean;
  username: string | null;
  login: (username: string, password: string) => void; // ARROW FUNCTION USED FOR PARAMETER PASSING
  logout: () => void;
  signup: (username: string, password: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isUserSignedIn, setIsUserSignedIn] = useState<boolean>(
    !!localStorage.getItem("sessionId")
  );
  const [username, setUserName] = useState<string | null>(
    localStorage.getItem("userName")
  );

  React.useEffect(() => {
    const storedSession = localStorage.getItem("sessionId");
    const storedname = localStorage.getItem("userName");
    if (storedSession) {
      setIsUserSignedIn(true);
      setUserName(storedname);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      console.log(
        SERVER_LOGIN_SERVICE_URL + `?username=${username}&password=${password}`,
        username,
        password
      );

      const response = await fetch(SERVER_LOGIN_SERVICE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        toast.error("Failed to Sign In: " + response.status);
        return;
      }

      const data = await response.json();
      console.log("Login Response:", data);

      if (data.ResponseCode === 200) {
        localStorage.setItem("sessionId", data.sessionId);
        localStorage.setItem("userName", data.username);
        console.log("Stored Session:", data.sessionId);
        setUserName(data.username);
        setIsUserSignedIn(true);
        toast.success("Login successful!");
      } else {
        console.error("Invalid Credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = () => {
    setIsUserSignedIn(false);
    localStorage.removeItem("sessionId");
    localStorage.removeItem("userName");
    toast.success("Logged out successfully");
  };

  const signup = (username: string, password: string) => {
    toast.promise(
      fetch(SERVER_SIGNUP_SERVICE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      }).then((response) => {
        if (response.ok) {
          console.log("Welcome to MyPokedex");
        } else {
          console.error(response.statusText + " Failed to sign in");
        }
      }),
      {
        loading: "Signing you up",
        success: "Account created successfully",
        error: (error) => error.response.data.message,
      }
    );
  };

  return (
    <AuthContext.Provider
      value={{ isUserSignedIn, username, login, logout, signup }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
