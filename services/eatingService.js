import { executeQuery } from '../database/database.js';

/* Get one week average data from user.
   user_id: foreign key value for the user's id
   week: the week number and year. E.g., week 09 in 2020 would be a string '202009'.
*/
const getOneWeekAverageFromUser = async (userId, week) => {
  const res = await executeQuery("SELECT AVG(quality) as average_quality, AVG(regularity) as average_regularity\
    FROM eating_entries WHERE user_id = $1 AND eating_date >= to_date($2, 'iyyyiw')\
    AND eating_date < to_date($2, 'iyyyiw') + interval '7 days';",
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
  const res = await executeQuery("SELECT AVG(regularity) as average_regularity, AVG(quality) as average_quality\
    FROM eating_entries WHERE user_id = $1 AND eating_date >= $2::date\
    AND eating_date < $2::date + interval '1 month';",
    userId,
    startDate
  );
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects()[0];
  }

  return {};
}

/* Add row to the table eating_entries.
   entry should contain fields userId, quality, regularity and date.
*/
const addEntry = async (entry) => {
  const { userId, quality, regularity, date } = entry;
  await executeQuery("INSERT INTO eating_entries (user_id, quality, regularity, eating_date) VALUES ($1, $2, $3, $4);",
    userId,
    quality,
    regularity,
    date
  );
}

const updateEntry = async (entry) => {
  const { userId, quality, regularity, date } = entry;
  await executeQuery("UPDATE eating_entries SET quality = $1, regularity = $2 WHERE user_id = $3 AND eating_date = $4::date;",
    quality,
    regularity,
    userId,
    date
  );
}

export { getOneWeekAverageFromUser, getOneMonthAverageFromUser, addEntry, updateEntry };