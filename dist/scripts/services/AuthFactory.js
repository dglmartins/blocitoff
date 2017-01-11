(function() {
  function authFactory($state, stateUpdate, firebaseFunctions) {
    //initializes state;
    authFactory.intializeState = function() {
      return { resettingPassword: false, viewingSpinner: false, boundInputs: { email: '', password: '' }};
    };

    //returns a new state obj, given state and action
    const authStateReducer = function(state, action) {
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
        return { type: 'RESET_INPUTS', payload: { boundInputs: { email: '', password: ''}}};
      }
    };

    //functions accessed from view through controller

    authFactory.toggleResetPassword = function(auth, bool) {
      stateUpdate(auth, actions.toggleResetPassword(bool), authStateReducer);
    };

    authFactory.signIn = function(auth, firebaseAuth) {
      stateUpdate(auth, actions.startSpinner(), authStateReducer);
      firebaseFunctions.signIn(auth.state.boundInputs, firebaseAuth).then(function() {
        stateUpdate(auth, actions.stopSpinner(), authStateReducer);
        stateUpdate(auth, actions.resetInputs(), authStateReducer);
        $state.go('home');
      });
    };

    authFactory.resetPassword = function(auth, firebaseAuth) {
      stateUpdate(auth, actions.startSpinner(), authStateReducer);
      firebaseFunctions.resetPassword(auth.state.boundInputs, firebaseAuth).then(function() {
        stateUpdate(auth, actions.stopSpinner(), authStateReducer);
      });
    };

    authFactory.createUser = function(auth, firebaseAuth) {
      // Create a new user
      stateUpdate(auth, actions.startSpinner(), authStateReducer);
      firebaseFunctions.createUser(auth.state.boundInputs, firebaseAuth).then(function() {
        stateUpdate(auth, actions.stopSpinner(), authStateReducer);
        $state.go('home');
      });
    };

    return authFactory;
  }

  angular
    .module('blocitoff')
    .factory('authFactory', ['$state', 'stateUpdate', 'firebaseFunctions', authFactory]);

})();
