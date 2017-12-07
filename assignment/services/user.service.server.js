module.exports = function (app) {

  var userModel = require("../model/user/user.model.server");
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;
  var FacebookStrategy = require('passport-facebook').Strategy;
  var bcrypt = require("bcrypt-nodejs");

  passport.serializeUser(serializeUser);

  function serializeUser(user, done) {
    done(null, user);
  }

  passport.deserializeUser(deserializeUser);
  function localStrategy(username, password, done) {
    userModel
      .findUserByUsername(username)
      .then(
        function(user) {
          if(user.username === username && bcrypt.compareSync(password, user.password)) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        },
        function(err) {
          if (err) { return done(err); }
        }
      );
  }


  function deserializeUser(user, done) {
    userModel
      .findUserById(user._id)
      .then(
        function(user){
          done(null, user);
        },
        function(err){
          done(err, null);
        }
      );
  }

  passport.use(new LocalStrategy(localStrategy));

  app.post("/api/user", createUser);
  app.get("/api/user/:userId",findUserById);
  app.get("/api/user", findUsers);
  app.put("/api/user/:userId", updateUser);
  app.delete("/api/user/:userId", deleteUser);
  app.post  ('/api/login', passport.authenticate('local'), login);
  app.post('/api/logout', logout);
  app.post ('/api/register', register);
  app.get ('/facebook/login', passport.authenticate('facebook', { scope : 'email' }));
  /*
  app.get('/facebook/oauth2callback',
    passport.authenticate('facebook', {
      successRedirect: 'http://localhost:4200/profile',
      failureRedirect: 'http://localhost:4200/login'
    }));
*/
  app.get('/facebook/oauth2callback', function(req, res, next) {
    passport.authenticate('facebook', function(err, user, info) {
      //console.log(req);
      //console.log(res);
      if (err) { return next(err); }
      if (!user) { return res.redirect('/login'); }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.redirect('/user/' + user._id);
      });
    })(req, res, next);
  });

  var facebookConfig;

  if(process.env.MLAB_USERNAME_WEBDEV) { // check if running remotely
    facebookConfig = {
      clientID     : process.env.FACEBOOK_CLIENT_ID,
      clientSecret : process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL  : process.env.FACEBOOK_CALLBACK_URL
    };
  } else {
    facebookConfig = {
      clientID     : "1652422851476258",
      clientSecret : "944149175e1cf7215a0467aea2ebcc05",
      callbackURL  : "http://localhost:3100/facebook/oauth2callback"
    };
  }

  // https://webdev-dalmeida-harvin.herokuapp.com/facebook/oauth2callback

  passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));

  function facebookStrategy(token, refreshToken, profile, done) {
    userModel
      .findUserByFacebookId(profile.id)
      .then(
        function(user) {
          if(user) {
            return done(null, user);
          } else {
            //console.log(profile);
            var names = profile.displayName.split(" ");
            var newFacebookUser = {
              username: names[0],
              lastName:  names[1],
              firstName: names[0],
              email:     profile.emails ? profile.emails[0].value:"",
              facebook: {
                id:    profile.id,
                token: token
              }
            };
            return userModel.createUser(newFacebookUser);
          }
        },
        function(err) {
          if (err) { return done(err); }
        }
      )
      .then(
        function(user){
          return done(null, user);
        },
        function(err){
          if (err) { return done(err); }
        }
      );
  }


  function logout(req, res) {
    req.logOut();
    res.sendStatus(200);
  }

  function login(req, res) {
    var user = req.user;
    res.json(user);
  }

  function register (req, res) {
    var user = req.body;
    user.password = bcrypt.hashSync(user.password);
    userModel
      .createUser(user)
      .then(
        function(user){
          if(user){
            req.login(user, function(err) {
              if(err) {
                res.status(400).send(err);
              } else {
                res.json(user);
              }
            });
          }
        }
      );
  }


  function createUser(req,res) {
    var user=req.body;
    // user._id = Math.random().toString();
    //user.username = req.body.username;
    //user.password = req.body.password;
    // users.push(user);
    userModel
      .createUser(user)
      .then(function (user) {
        res.json(user);
      });
  }

  function findUserById(req,res) {
    var uId = req.params["userId"];
    userModel
      .findUserById(uId)
      .then(function (user) {
        res.json(user);
      });
  }

  function findUsers(req,res) {
    var username = req.query["username"];
    var password = req.query["password"];

/*
    if(username) {
      user = users.find(function (user) {
        return user.username === username;
      });

      if (user) {
        if(password && user.password !== password) {
          res.json({});
        }
        res.json(user);
      } else {
        res.json({});
      }
      return;
    }
   */
    if(username && password) {
      var promise = userModel.findUserByCredentials(username, password);
      promise.then(function (result) {
        // console.log(result);
        res.json(result);
      });
      return;
    } else if(username) {
      userModel
        .findUserByUsername(username)
        .then(function (user) {
          res.json(user);
        });
      return;
    } else {
      res.json({});
    }
  }

  function updateUser(req,res){
    var user=req.body;
    userModel
      .updateUser(user._id,user)
      .then(function (status) {
        res.json(status);
      });
    //res.json(users);
  }

  function deleteUser(req,res){
    var uId = req.params["userId"];
    userModel
      .updateUser(user._id,user)
      .then(function (status) {
        res.json(status);
      });
  }
};
