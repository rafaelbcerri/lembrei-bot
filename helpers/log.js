'use strict';

module.exports.handleError = (error, message) => {
  console.error(message);
  console.error("Error StatusCode:", error.statusCode);
  console.error("Error Message:", error.message);
  console.error("Error Request Options:", error.options);
};