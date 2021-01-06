import * as sleepService from '../../services/sleepService.js';
import * as moodService from '../../services/moodService.js';
import * as eatingService from '../../services/eatingService.js';
import * as sportService from '../../services/sportService.js';
import * as studyService from '../../services/studyService.js';
import { formatDate } from '../../utils/dates.js';
import {
  validate, required, isNumber, numberBetween, isDate
} from '../../deps.js';
import { isNotNaN } from '../../utils/validation.js';

const getData = async (request, session) => {
  const user = await session.get('user');
  const morningReports = await moodService.getRows(formatDate(new Date()), 1, user.id);
  const eveningReports = await moodService.getRows(formatDate(new Date()), 2, user.id);
  const morningReportDone = morningReports ? true : false;
  const eveningReportDone = eveningReports ? true : false;

  const data = {
    sleepDuration: '',
    sleepQuality: 3,
    moodMorning: 3,
    sportDuration: '',
    studyDuration: '',
    eatingRegularity: 3,
    eatingQuality: 3,
    moodEvening: 3,
    date: formatDate(new Date()),
    morningReportDone,
    eveningReportDone,
    user,
    errors: null
  };

  if (request) {
    const body = request.body();
    const params = await body.value;
    
    data.sleepDuration = params.get('sleep-duration');
    data.sleepQuality = params.get('sleep-quality');
    data.moodMorning = params.get('mood-morning');
    data.sportDuration = params.get('sport-duration');
    data.studyDuration = params.get('study-duration');
    data.eatingRegularity = params.get('eating-regularity');
    data.eatingQuality = params.get('eating-quality');
    data.moodEvening = params.get('mood-evening');
    data.date = params.get('date');
  }

  return data;
};

const newReport = async ({ request, render, session }) => {
  const data = await getData(null, session);

  const params = request.url.searchParams;

  let showMorning, showEvening;
  if (params && params.has('type')) {
    const reportType = params.get('type');
    if (reportType === 'evening') {
      showMorning = false;
      showEvening = true;
    }
    // If type not evening, show morning report.
    else {
      showMorning = true;
      showEvening = false;
    }
  }
  // If no type specified, show the one that's not done yet or if both done, show morning report.
  else {
    if (data.morningReportDone && data.eveningReportDone) {
      showMorning = true;
      showEvening = false;
    }
    else if (data.morningReportDone) {
      showMorning = false;
      showEvening = true;
    }
    else {
      showMorning = true;
      showEvening = false;
    }
  }

  data.showMorning = showMorning;
  data.showEvening = showEvening;

  render('add-report.ejs', data);
}

const addMorningReport = async ({ request, response, render, session }) => {
  const body = request.body();
  const params = await body.value;
  const user = await session.get('user');

  const obj = {
    sleepDuration: Number(params.get('sleep-duration')),
    sleepQuality: Number(params.get('sleep-quality')),
    moodMorning: Number(params.get('mood-morning')),
    date: params.get('date')
  };

  const validationRules = {
    sleepDuration: [required, isNumber, numberBetween(0, 24), isNotNaN],
    sleepQuality: [required, isNumber, numberBetween(1, 5), isNotNaN],
    moodMorning: [required, isNumber, numberBetween(1, 5), isNotNaN],
    date: [required, isDate]
  };

  const [passes, errors] = await validate(obj, validationRules);
  if (passes) {
    const sleepEntry = {
      userId: user.id,
      typeId: 1,
      duration: obj.sleepDuration,
      quality: obj.sleepQuality,
      date: obj.date
    };

    const moodEntry = {
      userId: user.id,
      typeId: 1,
      mood: obj.moodMorning,
      date: obj.date
    };

    // If there isn't a morning report for today, let's just add the entries.
    // Otherwise, let's update the existing entries.
    const morningReports = await moodService.getRows(obj.date, 1, user.id);
    if (morningReports) {
      await sleepService.updateEntry(sleepEntry);
      await moodService.updateEntry(moodEntry);
    }
    else {
      await sleepService.addEntry(sleepEntry);
      await moodService.addEntry(moodEntry);
    }

    response.redirect('/behavior/summary');
  }
  else {
    response.status = 400;
    const data = await getData(request, session);
    data.showMorning = true;
    data.showEvening = false;
    data.errors = errors;
    render('add-report.ejs', data);
  }
}

const addEveningReport = async ({ request, response, render, session }) => {
  const body = request.body();
  const params = await body.value;
  const user = await session.get('user');

  const obj = {
    sportDuration: Number(params.get('sport-duration')),
    studyDuration: Number(params.get('study-duration')),
    eatingRegularity: Number(params.get('eating-regularity')),
    eatingQuality: Number(params.get('eating-quality')),
    moodEvening: Number(params.get('mood-evening')),
    date: params.get('date')
  };

  const validationRules = {
    sportDuration: [required, isNumber, numberBetween(0, 24), isNotNaN],
    studyDuration: [required, isNumber, numberBetween(0, 24), isNotNaN],
    eatingRegularity: [required, isNumber, numberBetween(1, 5), isNotNaN],
    eatingQuality: [required, isNumber, numberBetween(1, 5), isNotNaN],
    moodEvening: [required, isNumber, numberBetween(1, 5), isNotNaN],
    date: [required, isDate]
  };

  const [passes, errors] = await validate(obj, validationRules);
  if (passes) {
    const sportEntry = {
      userId: user.id,
      duration: obj.sportDuration,
      date: obj.date
    };
    
    const studyEntry = {
      userId: user.id,
      duration: obj.studyDuration,
      date: obj.date
    };

    const eatingEntry = {
      userId: user.id,
      quality: obj.eatingQuality,
      regularity: obj.eatingRegularity,
      date: obj.date
    };

    const moodEntry = {
      userId: user.id,
      typeId: 2,
      mood: obj.moodEvening,
      date: obj.date
    };

    // If there isn't an evening report for today, let's just add the entries.
    // Otherwise, let's update the existing entries.
    const eveningReports = await moodService.getRows(obj.date, 2, user.id);

    if (eveningReports) {
      await sportService.updateEntry(sportEntry);
      await studyService.updateEntry(studyEntry);
      await eatingService.updateEntry(eatingEntry);
      await moodService.updateEntry(moodEntry);
    }
    else {
      await sportService.addEntry(sportEntry);
      await studyService.addEntry(studyEntry);
      await eatingService.addEntry(eatingEntry);
      await moodService.addEntry(moodEntry);
    }

    response.redirect('/behavior/summary');
  }
  else {
    response.status = 400;
    const data = await getData(request, session);
    data.showMorning = false;
    data.showEvening = true;
    data.errors = errors;
    render('add-report.ejs', data);
  }
}

export { newReport, addMorningReport, addEveningReport }