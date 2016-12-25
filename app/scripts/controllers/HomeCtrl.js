//currentAuth here comes from state resolve and is the current firebaseUser
//only signed in users access home via resolve.
(function() {

  function HomeCtrl(currentAuth, $firebaseAuth, $state) {

    var self = this;
    self.currentAuth = currentAuth;

    //function for user to signOut. Calls angularfire $signOut on $firebaseAuth() via our AuthFactory (this.auth).
    //signs out
    self.signOut = function() {
      $firebaseAuth().$signOut();
      $state.go('login');
    };

  }

  angular
    .module('blocitoff')
    .controller('HomeCtrl',['currentAuth', '$firebaseAuth', '$state', HomeCtrl]);

})();
