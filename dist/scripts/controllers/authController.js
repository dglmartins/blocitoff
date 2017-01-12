(function() {

  function authCtrl(authService, $firebaseAuth) {

    const auth = this;

    auth.state = authService.intializeState();

    auth.viewFunctions = {

      toggleResetPassword(bool) {
        authService.toggleResetPassword(auth, bool);
      },
      resetPassword() {
        authService.resetPassword(auth, $firebaseAuth);
      },
      signIn() {
        authService.signIn(auth, $firebaseAuth);
      },
      createUser() {
        authService.createUser(auth, $firebaseAuth)
      },
      log(log) {
        console.log(log);
      }
    };
    console.log(auth);
  }

  angular
    .module('blocitoff')
    .controller('authCtrl',['authService', '$firebaseAuth', authCtrl]);

})();
