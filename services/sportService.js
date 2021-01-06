import { executeQuery } from '../database/database.js';

/* Get one day average of time spent exercising of all users.
   date: e.g. '2020-02-20'
*/
const getOneDayAverage = async (date) => {
  const res = await executeQuery("SELECT AVG(duration) as average_duration\
    FROM sport_entries WHERE sport_date = $1::date;",
    date
    );
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects()[0];
  }
  return {};
}

/* Get one week average of time spent exercising of all users.
*/
const getOneWeekAverage = async () => {
  const res = await executeQuery("SELECT AVG(duration) as average_duration\
    FROM sport_entries WHERE sport_date >= (NOW() - interval '7 days')::date AND sport_date < NOW()::date;");
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects()[0];
  }
  return {};
}

/* Get one week average data from user.
   user_id: foreign key value for the user's id
   week: the week number and year. E.g., week 09 in 2020 would be a string '202009'.
*/
const getOneWeekAverageFromUser = async (userId, week) => {
  const res = await executeQuery("SELECT AVG(duration) as average_duration\
    FROM sport_entries WHERE user_id = $1 AND sport_date >= to_date($2, 'iyyyiw')\
    AND sport_date < to_date($2, 'iyyyiw') + interval '7 days';",
    userId,
    week
  );
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects()[0];
  }

  return {};
}

/* Get one month average data from user.
   userId: foreign key value for the user's id
   startDate: the first date from which data will be fetched. If startDate is e.g. '2020-02-01',
     data will be fetched from interval ['2020-02-01', '2020-03-01'[, excluding the first day of March.
*/
const getOneMonthAverageFromUser = async (userId, startDate) => {
  const res = await executeQuery("SELECT AVG(duration) as average_duration\
    FROM sport_entries WHERE user_id = $1 AND sport_date >= $2::date\
    AND sport_date < $2::date + interval '1 month';",
    userId,
    startDate
  );
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects()[0];
  }

  return {};
}

/* Add row to the table sport_entries.
   entry should contain fields userId, duration and date.
*/
const addEntry = async (entry) => {
  const { userId, duration, date } = entry;
  await executeQuery("INSERT INTO sport_entries (user_id, duration, sport_date) VALUES ($1, $2, $3);",
    userId,
    duration,
    date
  );
}

const updateEntry = async (entry) => {
  const { userId, duration, date } = entry;
  await executeQuery("UPDATE sport_entries SET duration = $1 WHERE user_id = $2 AND sport_date = $3::date;",
    duration,
    userId,
    date
  );
}

export { getOneDayAverage, getOneWeekAverage, getOneWeekAverageFromUser, getOneMonthAverageFromUser, addEntry, updateEntry };