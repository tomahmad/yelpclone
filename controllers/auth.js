const User = require("../models/user");

module.exports.registerForm = (req, res) => {
  res.render("auth/register");
};

module.exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    // agar setelah registrasi, user langsung diarahkan ke halaman places tanpa perlu login lagi
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success_msg", "You are registered and logged in");
      res.redirect("/places");
    });
  } catch (error) {
    req.flash("error_msg", error.message);
    res.redirect("/register");
  }
};

module.exports.loginForm = (req, res) => {
  res.render("auth/login");
};

module.exports.login = (req, res) => {
  console.log("Login berhasil!");
  req.flash("success_msg", "You are logged in");
  res.redirect("/places");
};

module.exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    console.log("Logout berhasil");
    req.flash("success_msg", "You are logged out");
    res.redirect("/login");
  });
};
