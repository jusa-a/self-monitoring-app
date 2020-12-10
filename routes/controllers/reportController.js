import * as reportService from "../../services/reportService.js";
import {
    validate,
    required,
    numberBetween,
    isInt,
    isDate,
    isFloat,
} from "../../deps.js";

const validationRulesMorning = {
    date: [required, isDate],
    sleepDuration: [required, numberBetween(0, 24)],
    sleepQuality: [required, numberBetween(1, 5), isInt],
    mood: [required, numberBetween(1, 5), isInt],
};

const validationRulesEvening = {
    date: [required, isDate],
    exerciseTime: [required, numberBetween(0, 24)],
    studyTime: [required, numberBetween(0, 24)],
    eatQuality: [required, numberBetween(1, 5), isInt],
    mood: [required, numberBetween(1, 5), isInt],
};

const checkExisting = async (data) => {
    const existingMorningReport = await reportService.getDuplicate(
        data,
        "morning"
    );
    const existingEveningReport = await reportService.getDuplicate(
        data,
        "evening"
    );
    if (existingMorningReport && existingEveningReport) {
        return "Morning and evening reports done for today";
    } else if (existingMorningReport) {
        return "Morning report done for today";
    } else if (existingEveningReport) {
        return "Evening report done for today";
    } else {
        return;
    }
};

const getData = async (id, params, request) => {
    const data = {
        userId: parseInt(id),
        date: new Date().toISOString().split("T")[0], //set default date to today
        type: "",
        sleepDuration: "",
        sleepQuality: "",
        exerciseTime: "",
        studyTime: "",
        eatQuality: "",
        mood: "",
        errors: {},
        notif: "",
    };

    data.notif = await checkExisting(data);

    if (params) {
        data.type = params.type;
    }

    if (request) {
        const body = request.body();
        const doc = await body.value;
        data.date = doc.get("date");
        data.sleepDuration = isNaN(parseFloat(doc.get("sleepDuration")))
            ? null
            : parseFloat(doc.get("sleepDuration"));
        data.sleepQuality = parseInt(doc.get("sleepQuality"));
        data.exerciseTime = isNaN(parseFloat(doc.get("exerciseTime")))
            ? null
            : parseFloat(doc.get("exerciseTime"));
        data.studyTime = isNaN(parseFloat(doc.get("studyTime")))
            ? null
            : parseFloat(doc.get("studyTime"));
        data.eatQuality = parseInt(doc.get("eatQuality"));
        data.mood = parseInt(doc.get("mood"));
    }
    return data;
};

const showReportForm = async ({ params, render, response, session }) => {
    const logged = {
        loggedIn: await session.get("authenticated"),
        user: await session.get("user"),
    };
    let data = {};

    if (params.type) {
        data = await getData(logged.user.id, params);
    } else {
        data = await getData(logged.user.id);
    }
    render("reporting.ejs", { data: data, logged: logged });
};

const postReport = async ({ params, request, render, response, session }) => {
    const logged = {
        loggedIn: await session.get("authenticated"),
        user: await session.get("user"),
    };
    const data = await getData(logged.user.id, params, request);

    if (params.type === "morning") {
        const [passes, errors] = await validate(data, validationRulesMorning);
        if (!passes) {
            data.errors = errors;
            render("reporting.ejs", { data: data, logged: logged });
            return;
        }
        await reportService.addMorningReport(data);
    } else {
        const [passes, errors] = await validate(data, validationRulesEvening);
        if (!passes) {
            data.errors = errors;
            render("reporting.ejs", { data: data, logged: logged });
            return;
        }
        await reportService.addEveningReport(data);
    }
    response.redirect("/behavior/reporting");
};

export { showReportForm, postReport };
