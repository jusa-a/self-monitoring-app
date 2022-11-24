import * as summaryService from "../../services/summaryService.js";

const main = async ({ render, state: { session } }) => {
    const mood = await summaryService.getMood();
    const logged = {
        loggedIn: await session.get("authenticated"),
        user: await session.get("user"),
    };
    render("index.ejs", { data: mood, logged: logged });
};

export { main };
