'use strict';

module.exports = {
  userAuthenticationMiddleware: function() {
    return (req, res, next) => {

      if (req.isAuthenticated() && req.session.loggedInUser) return next();

      res.redirect('/auth/login');
    }
  }
};
