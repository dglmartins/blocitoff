//currentAuth here comes from state resolve and is the current firebaseUser
//only signed in users access home via resolve.
(function() {

  function homeCtrl(currentAuth, homeService, $firebaseAuth) {

    const home = this;
    homeService.intializeState(home, currentAuth);

    home.viewFunctions = {
      signOut() {
        homeService.signOut($firebaseAuth);
      },
      toggleTasksView(bool) {
        homeService.toggleTasksView(home, bool);
      },
      saveTask() {
        homeService.saveTask(home);
      },
      log(log) {
        console.log(log);
      }
    };

    console.log(home);

  }

  angular
    .module('blocitoff')
    .controller('homeCtrl',['currentAuth', 'homeService','$firebaseAuth', homeCtrl]);

})();
