import * as sleepService from '../../services/sleepService.js';
import * as moodService from '../../services/moodService.js';
import * as eatingService from '../../services/eatingService.js';
import * as sportService from '../../services/sportService.js';
import * as studyService from '../../services/studyService.js';
import { getMonthName } from '../../utils/dates.js';


const getSummary = async ({ request, render, session }) => {
  const params = request.url.searchParams;
  const user = await session.get('user');

  let week, month, year;

  if (params && params.has('week')) {
    const weekString = params.get('week');
    const parts = weekString.split('-W');
    week = parts[1];
    year = parts[0];
    if (!(Number(week) >= 1 && Number(week) <= 53 && Number(year) >= 2000 && Number(year) <= 2100)) {
      week = null;
      year = null;
    }
  }
  if (params && params.has('month')) {
    const monthString = params.get('month');
    const parts = monthString.split('-');
    month = parts[1];
    year = parts[0];
    if (!(Number(month) >= 1 && Number(month) <= 12 && Number(year) >= 2000 && Number(year) <= 2100)) {
      month = null;
      year = null;
    }
  }

  // If no week or month specified, let's choose last month as default.
  if (!week && !month) {
    month = new Date().getMonth();
    // If it is January, last month is December
    if (month === 0) {
      month = 12;
    }
    year = new Date().getFullYear();
  }

  if (month) {
    // Let's fetch monthly averages and render the data.
    const data = {
      barChartData: {
        labels: ['Sleep duration', 'Sports', 'Studying'],
        name: 'Monthly averages',
      },
      pieChartData: {
        labels: ['Sleep duration', 'Sports', 'Studying', 'Other'],
        name: 'Monthly averages',
      }
    };
  
    const dataY = [];
    const startDate = `${year}-${month}-01`;

    let res = await sleepService.getOneMonthAverageFromUser(user.id, startDate);
    dataY.push(res.average_duration);
    data.sleepQuality = res.average_quality;
  
    res = await sportService.getOneMonthAverageFromUser(user.id, startDate);
    dataY.push(res.average_duration);
  
    res = await studyService.getOneMonthAverageFromUser(user.id, startDate);
    dataY.push(res.average_duration);
  
    res = await eatingService.getOneMonthAverageFromUser(user.id, startDate);
    data.eatingRegularity = res.average_regularity;
    data.eatingQuality = res.average_quality;
  
    res = await moodService.getOneMonthAverageFromUser(user.id, startDate);
    data.mood = res.average_mood;
  
    data.barChartData.dataY = dataY;
    data.pieChartData.dataY = [...dataY];
    const sum = dataY.reduce((a, b) => (Number(a) + Number(b)), 0);
    let other = 24 - sum;
    other = other < 0 ? 0 : other;
    data.pieChartData.dataY.push(other);
  
    render('summary.ejs', {
      dataString: JSON.stringify(data),
      data: data,
      month: getMonthName(month),
      week: null,
      isDataEmpty: data.barChartData.dataY.every(item => !item),
      user: user
    });

    return;
  }

  // Let's fetch weekly averages and render the data.
  const weekString = `${year}${week}`;
  const data = {
    barChartData: {
      labels: ['Sleep duration', 'Sports', 'Studying'],
      name: 'Weekly averages',
    },
    pieChartData: {
      labels: ['Sleep duration', 'Sports', 'Studying', 'Other'],
      name: 'Weekly averages',
    }
  };
  
  let dataY = [];
  let res = await sleepService.getOneWeekAverageFromUser(user.id, weekString);
  dataY.push(res.average_duration);
  data.sleepQuality = res.average_quality;

  res = await sportService.getOneWeekAverageFromUser(user.id, weekString);
  dataY.push(res.average_duration);

  res = await studyService.getOneWeekAverageFromUser(user.id, weekString);
  dataY.push(res.average_duration);

  res = await eatingService.getOneWeekAverageFromUser(user.id, weekString);
  data.eatingRegularity = res.average_regularity;
  data.eatingQuality = res.average_quality;

  res = await moodService.getOneWeekAverageFromUser(user.id, weekString);
  data.mood = res.average_mood;

  data.barChartData.dataY = dataY;
  data.pieChartData.dataY = [...dataY];
  const sum = dataY.reduce((a, b) => (Number(a) + Number(b)), 0);
  let other = 24 - sum;
  other = other < 0 ? 0 : other;
  data.pieChartData.dataY.push(other);

  render('summary.ejs', {
    dataString: JSON.stringify(data),
    data: data,
    week: week,
    month: null,
    isDataEmpty: data.barChartData.dataY.every(item => !item),
    user: user
  });
}

export { getSummary };