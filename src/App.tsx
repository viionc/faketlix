import "./App.css";
import Content from "./components/Content";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import {useFirebaseContext} from "./context/FirebaseContext";

function App() {
    const {formTypeOpen} = useFirebaseContext();
    return (
        <>
            {formTypeOpen === "LOGIN" && <LoginForm></LoginForm>}
            {formTypeOpen === "REGISTER" && <RegisterForm></RegisterForm>}
            {formTypeOpen === null && <Content></Content>}
        </>
    );
}

export default App;
