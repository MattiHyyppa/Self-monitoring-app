const formatDate = (date) => {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) 
    month = '0' + month;
  if (day.length < 2) 
    day = '0' + day;

  return [year, month, day].join('-');
}

/* Get the corresponding name for a month.
   month: is between 1 and 12.
*/
const getMonthName = (month) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  if (Number(month) >= 1 && Number(month) <= 12) {
    return months[Number(month) - 1];
  }
  else {
    return month;
  }
}

export { formatDate, getMonthName }