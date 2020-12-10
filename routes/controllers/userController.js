import * as userService from "../../services/userService.js";
import { bcrypt } from "../../deps.js";
import { validate, required, isEmail, minLength } from "../../deps.js";

const validationRules = {
    email: [required, isEmail],
    password: [required, minLength(4)],
};

const getRegisterData = async (request) => {
    const data = {
        email: "",
        errors: {},
    };

    if (request) {
        const body = request.body();
        const params = await body.value;
        data.email = params.get("email");
        data.password = params.get("password");
        data.verification = params.get("verification");
    }
    return data;
};

const getLoginData = async (request) => {
    const data = {
        errors: {},
    };

    if (request) {
        const body = request.body();
        const params = await body.value;
        data.email = params.get("email");
        data.password = params.get("password");
    }
    return data;
};

const showRegistrationForm = async ({ render }) => {
    const data = await getRegisterData();
    render("register.ejs", { data: data });
};

const postRegistrationForm = async ({ request, response, render }) => {
    const data = await getRegisterData(request);
    const [passes, errors] = await validate(data, validationRules);

    if (!passes) {
        data.errors = errors;
    }

    if (data.password !== data.verification) {
        data.errors.match = { match: "Entered passwords did not match" };
    }

    const existingUsers = await userService.getUser(data.email);
    if (existingUsers[0]) {
        data.errors.reserved = { reserved: "Email is already reserved." };
    }

    if (Object.keys(data.errors).length > 0) {
        render("register.ejs", { data: data });
        return;
    }

    const hash = await bcrypt.hash(data.password);
    await userService.addUser(data.email, hash);
    response.redirect("/auth/login");
};

const showLoginForm = async ({ render }) => {
    const data = await getLoginData();
    render("login.ejs", { data: data });
};

const postLoginForm = async ({ request, render, response, session }) => {
    const data = await getLoginData(request);
    const res = await userService.getUser(data.email);
    if (!res[0]) {
        data.errors.err = { err: "Invalid email or password" };
        render("login.ejs", { data: data });
        return;
    }

    const user = res[0];
    const hash = user.password;
    const passwordCorrect = await bcrypt.compare(data.password, hash);
    if (!passwordCorrect) {
        data.errors.err = { err: "Invalid email or password" };
        render("login.ejs", { data: data });
        return;
    }

    await session.set("authenticated", true);
    await session.set("user", {
        id: user.id,
        email: user.email,
    });
    response.redirect("/");
};

const logOut = async ({ session, response }) => {
    await session.set("authenticated", false);
    await session.set("user", {
        id: "",
        email: "",
    });
    response.redirect("/");
};

export {
    showRegistrationForm,
    postRegistrationForm,
    showLoginForm,
    postLoginForm,
    logOut,
};
