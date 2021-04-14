exports.viewAdminPage = (req, res) => {
  if (req.cookies.jwt) {
    console.log(req.cookies);
    return res.render("admin");
  } else {
  }
};

exports.isLoggedIn = (req, res, next) => {
  if (req.cookies.jwt) {
    next();
  } else {
    res.cookie("jwt", "yes", {
      expires: new Date(Date.now() + 60000000),
    });
    res.render("login");
  }
};
