/**
 *
 * @param {number} start
 * @param {number} end
 * @returns
 */
function randint(start, end) {
  if (end < start) {
    const error = new Error("End can not be smaller than start");
    error.name = "Invalid range";
    throw error;
  }
  return Math.floor(start + (end - start) * Math.random());
}

/**
 *
 * @param {Array<any>} list
 * @returns {any}
 */
function choice(list) {
  const randomIndex = randint(0, list.length);
  return list[randomIndex];
}

module.exports = { randint, choice };
