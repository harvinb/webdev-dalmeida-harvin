module.exports = function (app) {

  app.post("/api/loggedin", loggedin);

  function loggedin(req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
  }

};
