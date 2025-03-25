import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Kontrollime, kas token on olemas enne eemaldamist
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      console.log("Token eemaldatud!");
    } else {
      console.log("Tokenit polnudki olemas!");
    }

    // Suuname kasutaja login lehele väikese viivitusega
    setTimeout(() => {
      navigate("/login");
    }, 500);
  }, [navigate]);

  return <h2>Logitakse välja...</h2>; // Kuvame teate, et toimub välja logimine
};

export default Logout;
