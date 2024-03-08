const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]

export const displayDateInFormat = (date) => {
  if(!date) return "";
  let dateArray = date.split("-");
  let month = monthNames[parseInt(dateArray[1]) - 1];
  return (month + " " + dateArray[0]);
};
