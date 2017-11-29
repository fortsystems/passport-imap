/**
 * Module dependencies.
 */
var passport = require('passport')
  , util = require('util')
  , BadRequestError = require('./errors/badrequesterror')
  , Imap = require('imap');

/*
 *The imap authentication strategy authenticates users using imap login information. The strategy requires some options like
 *imaphost name, port and tls
 *
 *passport.use(new ImapStrategy({host: 'imap.gmail.com', port : 993, tls : true}));
 *Authenticate Requests
 *Use passport.authenticate(), specifying the 'imap' strategy, to authenticate requests.
 *For example, as route middleware in an Express application:
 *  app.post('/login', 
 *     passport.authenticate('imap', { failureRedirect: '/login' }),
 *     function(req, res) {
 *       res.redirect('/');
 *     });
 */

function Strategy(options, verify) {
  passport.Strategy.call(this);
  this._host = options.host || '';
  this._port = options.port || (options.tls === true) ? 993 : 143;
  this._tls = (options.tls === true) ? true : false;
  this.name = 'imap';
  if (!verify) throw new Error('imap authentication strategy requires a verify function'); 
  this._verify = verify;
  this._passReqToCallback = options.passReqToCallback;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request based on the contents of a form submission.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req, options) {
  options = options || {};
  this._username = req.body.username;
  this._password = req.body.password;
  if (!this._username || !this._password) {
    return this.fail(new BadRequestError(options.badRequestMessage || 'Missing credentials'));
  }
  var self = this;
  function verified(err, user, info) {
    if (err) { return self.error(err); }
    if (!user) { return self.fail(info); }
    self.success(user, info);
  }
  var imap = new Imap({
    user: self._username,
    password: self._password,
    host: self._host,
    port: self._port,
    tls: self._tls,
    tlsOptions: { rejectUnauthorized: false }
  });
  imap.once('ready', function(){
    options.username = self._username;
    options.provider = 'imap' + ((self._tls) ? 's' : '') + '://' + self._host + ':' + self._port;
    self._verify(options, verified);
  });
  imap.connect();
  imap.once('error', function(err) {
    return self.fail("Invalid credantials: " + err.message);
  });
}


/**
 * Expose `Strategy`.
 */ 
module.exports = Strategy;
