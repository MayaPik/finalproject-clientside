import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LoginScreen } from "./Pages/login/LoginScreen";
import { MainScreen } from "./Pages/main/MainScreen";
import { useStore } from "./store";
import "./App.css";

const App: React.FC = () => {
  const navigate = useNavigate();
  const server = useStore((state) => state.server);
  const setUser = useStore((state) => state.setUser);
  const setUsertype = useStore((state) => state.setUsertype);
  const isLoggedIn = useStore((state) => state.isLoggedIn);
  const setIsLoggedIn = useStore((state) => state.setIsLoggedIn);

  useEffect(() => {
    setUsertype(localStorage.getItem("usertype"));
  }, [setUsertype]);

  useEffect(() => {
    fetch(`${server}/api/user`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((user) => {
        console.log(user);
        setUser(user);
        setIsLoggedIn(true);
        if (user.adminid) {
          setUsertype("admin");
        } else if (user.childid) {
          setUsertype("child");
        } else if (user.guideid) {
          setUsertype("guide");
        }
      })
      .catch((error) => console.log(error));
  }, [setUser, setUsertype, setIsLoggedIn, server]);

  useEffect(() => {
    const checkUser = () => {
      if (isLoggedIn && window.location.pathname === "/") {
        window.location.href = "/main";
      } else if (!isLoggedIn) {
        navigate("/");
      }
    };
    checkUser();
  }, [isLoggedIn, navigate]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/main" element={<MainScreen />}></Route>
      </Routes>
    </Router>
  );
};

export default App;
