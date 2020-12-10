import { Router } from "../deps.js";
import * as userController from "./controllers/userController.js";
import * as reportController from "./controllers/reportController.js";
import * as summaryController from "./controllers/summaryController.js";
import * as mainController from "./controllers/mainController.js";
import * as summaryApi from "./apis/summaryApi.js";

const router = new Router();

router.get("/", mainController.main);
router.get("/auth/registration", userController.showRegistrationForm);
router.post("/auth/register", userController.postRegistrationForm);
router.get("/auth/login", userController.showLoginForm);
router.post("/auth/login", userController.postLoginForm);
router.get("/auth/logout", userController.logOut);

router.get("/behavior/reporting", reportController.showReportForm);
router.get("/behavior/reporting/:type", reportController.showReportForm);
router.post("/behavior/reporting/:type", reportController.postReport);

router.get("/behavior/summary", summaryController.showSummary);
router.post("/behavior/summary", summaryController.updateSummary);

router.get("/api/summary", summaryApi.getAvg);
router.get("/api/summary/:year/:month/:day", summaryApi.getAvg);

export { router };
