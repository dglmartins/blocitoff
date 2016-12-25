(function() {

  function AuthCtrl(AuthFactory) {
    //to avoid "this" confusion!
    var self = this;

    //funtion resetPassword calls firebase's $sendPasswordResetEmail on $firebaseAuth() (via our Authfactory) See factory.
    self.resetPassword = function() {
      AuthFactory.resetPassword(self);
    };

    //sign in with email and password angularfire. See factory.
    self.signIn = function() {
      AuthFactory.signIn(self);
    };

    //create user with email and password angularfire. See factory.
    self.createUser = function() {
      AuthFactory.createUser(self);
    };
  }

  angular
    .module('blocitoff')
    .controller('AuthCtrl',['AuthFactory', AuthCtrl]);

})();
