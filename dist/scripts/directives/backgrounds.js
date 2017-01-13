(function() {
  function backgrounds() {
    return {
        link: function(scope, elm){
            // console.log(scope);
            switch (scope.task.priority) {
              case "1":
                elm[0].cells[0].style.backgroundColor = '#ea7a87';
                break;
              case "2":
                elm[0].cells[0].style.backgroundColor = '#ffbb00';
                break;
              case "3":
                elm[0].cells[0].style.backgroundColor = '#86ac41';
                break;
              }
        }
    }
  }

  angular
    .module('blocitoff')
    .directive('backgrounds', [backgrounds]);
})();
