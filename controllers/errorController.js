const handleDevError = (err, req, res) => {
  const status = err.status || 400;
  res.status(status).json({ success: false, data: err });
};
const handleProdError = (err, req, res) => {
  const status = err.status || 400;
  if (
    err.errors?.password &&
    err.errors.password.kind === "minlength" &&
    err.errors.password.path === "password"
  ) {
    return res.status(status).json({
      success: false,
      message: "password must be 8 or more character",
    });
  } else if (err.code === 11000) {
    return res.status(status).json({
      success: false,
      message: "email already exist",
    });
  }
  res
    .status(status)
    .json({ success: false, message: "something went wrong", err });
};

module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === "development") handleDevError(err, req, res);
  else if (process.env.NODE_ENV === "production")
    handleProdError(err, req, res);
};
