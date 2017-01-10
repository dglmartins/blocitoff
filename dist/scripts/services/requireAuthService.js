//creates a re-usable factory that generates the $firebaseAuth instance
(function() {
  function requireAuthService() {
    //for resolve require auth in trying to access home.
    requireAuthService.requireAuth = function(firebaseAuth) {
      return new Promise(function(resolve, reject) {
        //the below runs on auth change. It first checks if there is firebase user, if not rejects the promise with error "AUTH_REQUIRED". If there is a user it gets the user_id of the user logged in and continues to check if user is Admin.
        firebaseAuth().$onAuthStateChanged(function(firebaseUser) {
          if (!firebaseUser) {


            //No firebase user here.  Promise is rejected.

            reject("AUTH_REQUIRED");

          //firebaseUser here (maybe not Admin). Assigns the user to currentAuth and fetches user_id from firebase. Will check if user is admin.
          } else {
            resolve(firebaseUser);
          }
    		});
      });
    };
    return requireAuthService;
  }

  angular
    .module('blocitoff')
    .factory('requireAuthService', [requireAuthService]);

})();
