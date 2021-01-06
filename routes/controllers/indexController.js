import * as sleepService from '../../services/sleepService.js';
import * as moodService from '../../services/moodService.js';

const showLandingPage = async ({ render, session }) => {
  const user = await session.get('user');
  let res = await moodService.getOneDayAverage(new Date());
  const data = {
    user: user,
    moodToday: res.average_mood,
  };

  res = await moodService.getOneDayAverage(new Date(Date.now() - 86400000));
  data.moodYesterday = res.average_mood;

  render('index.ejs', data);
}

export { showLandingPage }
