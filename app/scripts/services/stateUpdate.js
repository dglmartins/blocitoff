//creates a re-usable factory of stateless firebase functions
(function() {
  function stateUpdate() {
    //auth functions

    return function(controller, action, stateReducer) {
      const prevState = controller.state;
      const nextState = stateReducer(controller.state, action);
      const stateChangeLog = { prevState: prevState, action: action, nextState: nextState};
      console.log(stateChangeLog);
      controller.state = nextState; //only mutation. Here we could R.append to state history array instead
    };

  }

  angular
    .module('blocitoff')
    .factory('stateUpdate', [stateUpdate]);

})();
