import * as sleepService from '../../services/sleepService.js';
import * as moodService from '../../services/moodService.js';
import * as sportService from '../../services/sportService.js';
import * as studyService from '../../services/studyService.js';
import { validate, isDate  } from '../../deps.js';


const getOneDayEntries = async ({ params, response }) => {
  const year = Number(params.year);
  const month = Number(params.month);
  const day = Number(params.day);

  const date = `${year}-${month}-${day}`;
  const validationRules = {
    date: [isDate]
  };

  const [passes, errors] = await validate({ date }, validationRules);
  if (passes) {
    const data = { };

    let res = await sleepService.getOneDayAverage(date);
    data.average_sleep_duration = res.average_duration;
    data.average_sleep_quality = res.average_quality;

    res = await moodService.getOneDayAverage(date);
    data.average_mood = res.average_mood;

    res = await sportService.getOneDayAverage(date);
    data.average_sport_duration = res.average_duration;

    res = await studyService.getOneDayAverage(date);
    data.average_study_duration = res.average_duration;

    response.body = data;
  }
  else {
    response.body = {
      error: 'invalid date'
    };
  }
}

const getOneWeekEntries = async ({ response }) => {
  const data = { };

  let res = await sleepService.getOneWeekAverage();
  data.average_sleep_duration = res.average_duration;
  data.average_sleep_quality = res.average_quality;

  res = await moodService.getOneWeekAverage();
  data.average_mood = res.average_mood;

  res = await sportService.getOneWeekAverage();
  data.average_sport_duration = res.average_duration;

  res = await studyService.getOneWeekAverage();
  data.average_study_duration = res.average_duration;

  response.body = data;
}

export { getOneDayEntries, getOneWeekEntries }