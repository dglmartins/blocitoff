(function() {

  function authCtrl(authFactory, $firebaseAuth) {

    const auth = this;

    auth.state = authFactory.intializeState();

    auth.viewFunctions = {

      toggleResetPassword(bool) {
        authFactory.toggleResetPassword(auth, bool);
      },
      resetPassword() {
        authFactory.resetPassword(auth, $firebaseAuth);
      },
      signIn() {
        authFactory.signIn(auth, $firebaseAuth);
      },
      createUser() {
        authFactory.createUser(auth, $firebaseAuth)
      },
      log(log) {
        console.log(log);
      }
    };
    console.log(auth);
  }

  angular
    .module('blocitoff')
    .controller('authCtrl',['authFactory', '$firebaseAuth', authCtrl]);

})();
