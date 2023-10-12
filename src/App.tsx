import "./App.css";
import {Routes, Route} from "react-router-dom";
import MoviePage from "./components/pages/movie/MoviePage";
import LoginForm from "./components/pages/login/LoginForm";
import ProfileScreen from "./components/pages/profile/ProfileScreen";
import RegisterForm from "./components/pages/login/RegisterForm";
import MyListPage from "./components/pages/mylist/MyListPage";
import TVPage from "./components/pages/tv/TVPage";
import {useFirebaseContext} from "./context/FirebaseContext";

function App() {
    const {account, currentProfile} = useFirebaseContext();
    return (
        <Routes>
            <Route path="/" element={<LoginForm />}></Route>
            <Route path="/register" element={<RegisterForm></RegisterForm>}></Route>
            <Route path="/profiles" element={account ? <ProfileScreen /> : <LoginForm />}></Route>
            <Route path="/movies" element={currentProfile ? <MoviePage /> : <ProfileScreen />}></Route>
            <Route path="/mylist" element={currentProfile ? <MyListPage /> : <ProfileScreen />}></Route>
            <Route path="/tv" element={currentProfile ? <TVPage /> : <ProfileScreen />}></Route>
        </Routes>
    );
}

export default App;
