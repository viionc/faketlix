import {FormEvent, useState} from "react";
import {useFirebaseContext} from "../../context/FirebaseContext";

function RegisterForm() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const {registerUser, setFormTypeOpen} = useFirebaseContext();
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        registerUser(email, password);
    };

    return (
        <section className="flex min-w-full min-h-[100vh] relative">
            <div className="bg-[url('/login-backdrop.jpg')] bg-no-repeat brightness-[55%] absolute top-0 left-0 min-w-full min-h-[100vh]"></div>
            <img className="absolute top-6 left-6" src="/faketflix-logo.png" alt=""></img>
            <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[25rem] h-[35rem] bg-black bg-opacity-[80%] px-14 py-12 rounded">
                <div className="flex flex-col">
                    <h1 className="text-4xl text-white mb-10 font-semibold">Register</h1>
                    <form className="flex flex-col gap-3 mb-2" onSubmit={handleSubmit}>
                        <input
                            className="p-3 rounded-md"
                            placeholder="E-mail"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        ></input>
                        <input
                            className="p-3 rounded-md"
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        ></input>
                        <input
                            className="p-3 rounded-md"
                            placeholder="Confirm Password"
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        ></input>
                        <button
                            type="submit"
                            className="py-2.5 bg-[#e50914] rounded-md font-semibold hover:bg-opacity-50 active:scale-105 transition"
                        >
                            Register
                        </button>
                    </form>
                    <div className="flex justify-between mb-12">
                        <a href="/" className="hover:underline text-white">
                            Need help?
                        </a>
                    </div>
                    <div className="text-zinc-400">
                        Already registered?{" "}
                        <a href="#" className="text-white hover:underline" onClick={() => setFormTypeOpen("LOGIN")}>
                            Sign in.
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default RegisterForm;
