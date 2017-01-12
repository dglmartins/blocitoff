(function() {
  function homeService($state, stateUpdate, firebaseFunctions) {
    //initializes state;
    homeService.intializeState = function(home, currentAuth) {
      home.state = {currentAuth: currentAuth, viewingSpinner: true, viewActiveTasks: true} //initial state
      getFirebaseTasks(currentAuth).then(function(results) { //gets firebase array then

        stateUpdate(home, actions.addFirebaseArray(results), homeStateReducer); //adds firebase array to state
        stateUpdate(home, actions.updateTasks(results), homeStateReducer); // adds active/inative tasks to state
        stateUpdate(home, actions.stopSpinner(), homeStateReducer); // stops spinner in state

        home.state.firebaseArray.$watch(function(event) { //watches firebase array, if changes, redoes active/inative split
          stateUpdate(home, actions.updateTasks(home.state.firebaseArray), homeStateReducer);
        });

      });
    };

    //returns a new state obj, given state and action
    const homeStateReducer = function(state, action) {
      if (!action || !action.type) {
        return state;
      }
      switch (action.type) {
        case 'START_SPINNER':
        case 'STOP_SPINNER':
        case 'UPDATE_TASKS':
        case 'ADD_FIREBASE_ARRAY':
        case 'TOGGLE_TASK_VIEW':
          return R.merge(state, action.payload);
        default:
          return state;
      }
    };

    //change view state actions
    const actions = {
      startSpinner() {
        return { type: 'START_SPINNER', payload: { viewingSpinner: true }};
      },
      stopSpinner() {
        return { type: 'STOP_SPINNER', payload: { viewingSpinner: false}};
      },
      addFirebaseArray(firebaseArray) {
        return { type: 'ADD_FIREBASE_ARRAY', payload: {firebaseArray: firebaseArray}};
      },
      updateTasks(firebaseArray) {
        return { type: 'UPDATE_TASKS', payload: splitTasksIntoActiveInactive(firebaseArray, 7)};
      },
      toggleTasksView(bool) {
        return { type: 'TOGGLE_TASK_VIEW', payload: {viewActiveTasks: bool}};
      }
    };


    //functions accessed from view through controller
    homeService.toggleTasksView = function(home, bool) {
      stateUpdate(home, actions.toggleTasksView(bool), homeStateReducer);
    };

    homeService.signOut = function(firebaseAuth) {
      firebaseFunctions.signOut(firebaseAuth);
        $state.reload();
    };


    //private functions
    const getFirebaseTasks = function(currentAuth) {
      const ref = firebaseDbRef.child('users/' + currentAuth.uid + '/tasks').orderByChild('createdAtMilliseconds');

      return firebaseFunctions.getFirebaseArray(ref).then(function(results) {
        return results;
      });
    };

    const splitTasksIntoActiveInactive = function(firebaseArray, expiryDays){
      //the time in milliseconds expiryDays ago
      const expiryDateMilliseconds = new Date().getTime() - expiryDays*24*60*60*1000;

      // returns true if task is not expired AND status: incomplete (active task)
      const notExpiredAndIncomplete = (task) => R.and(R.gt(R.prop("createdAtMilliseconds", task), expiryDateMilliseconds), R.propEq('status', 'incomplete')(task));

      // returns true if task is expired OR status: incomplete (inactive task)
      const expiredOrComplete = (task) => R.or(R.lt(R.prop("createdAtMilliseconds", task), expiryDateMilliseconds), R.propEq('status', 'complete')(task));

      //these return new filtered arrays
      const activeTasks = R.filter(notExpiredAndIncomplete, firebaseArray);
      const inactiveTasks = R.filter(expiredOrComplete, firebaseArray);;
      return {activeTasks: activeTasks, inactiveTasks: inactiveTasks};
    };

    return homeService;
  }

  angular
    .module('blocitoff')
    .factory('homeService', ['$state','stateUpdate', 'firebaseFunctions', homeService]);

})();
