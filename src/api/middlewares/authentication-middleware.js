const passport = require('passport');
const passportJWT = require('passport-jwt');

const config = require('../../core/config');
const { User } = require('../../models');
// const { Penjual } = require('../../models');

// Authenticate user based on the JWT token
passport.use(
  'user',
  new passportJWT.Strategy(
    {
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderWithScheme('jwt'),
      secretOrKey: config.secret.jwt,
    },
    async (payload, done) => {
      const user = await User.findOne({ id: payload.user_id });
      return user ? done(null, user) : done(null, false);
    }
  )
);

// passport.use(
//   'penjual',
//   new passportJWT.Strategy(
//     {
//       jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderWithScheme('jwt'),
//       secretOrKey: config.secret.jwt,
//     },
//     async (payload, done) => {
//       const penjual = await Penjual.findOne({ id: payload.user_id });
//       return penjual ? done(null, penjual) : done(null, false);
//     }
//   )
// );

module.exports = 
passport.authenticate('user', { session: false });
// passport.authenticate('penjual', {session: false})
