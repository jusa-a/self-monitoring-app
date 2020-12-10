import { executeQuery } from "../database/database.js";

const getDuplicate = async (data, type) => {
    const res = await executeQuery(
        "SELECT * FROM reports WHERE type = $1 AND date = $2 AND user_id = $3;",
        type,
        data.date,
        data.userId
    );
    return res.rowsOfObjects()[0];
};

const addMorningReport = async (data) => {
    await executeQuery(
        "INSERT INTO reports (date, type, sleep_duration, sleep_quality, mood, user_id) VALUES ($1, 'morning', $2, $3, $4, $5) ON CONFLICT (date, type, user_id) DO UPDATE SET sleep_duration = $2, sleep_quality = $3, mood = $4;",
        data.date,
        data.sleepDuration,
        data.sleepQuality,
        data.mood,
        data.userId
    );
};

const addEveningReport = async (data) => {
    await executeQuery(
        "INSERT INTO reports (date, type, exercise_time, study_time, eat_quality, mood, user_id) VALUES ($1, 'evening', $2, $3, $4, $5, $6) ON CONFLICT (date, type, user_id) DO UPDATE SET exercise_time = $2, study_time = $3, eat_quality = $4, mood = $5;",
        data.date,
        data.exerciseTime,
        data.studyTime,
        data.eatQuality,
        data.mood,
        data.userId
    );
};

export { getDuplicate, addMorningReport, addEveningReport };
