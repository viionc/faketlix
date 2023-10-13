import "./App.css";
import {Routes, Route} from "react-router-dom";
import MoviePage from "./components/pages/movie/MoviePage";
import LoginForm from "./components/pages/login/LoginForm";
import ProfilePage from "./components/pages/profile/ProfilePage";
import RegisterForm from "./components/pages/login/RegisterForm";
import MyListPage from "./components/pages/mylist/MyListPage";
import TVPage from "./components/pages/tv/TVPage";
import {useFirebaseContext} from "./context/FirebaseContext";
import SearchPage from "./components/pages/search/SearchPage";

function App() {
    const {account, currentProfile} = useFirebaseContext();
    return (
        <Routes>
            <Route path="/" element={<LoginForm />}></Route>
            <Route path="/register" element={<RegisterForm></RegisterForm>}></Route>
            <Route path="/profiles" element={account ? <ProfilePage /> : <LoginForm />}></Route>
            <Route path="/movies" element={currentProfile ? <MoviePage /> : account ? <ProfilePage /> : <LoginForm />}></Route>
            <Route path="/mylist" element={currentProfile ? <MyListPage /> : account ? <ProfilePage /> : <LoginForm />}></Route>
            <Route path="/tv" element={currentProfile ? <TVPage /> : account ? <ProfilePage /> : <LoginForm />}></Route>
            <Route path="/search" element={currentProfile ? <SearchPage /> : account ? <ProfilePage /> : <LoginForm />}></Route>
        </Routes>
    );
}

export default App;
