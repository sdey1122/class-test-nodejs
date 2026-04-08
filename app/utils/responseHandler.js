const success = (res, data = {}, code = 200) => {
  return res.status(code).json({
    success: true,
    data,
  });
};

const error = (res, err, code = 500) => {
  return res.status(code).json({
    success: false,
    message: err.message || err,
    field: err.field || null,
  });
};

module.exports = { success, error };