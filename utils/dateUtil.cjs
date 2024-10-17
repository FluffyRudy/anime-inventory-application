const isCompletedAfterRelease = (completedDate, releaseDate) => {
  if (!completedDate || !releaseDate) return null;

  const date1 =
    completedDate instanceof Date ? completedDate : new Date(completedDate);
  const date2 =
    releaseDate instanceof Date ? releaseDate : new Date(releaseDate);

  if (isNaN(date1) || isNaN(date2)) {
    throw new Error("Invalid date provided");
  }

  if (date1.getTime() === date2.getTime()) {
    return true;
  }

  return date1 > date2;
};

module.exports = { isCompletedAfterRelease };
