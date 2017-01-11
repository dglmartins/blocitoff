//creates a re-usable factory of stateless firebase functions
(function() {
  function firebaseFunctions() {
    //auth functions
    firebaseFunctions.signIn = function(inputs, firebaseAuth) {
        return firebaseAuth().$signInWithEmailAndPassword(inputs.email.toLowerCase(), inputs.password).then(function(firebaseUser) {
          return firebaseUser;
        }).catch(function(error) {
          alert(error);
          return error;
        });
    };

    firebaseFunctions.resetPassword = function(inputs, firebaseAuth) {
      return firebaseAuth().$sendPasswordResetEmail(inputs.email.toLowerCase()).then(function(results) {
        alert("Password reset email sent successfully!");
        return results;
      }).catch(function(error) {
        alert(error);
        return error;
      });
    }

    firebaseFunctions.createUser = function(inputs, firebaseAuth) {
      return firebaseAuth().$createUserWithEmailAndPassword(inputs.email.toLowerCase(), inputs.password).then(function(firebaseUser) {
        console.log("User created with uid: " + firebaseUser.uid);
        return firebaseUser;
      }).catch(function(error) {
        alert(error);
        return error;
      });
    }

    return firebaseFunctions;
  }

  angular
    .module('blocitoff')
    .factory('firebaseFunctions', [firebaseFunctions]);

})();
