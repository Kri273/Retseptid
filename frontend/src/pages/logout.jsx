import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      console.log("Token eemaldatud!");
    } else {
      console.log("Tokenit polnudki olemas!");
    }

    setTimeout(() => {
      navigate("/login");
    }, 500);
  }, [navigate]);

  return <h2>Logitakse välja...</h2>;
};

export default Logout;
