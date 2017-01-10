//creates a re-usable factory that generates the $firebaseAuth instance
(function() {
  function AuthFactory($state) {

    //initializes state;
    AuthFactory.intializeState = function() {
      return {
        resettingPassword: false,
        viewingSpinner: false,
        boundInputs: {
          email: '',
          password: ''
        }
      };
    };

    //returns a new state obj, given state and action
    const stateReducer = function(state, action) {
      if (!action || !action.type) {
        return state;
      }
      switch (action.type) {
        case 'TOGGLE_RESET_PASS':
        case 'START_SPINNER':
        case 'STOP_SPINNER':
        case 'RESET_INPUTS':
          return R.merge(state, action.payload);
        default:
          return state;
      }
    };

    const stateUpdate = function(auth, action) {
      const prevState = auth.state;
      const nextState = stateReducer(auth.state, action);
      const stateChangeLog = {
        prevState: prevState,
        action: action,
        nextState: nextState
      };
      console.log(stateChangeLog);
      auth.state = nextState; //only mutation. Here we could R.append to state history array instead
    };

    //change view state actions
    const actions = {
      toggleResetPassword(bool) {
        return { type: 'TOGGLE_RESET_PASS', payload: { resettingPassword: bool }};
      },
      startSpinner() {
        return { type: 'START_SPINNER', payload: { viewingSpinner: true }};
      },
      stopSpinner() {
        return { type: 'STOP_SPINNER', payload: { viewingSpinner: false}};
      },
      resetInputs() {
        return {
          type: 'RESET_INPUTS',
          payload: { boundInputs: { email: '', password: ''}}
        };
      }
    };

    //functions accessed from view through controller

    //calls toggleResetPassword action and updates states.
    AuthFactory.toggleResetPassword = function(auth, bool) {
      stateUpdate(auth, actions.toggleResetPassword(bool));
    };

    //calls spinner and reset fields actions and updates states
    AuthFactory.signIn = function(auth, firebaseAuth) {
      stateUpdate(auth, actions.startSpinner());
      firebaseSignIn(auth.state.boundInputs, firebaseAuth).then(function() {
        stateUpdate(auth, actions.stopSpinner());
        stateUpdate(auth, actions.resetInputs());
      });
    };

    AuthFactory.resetPassword = function(auth, firebaseAuth) {
      stateUpdate(auth, actions.startSpinner());
      firebaseResetPassword(auth.state.boundInputs, firebaseAuth).then(function() {
        stateUpdate(auth, actions.stopSpinner());
      });
    };

    AuthFactory.createUser = function(auth, firebaseAuth) {
      // Create a new user
      stateUpdate(auth, actions.startSpinner());
      firebaseCreateUser(auth.state.boundInputs, firebaseAuth).then(function() {
        stateUpdate(auth, actions.stopSpinner());
      });
    };

    //private firebase functions
    function firebaseSignIn(inputs, firebaseAuth) {
        return firebaseAuth().$signInWithEmailAndPassword(inputs.email.toLowerCase(), inputs.password).then(function(firebaseUser) {
        $state.go('home');
        }).catch(function(error) {
          alert(error);
        });
    };

    function firebaseResetPassword(inputs, firebaseAuth) {
      return firebaseAuth().$sendPasswordResetEmail(inputs.email.toLowerCase()).then(function() {
        alert("Password reset email sent successfully!");
      }).catch(function(error) {
        alert(error);
      });
    }

    function firebaseCreateUser(inputs, firebaseAuth) {
      return firebaseAuth().$createUserWithEmailAndPassword(inputs.email.toLowerCase(), inputs.password).then(function(firebaseUser) {
        console.log("User created with uid: " + firebaseUser.uid);
        $state.go('home');
      }).catch(function(error) {
        alert(error);
      });
    }

    return AuthFactory;
  }

  angular
    .module('blocitoff')
    .factory('AuthFactory', ['$state', AuthFactory]);

})();
