import "./App.css";
import {Routes, Route} from "react-router-dom";
import MoviePage from "./components/pages/movie/MoviePage";
import LoginForm from "./components/pages/login/LoginForm";
import ProfilePage from "./components/pages/profile/ProfilePage";
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
            <Route path="/profiles" element={account ? <ProfilePage /> : <LoginForm />}></Route>
            <Route path="/movies" element={currentProfile ? <MoviePage /> : <ProfilePage />}></Route>
            <Route path="/mylist" element={currentProfile ? <MyListPage /> : <ProfilePage />}></Route>
            <Route path="/tv" element={currentProfile ? <TVPage /> : <ProfilePage />}></Route>
        </Routes>
    );
}

export default App;
