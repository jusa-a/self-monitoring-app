import * as summaryService from "../../services/summaryService.js";

const getAvg = async ({ params, response }) => {
    let result = {};
    if (params.year) {
        result = await summaryService.getAllDailyAvg(params);
    } else {
        result = await summaryService.getAllLastSevenAvg();
    }

    let avg = [];
    if (result) {
        avg = result.rowsOfObjects();
    }
    response.body = avg;
};

export { getAvg };
