exports.compareDate = (firstDate, secondDate) => {
  if (!firstDate || !secondDate) return null;

  const date1 = firstDate instanceof Date ? firstDate : new Date(firstDate);
  const date2 = secondDate instanceof Date ? secondDate : new Date(secondDate);

  if (isNaN(date1) || isNaN(date2)) {
    throw new Error("Invalid date provided");
  }

  return date1 > date2;
};
