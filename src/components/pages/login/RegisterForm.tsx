import {FormEvent, useReducer} from "react";
import {useFirebaseContext} from "../../../context/FirebaseContext";
import {RegisterReducerAction, RegisterReducerState} from "../../../types/types";
import {useNavigate} from "react-router-dom";

const REGISTER_INITIAL_STATE = {
    email: "",
    password: "",
    confirmPassword: "",
    emailError: null,
    passwordError: null,
    confirmPasswordError: null,
};

const registerReducer = (state: RegisterReducerState, action: RegisterReducerAction) => {
    const {type, payload} = action;
    switch (type) {
        case "INPUT":
            return {
                ...state,
                [payload.name]: payload.value,
            };
        case "RESET":
            return REGISTER_INITIAL_STATE;
        default:
            return state;
    }
};

function RegisterForm() {
    const [registerState, dispatch] = useReducer(registerReducer, REGISTER_INITIAL_STATE);
    const {registerUser, error} = useFirebaseContext();
    const navigate = useNavigate();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const {email, password, confirmPassword} = registerState;
        let failed = false;
        if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
            dispatch({
                type: "INPUT",
                payload: {
                    name: "emailError",
                    value: "Invalid email",
                },
            });
            failed = true;
        }
        if (!failed) {
            dispatch({
                type: "INPUT",
                payload: {
                    name: "emailError",
                    value: null,
                },
            });
        }
        if (password.length < 6) {
            dispatch({
                type: "INPUT",
                payload: {
                    name: "passwordError",
                    value: "Password must be at least 6 characters",
                },
            });
            failed = true;
        }
        if (!failed) {
            dispatch({
                type: "INPUT",
                payload: {
                    name: "passwordError",
                    value: null,
                },
            });
        }
        if (confirmPassword !== password) {
            dispatch({
                type: "INPUT",
                payload: {
                    name: "confirmPasswordError",
                    value: "Passwords must match",
                },
            });
            failed = true;
        }
        if (!failed) {
            dispatch({
                type: "INPUT",
                payload: {
                    name: "confirmPasswordError",
                    value: null,
                },
            });
        }
        if (failed) return;
        registerUser(email, password);
    };

    return (
        <section className="flex min-w-full min-h-[100vh] relative">
            <div className="bg-[url('/login-backdrop.jpg')] bg-no-repeat brightness-[55%] absolute top-0 left-0 min-w-full min-h-[100vh]"></div>
            <img className="absolute top-6 left-6" src="/faketflix-logo.png" alt=""></img>
            <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[22rem] lg:w-[25rem] h-[35rem] bg-black bg-opacity-[80%] px-14 py-12 rounded">
                <div className="flex flex-col">
                    <h1 className="text-4xl text-white mb-10 font-semibold">Register</h1>
                    <form className="flex flex-col gap-3 mb-2" onSubmit={handleSubmit}>
                        <input
                            className="p-3 rounded-md bg-[#3B3B3B]"
                            placeholder="E-mail"
                            aria-label="email"
                            type="email"
                            value={registerState.email}
                            onChange={e => dispatch({type: "INPUT", payload: {name: "email", value: e.target.value}})}
                        ></input>
                        {registerState.emailError && (
                            <p className="text-sm text-red-500" aria-label="email-error">
                                {registerState.emailError}
                            </p>
                        )}
                        <input
                            className="p-3 rounded-md bg-[#3B3B3B]"
                            placeholder="Password"
                            aria-label="password"
                            type="password"
                            value={registerState.password}
                            onChange={e => dispatch({type: "INPUT", payload: {name: "password", value: e.target.value}})}
                        ></input>
                        {registerState.passwordError && (
                            <p className="text-sm text-red-500" aria-label="password-error">
                                {registerState.passwordError}
                            </p>
                        )}
                        <input
                            className="p-3 rounded-md bg-[#3B3B3B]"
                            placeholder="Confirm Password"
                            aria-label="confirm-password"
                            type="password"
                            value={registerState.confirmPassword}
                            onChange={e => dispatch({type: "INPUT", payload: {name: "confirmPassword", value: e.target.value}})}
                        ></input>
                        {registerState.confirmPasswordError && (
                            <p className="text-sm text-red-500" aria-label="confirm-password-error">
                                {registerState.confirmPasswordError}
                            </p>
                        )}
                        <button
                            type="submit"
                            aria-label="submit-button"
                            className="py-2.5 bg-[#e50914] rounded-md font-semibold hover:bg-opacity-50 active:scale-105 transition"
                        >
                            Register
                        </button>
                    </form>
                    {error && <div className="text-md text-red-500">{error}</div>}
                    <div className="flex justify-between mb-12">
                        <a href="/" className="hover:underline text-white">
                            Need help?
                        </a>
                    </div>
                    <div className="text-zinc-400">
                        Already registered?{" "}
                        <a href="#" className="text-white hover:underline" onClick={() => navigate("/")}>
                            Sign in.
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default RegisterForm;
