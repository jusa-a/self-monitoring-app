import { executeQuery } from "../database/database.js";

const getWeeklyAvg = async (data) => {
    const res = await executeQuery(
        "SELECT ROUND(AVG(sleep_duration), 1) AS sd, " +
            "ROUND(AVG(sleep_quality), 1) AS sq, " +
            "ROUND(AVG(exercise_time), 1) AS et, " +
            "ROUND(AVG(study_time), 1) AS st, " +
            "ROUND(AVG(eat_quality), 1) AS eq, " +
            "ROUND(AVG(mood), 1) AS md " +
            "FROM reports WHERE EXTRACT(WEEK FROM date) = $1 AND EXTRACT(YEAR FROM date) = $2 AND user_id = $3;",
        data.week,
        data.year_w,
        data.userId
    );
    return res.rowsOfObjects()[0];
};

const getMonthlyAvg = async (data) => {
    const res = await executeQuery(
        "SELECT ROUND(AVG(sleep_duration), 1) AS sd, " +
            "ROUND(AVG(sleep_quality), 1) AS sq, " +
            "ROUND(AVG(exercise_time), 1) AS et, " +
            "ROUND(AVG(study_time), 1) AS st, " +
            "ROUND(AVG(eat_quality), 1) AS eq, " +
            "ROUND(AVG(mood), 1) AS md " +
            "FROM reports WHERE EXTRACT(MONTH FROM date) = $1 AND EXTRACT(YEAR FROM date) = $2 AND user_id = $3;",
        data.month,
        data.year_m,
        data.userId
    );
    return res.rowsOfObjects()[0];
};

const getMood = async () => {
    const res = await executeQuery(
        "SELECT " +
            "(SELECT ROUND(AVG(mood), 1) FROM reports WHERE date = current_date) AS today,  " +
            "(SELECT ROUND(AVG(mood), 1) FROM reports WHERE date = current_date - INTEGER '1') as yesterday;"
    );
    return res.rowsOfObjects()[0];
};

const getAllLastSevenAvg = async () => {
    const res = await executeQuery(
        "SELECT ROUND(AVG(sleep_duration), 2) AS sleep_duration, " +
            "ROUND(AVG(sleep_quality), 2) AS sleep_quality, " +
            "ROUND(AVG(exercise_time), 2) AS exercise_time, " +
            "ROUND(AVG(study_time), 2) AS study_time, " +
            "ROUND(AVG(eat_quality), 2) AS eat_quality, " +
            "ROUND(AVG(mood), 2) AS generic_mood " +
            "FROM reports  WHERE date > CURRENT_DATE - 7;"
    );
    return res;
};

const getAllDailyAvg = async (params) => {
    const res = await executeQuery(
        "SELECT ROUND(AVG(sleep_duration), 2) AS sleep_duration, " +
            "ROUND(AVG(sleep_quality), 2) AS sleep_quality, " +
            "ROUND(AVG(exercise_time), 2) AS exercise_time, " +
            "ROUND(AVG(study_time), 2) AS study_time, " +
            "ROUND(AVG(eat_quality), 2) AS eat_quality, " +
            "ROUND(AVG(mood), 2) AS generic_mood " +
            "FROM reports WHERE EXTRACT(DAY FROM date) = $1 AND EXTRACT(MONTH FROM date) = $2 AND EXTRACT(YEAR FROM date) = $3;",
        parseInt(params.day),
        parseInt(params.month),
        parseInt(params.year)
    );
    return res;
};

export {
    getWeeklyAvg,
    getMonthlyAvg,
    getMood,
    getAllLastSevenAvg,
    getAllDailyAvg,
};
