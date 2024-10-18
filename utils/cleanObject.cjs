/**
 * Remove all properties with falsy values except 0
 * Note: This has side effect and isnt pure function
 * @param {object} obj - The object to clean
 * @returns {object} - The clean object with Truthy values
 */
function cleanObject(obj) {
  for (const key in obj) {
    if (!obj[key] && obj[key] !== 0) {
      delete obj[key];
    }
  }
  return obj;
}

module.exports = { cleanObject };
