import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Navibar from "./components/navbar";
import LoginForm from "./pages/loginForm";
import SignUpForm from "./pages/signUpForm";
import AddRecipe from "./pages/AddRecipe";
import Logout from "./pages/logout";
import Home from "./pages/Home";
import Favorites from "./components/Favorites";
import Footer from "./components/footer";


function App() {
  return (
    <div className="App">
    <Router>
    <Navibar/>
      <Routes>
                <Route exact path="/home" element={<Home />} />
                <Route path="/favorites" element={<Favorites />} />
              
                <Route
                    path="/login"
                    element={<LoginForm />}
                />
                <Route
                    path="/sign-up"
                    element={<SignUpForm />}
                />
                <Route 
                  path="/add-recipe"
                  element= {<AddRecipe/>}
                  />
                  <Route
                    path="/logout"
                    element={<Logout />}
                />
            </Routes>
    </Router>
    <Footer />
    </div>
  );
}

export default App;
