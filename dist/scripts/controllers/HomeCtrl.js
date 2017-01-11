//currentAuth here comes from state resolve and is the current firebaseUser
//only signed in users access home via resolve.
(function() {

  function homeCtrl(currentAuth, homeFactory, $firebaseAuth) {

    const home = this;
    homeFactory.intializeState(home, currentAuth);

    home.viewFunctions = {
      signOut() {
        homeFactory.signOut($firebaseAuth);
      },
      log(log) {
        console.log(log);
      }
    };

    console.log(home);

  }

  angular
    .module('blocitoff')
    .controller('homeCtrl',['currentAuth', 'homeFactory','$firebaseAuth', homeCtrl]);

})();
