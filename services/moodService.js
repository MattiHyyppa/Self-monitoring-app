import { executeQuery } from '../database/database.js';

/* Get all rows of one user, from one date and with specified type. */
const getRows = async (date, typeId, userId) => {
  const res = await executeQuery("SELECT * FROM mood_entries WHERE mood_date = $1::date\
    AND user_id = $2 AND type_id = $3;",
  date,
  userId,
  typeId
  );
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects();
  }
  return null;
}

/* Get one day average of mood scores of all users.
   date: e.g. '2020-02-20'
*/
const getOneDayAverage = async (date) => {
  const res = await executeQuery("SELECT AVG(mood_score) as average_mood\
    FROM mood_entries WHERE mood_date = $1::date;",
    date
    );
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects()[0];
  }
  return {};
}

/* Get one week average of mood scores of all users.
*/
const getOneWeekAverage = async () => {
  const res = await executeQuery("SELECT AVG(mood_score) as average_mood\
    FROM mood_entries WHERE mood_date >= (NOW() - interval '7 days')::date AND mood_date < NOW()::date;");
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
  const res = await executeQuery("SELECT AVG(mood_score) as average_mood\
    FROM mood_entries WHERE user_id = $1 AND mood_date >= to_date($2, 'iyyyiw')\
    AND mood_date < to_date($2, 'iyyyiw') + interval '7 days';",
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
  const res = await executeQuery("SELECT AVG(mood_score) as average_mood\
    FROM mood_entries WHERE user_id = $1 AND mood_date >= $2::date\
    AND mood_date < $2::date + interval '1 month';",
    userId,
    startDate
  );
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects()[0];
  }

  return {};
}

/* Add row to the table mood_entries.
   entry should contain fields userId, typeId, mood and date.
*/
const addEntry = async (entry) => {
  const { userId, typeId, mood, date } = entry;
  await executeQuery("INSERT INTO mood_entries (user_id, type_id, mood_score, mood_date) VALUES ($1, $2, $3, $4);",
    userId,
    typeId,
    mood,
    date
  );
}

const updateEntry = async (entry) => {
  const { userId, typeId, mood, date } = entry;
  await executeQuery("UPDATE mood_entries SET mood_score = $1 WHERE user_id = $2 AND type_id = $3 AND mood_date = $4::date;",
    mood,
    userId,
    typeId,
    date
  );
}

export { getRows, getOneDayAverage, getOneWeekAverage, getOneWeekAverageFromUser, getOneMonthAverageFromUser, addEntry, updateEntry };