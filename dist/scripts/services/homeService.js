(function() {
  function homeService($state, stateUpdate, $timeout, firebaseFunctions) {
    //initializes state;
    homeService.intializeState = function(home, currentAuth) {
      home.state = {currentAuth: currentAuth, viewingSpinner: true, viewActiveTasks: true} //initial state
      getFirebaseTasks(currentAuth).then(function(results) { //gets firebase array then

        stateUpdate(home, actions.addFirebaseArray(results), homeStateReducer); //adds firebase array to state
        stateUpdate(home, actions.updateTasks(results), homeStateReducer); // adds active/inative tasks to state

        stateUpdate(home, actions.applyBackgrounds(home.state.activeTasks), homeStateReducer); //adds backgrounds color order to state

        stateUpdate(home, actions.stopSpinner(), homeStateReducer); // stops spinner in state

        home.state.firebaseArray.$watch(function(event) { //watches firebase array, if changes, redoes active/inative split
          stateUpdate(home, actions.updateTasks(home.state.firebaseArray), homeStateReducer);
          stateUpdate(home, actions.applyBackgrounds(home.state.activeTasks), homeStateReducer);
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
        case 'RESET_INPUTS':
        case 'APPLY_BACKGROUNDS':
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
      },
      resetInputs() {
        return { type: 'RESET_INPUTS', payload: { boundInputs: { newTaskDescription: '', newTaskPriority: ''}}};
      },
      applyBackgrounds(activeTasks) {
        return { type: 'APPLY_BACKGROUNDS', payload: applyBackgrounds(activeTasks)};
      }
    };


    //functions accessed from view through controller
    homeService.toggleTasksView = function(home, bool) {
      stateUpdate(home, actions.toggleTasksView(bool), homeStateReducer);
    };

    homeService.markComplete = function (home, task) {
      const record = home.state.firebaseArray.$getRecord(task.$id);
      record.status = "complete";
      home.state.firebaseArray.$save(record);
    };

    homeService.saveTask = function(home) {
      const data = {
        createdAtMilliseconds: new Date().getTime(),
        description: home.state.boundInputs.newTaskDescription,
        priority: home.state.boundInputs.newTaskPriority,
        status: 'incomplete'
      };
      firebaseFunctions.addRecord(home.state.firebaseArray, data).then(function(){
        console.log('im here once');
        stateUpdate(home, actions.resetInputs(), homeStateReducer);
      });
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
      const priorityThenTimeSort = R.sortWith([R.ascend(R.prop('priority')), R.descend(R.prop('createdAtMilliseconds'))]);
      const activeTasks = priorityThenTimeSort(R.filter(notExpiredAndIncomplete, firebaseArray));
      const inactiveTasks = priorityThenTimeSort(R.filter(expiredOrComplete, firebaseArray));
      //applies backgrounds

      return {activeTasks: activeTasks, inactiveTasks: inactiveTasks};
    };

    const applyBackgrounds = function(activeTasks) {
      const assignColor = (task) => {
        switch (task.priority) {
          case "1":
            return '#ea7a87';
            break;
          case "2":
            return '#ffbb00';
            break;
          case "3":
            return '#86ac41';
            break;
        }
      };
      const bgColorsArray = R.map(assignColor, activeTasks);
      const mapIndexed = R.addIndex(R.map);
      $timeout(function() {
        const tasks = document.getElementsByClassName('active-task-description');
        const test = mapIndexed((val, idx) => val.style.backgroundColor = bgColorsArray[idx], tasks);
      });
      return {bgColors: bgColorsArray}
    };

    return homeService;
  }

  angular
    .module('blocitoff')
    .factory('homeService', ['$state','stateUpdate', '$timeout',  'firebaseFunctions', homeService]);

})();
