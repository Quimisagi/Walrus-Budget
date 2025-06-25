const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const displayDateInFormat = (date) => {
  if(!date) return "";
  let dateArray = date.split("-");
  let month = monthNames[parseInt(dateArray[1]) - 1];
  return (month + " " + dateArray[0]);
};
