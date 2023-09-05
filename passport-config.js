const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('./config/db');

passport.use(
  new LocalStrategy(
    { usernameField: 'user', passwordField: 'password' },
    function (username, password, done) {
      User.findByUsername(username, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: 'Invalid user or password' });
        }
        User.checkPassword(password, user.password, function (err, match) {
          if (err) {
            return done(err);
          }
          if (!match) {
            return done(null, false, { message: 'Invalid user or password' });
          }
          return done(null, user);
        });
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) { // Aquí usamos User.findById
    done(err, user);
  });
});

module.exports = passport;