
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
import Recipes from "./pages/recipePage";
import Logout from "./pages/logout";
import Home from "./pages/Home";
import Favorites from "./components/Favorites";


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
    </div>
  );
}

export default App;
