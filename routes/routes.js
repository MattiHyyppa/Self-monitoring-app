import { Router } from '../deps.js';
import * as summaryApi from './apis/summaryApi.js';
import * as reportController from './controllers/reportController.js';
import * as summaryController from './controllers/summaryController.js';
import * as indexController from './controllers/indexController.js';
import * as userController from './controllers/userController.js';

const router = new Router();

router.get('/', indexController.showLandingPage);
router.get('/behavior/reporting', reportController.newReport);
router.post('/behavior/reporting/morning', reportController.addMorningReport);
router.post('/behavior/reporting/evening', reportController.addEveningReport);
router.get('/behavior/summary', summaryController.getSummary);
router.get('/auth/registration', userController.showRegistrationForm);
router.post('/auth/registration', userController.postRegistrationForm);
router.get('/auth/login', userController.showLoginForm);
router.post('/auth/login', userController.postLoginForm);
router.post('/auth/logout', userController.handleLogout);

router.get('/api/summary', summaryApi.getOneWeekEntries);
router.get('/api/summary/:year/:month/:day', summaryApi.getOneDayEntries);

export { router };