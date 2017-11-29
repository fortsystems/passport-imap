# Passport-Imap

[Passport](http://passportjs.org/) strategy for authenticating with imap

This is customized from the original passport-imap by Fort Systems Ltd. to work in the same way, but to allow for a verify callback instead of `success_callback` as most other passport strategies.

## Usage

#### Configure Strategy

The imap authentication strategy authenticates users using imap login information.  The strategy requires some options like imap host name, port and tls

    passport.use(new ImapStrategy({host: 'imap.gmail.com', port : 993, tls : true}));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'imap'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.post('/login', 
      passport.authenticate('imap', { failureRedirect: '/login' }),
      function(req, res) {
        res.redirect('/');
      });

## License

  - [The MIT License](http://opensource.org/licenses/MIT)


Copyright (c) [NetTantra Technologies](http://www.nettantra.com/)
