import {cleanup, render} from "@testing-library/react";
import {describe, it, expect, afterEach} from "vitest";
import LoginForm from "../components/pages/login/LoginForm";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {FirebaseProvider} from "../context/FirebaseContext";
import user from "@testing-library/user-event";
import RegisterForm from "../components/pages/login/RegisterForm";

describe("login", () => {
    afterEach(() => {
        cleanup();
    });
    it("loginform", async () => {
        const form = render(
            <BrowserRouter>
                <FirebaseProvider>
                    <Routes>
                        <Route path="/" element={<LoginForm />}></Route>
                    </Routes>
                </FirebaseProvider>
            </BrowserRouter>
        );
        const email = (await form.findByLabelText("email")) as HTMLInputElement;
        await user.type(email, "a@a.pl");
        expect(email.value).toBe("a@a.pl");
        const password = (await form.findByLabelText("password")) as HTMLInputElement;
        await user.type(password, "123123");
        expect(password.value).toBe("123123");
    });

    it("registerform", async () => {
        const form = render(
            <BrowserRouter>
                <FirebaseProvider>
                    <RegisterForm></RegisterForm>
                </FirebaseProvider>
            </BrowserRouter>
        );
        //typing in inputs
        const email = (await form.findByLabelText("email")) as HTMLInputElement;
        await user.type(email, "a@a.pl");
        expect(email.value).toBe("a@a.pl");
        const password = (await form.findByLabelText("password")) as HTMLInputElement;
        await user.type(password, "123123");
        expect(password.value).toBe("123123");
        const confirmPassword = (await form.findByLabelText("confirm-password")) as HTMLInputElement;
        await user.type(confirmPassword, "12312");
        expect(confirmPassword.value).toBe("12312");

        //errors on wrong data
        const submitBtn = await form.findByLabelText("submit-button");

        await user.clear(password);
        await user.type(password, "123");
        await user.click(submitBtn);
        const passwordError = await form.findByLabelText("password-error");
        expect(passwordError).toBeDefined();
        await user.type(password, "123");
        await user.click(submitBtn);
        const confirmPasswordError = await form.findByLabelText("confirm-password-error");
        expect(confirmPasswordError).toBeDefined();
    });
});
