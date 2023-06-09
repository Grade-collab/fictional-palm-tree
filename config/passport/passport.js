//load bcrypt
const bCrypt = require('bcrypt-nodejs');

module.exports = (passport, user) => {
  const User = user;
  const LocalStrategy = require('passport-local').Strategy;

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
      if (user) {
        done(null, user.get());
      } else {
        done(user.errors, null);
      }
    });
  });

  passport.use(
    'local-signup',
    new LocalStrategy(
      {
        usernameField: 'usernamesign',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },

      function(req, username, password, done) {
        var generateHash = password => {
          return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
        };

        User.findOne({ where: { username: username } }).then(user => {
          if (user) {
            return done(null, false, {
              message: 'That email is already taken'
            });
          } else {
            var userPassword = generateHash(password);
            var data = {
              username: username,
              password: userPassword,
              firstname: req.body.firstname,
              lastname: req.body.lastname,
              email: req.body.email
            };

            User.create(data).then((newUser, created) => {
              if (!newUser) {
                return done(null, false);
              }

              if (newUser) {
                return done(null, newUser);
              }
            });
          }
        });
      }
    )
  );

  //LOCAL SIGNIN
  passport.use(
    'local-signin',
    new LocalStrategy(
      {
        // Set the username field to 'username'
        usernameField: 'usernamein',
        passwordField: 'password',
        passReqToCallback: true
      },
      function(req, username, password, done) {
        var User = user;
  
        var isValidPassword = (userpass, password) => {
          return bCrypt.compareSync(password, userpass);
        };
  
        User.findOne({ where: { username: username } })
          .then(user => {
            if (!user) {
              return done(null, false, { message: 'Username does not exist' });
            }
  
            if (!isValidPassword(user.password, password)) {
              return done(null, false, { message: 'Incorrect password.' });
            }
  
            var userinfo = user.get();
  
            return done(null, userinfo);
          })
          .catch(err => {
            console.log('Error:', err);
  
            return done(null, false, {
              message: 'Something went wrong with your Signin'
            });
          });
      }
    )
  );
    }  