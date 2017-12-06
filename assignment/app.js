module.exports = function(app) {
  var db = require("./model/models.server");
  require("./services/auth.service.server.js")(app);
  require("./services/user.service.server.js")(app);
  require("./services/website.service.server.js")(app);
  require("./services/page.service.server.js")(app);
  require("./services/widget.service.server.js")(app);

};
