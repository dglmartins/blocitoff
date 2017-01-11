(function() {
  function homeFactory($state, stateUpdate, firebaseFunctions) {
    //initializes state;
    homeFactory.intializeState = function(home, currentAuth) {
      getTasks(currentAuth).then(function(results) {
        home.state = { currentAuth: currentAuth, viewingSpinner: false, activeTasks: results};
      });
    };
    
    //functions accessed from view through controller

    homeFactory.signOut = function(firebaseAuth) {
      firebaseFunctions.signOut(firebaseAuth);
        $state.reload();
    };

    //private functions
    const getTasks = function(currentAuth) {
      const ref = firebaseDbRef.child('users/' + currentAuth.uid + '/tasks').orderByChild('createdAtMilliseconds');

      return firebaseFunctions.getFirebaseArray(ref).then(function(results) {
        return results;
      });
    }


    return homeFactory;
  }

  angular
    .module('blocitoff')
    .factory('homeFactory', ['$state','stateUpdate', 'firebaseFunctions', homeFactory]);

})();
