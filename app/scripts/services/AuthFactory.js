//creates a re-usable factory that generates the $firebaseAuth instance
(function() {
  function AuthFactory($firebaseAuth, $state) {
    var AuthFactory = {};
    AuthFactory.firebaseAuth = $firebaseAuth();

    AuthFactory.requireAuth = function() {
      return new Promise(function(resolve, reject) {
        //the below runs on auth change. It first checks if there is firebase user, if not rejects the promise with error "AUTH_REQUIRED". If there is a user it gets the user_id of the user logged in and continues to check if user is Admin.
        $firebaseAuth().$onAuthStateChanged(function(firebaseUser) {
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

    AuthFactory.resetPassword = function(self) {
      var emailLowerCase = self.email.toLowerCase();
      $firebaseAuth().$sendPasswordResetEmail(emailLowerCase).then(function() {
        alert("Password reset email sent successfully!");
      }).catch(function(error) {
        alert(error);
        self.email = "";
      });
    };

    //sign in with email and password angularfire and redirect to home after sign in
    AuthFactory.signIn = function(self) {
      var emailLowerCase = self.email.toLowerCase();
      $firebaseAuth().$signInWithEmailAndPassword(emailLowerCase, self.password).then(function(firebaseUser) {
        $state.go('home');
			}).catch(function(error) {
				alert(error);
        self.email = '';
        self.password = '';
        document.getElementById('password-login-field').blur()
        document.getElementById('email-login-field').blur()
			});
    };

    AuthFactory.createUser = function(self) {

      // Create a new user
      AuthFactory.firebaseAuth.$createUserWithEmailAndPassword(self.email, self.password)
        .then(function(firebaseUser) {
          console.log("User created with uid: " + firebaseUser.uid);
          $state.go('home');
        }).catch(function(error) {
          alert(error);
        });
    };

    return AuthFactory;
  }

  angular
    .module('blocitoff')
    .factory('AuthFactory', ['$firebaseAuth', '$state', AuthFactory]);

})();
