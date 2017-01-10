(function() {

  function AuthCtrl(AuthFactory, $firebaseAuth) {

    const auth = this;

    auth.state = AuthFactory.intializeState();

    auth.viewFunctions = {

      toggleResetPassword(bool) {
        AuthFactory.toggleResetPassword(auth, bool);
      },
      resetPassword() {
        AuthFactory.resetPassword(auth, $firebaseAuth);
      },
      signIn() {
        AuthFactory.signIn(auth, $firebaseAuth);
      },
      createUser() {
        AuthFactory.createUser(auth, $firebaseAuth)
      },
      log(log) {
        console.log(log);
      }
    };
    console.log(auth);
  }

  angular
    .module('blocitoff')
    .controller('AuthCtrl',['AuthFactory', '$firebaseAuth', AuthCtrl]);

})();
