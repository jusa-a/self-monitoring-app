import * as summaryService from "../../services/summaryService.js";

//function for extracting week number from Date
Date.prototype.getWeek = function () {
    var d = new Date(this.getFullYear(), 0, 1);
    return Math.ceil(((this - d) / 86400000 + d.getDay() + 1) / 7);
};

const getData = async (id, request) => {
    const data = {
        userId: id,
        year_w: new Date().getFullYear(), //get current year by default
        week: new Date().getWeek() - 1 === 0 ? 52 : new Date().getWeek() - 1, //get last week by default
        year_m: new Date().getFullYear(), //get current year by default
        month: new Date().getMonth() === 0 ? 12 : new Date().getMonth(), //get last month by default
    };

    if (request) {
        const body = request.body();
        const params = await body.value;
        const date_w = params.get("week");
        const date_m = params.get("month");
        data.year_w = parseInt(date_w.split("W")[0]);
        data.week = parseInt(date_w.split("W")[1]);
        data.year_m = parseInt(date_m.split("-")[0]);
        data.month = parseInt(date_m.split("-")[1]);
    }

    const weekly = await getWeeklyAvg(data);
    const monthly = await getMonthlyAvg(data);
    const week = data.year_w + "-W" + ("00" + data.week).slice(-2);
    const month = data.year_m + "-" + ("00" + data.month).slice(-2);

    return { weekly: weekly, monthly: monthly, week: week, month: month };
};

const getWeeklyAvg = async (week, year) => {
    const avg = await summaryService.getWeeklyAvg(week, year);
    return avg;
};

const getMonthlyAvg = async (month, year) => {
    const avg = await summaryService.getMonthlyAvg(month, year);
    return avg;
};

const showSummary = async ({ render, session }) => {
    const logged = {
        loggedIn: await session.get("authenticated"),
        user: await session.get("user"),
    };
    const data = await getData(logged.user.id);

    render("summary.ejs", { data: data, logged: logged });
};

const updateSummary = async ({ request, render, session }) => {
    const logged = {
        loggedIn: await session.get("authenticated"),
        user: await session.get("user"),
    };
    const data = await getData(logged.user.id, request);

    render("summary.ejs", { data: data, logged: logged });
};

export { showSummary, updateSummary };
