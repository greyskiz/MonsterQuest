/* eslint-disable max-classes-per-file */

module.exports.DUPLICATE_TABLE_ERROR = class DUPLICATE_TABLE_ERROR extends Error {
    constructor(tableName) {
        super(`Table ${tableName} already exists!`);
    }
};

module.exports.UNDEFINED_TABLE_ERROR = class UNDEFINED_TABLE_ERROR extends Error {
    constructor(tableName) {
        super(`Table ${tableName} does not exists!`);
    }
};

module.exports.EMPTY_RESULT_ERROR = class EMPTY_RESULT_ERROR extends Error {};
module.exports.UNIQUE_VIOLATION_ERROR = class UNIQUE_VIOLATION_ERROR extends Error {};
module.exports.RAISE_EXCEPTION = class RAISE_EXCEPTION extends Error {};

// See more: https://www.postgresql.org/docs/current/errcodes-appendix.html
module.exports.SQL_ERROR_CODE = {
    DUPLICATE_TABLE: '42P07',
    UNDEFINED_TABLE: '42P01',
    UNIQUE_VIOLATION: '23505',
    RAISE_EXCEPTION: 'P0001',
};

// Express error-handling middleware
module.exports.errorHandler = function (err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Unknown server error';

  const payload = { error: message };
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    payload.stack = err.stack;
  }
  res.status(status).json(payload);
};
