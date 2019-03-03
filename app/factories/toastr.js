app.factory('toastr', ['$mdToast', function dataFactory($mdToast){
  var factory = {};

  factory.success = function(message, header){
    $mdToast.show(
      $mdToast.simple().position('top right').textContent(message).theme("success-toast").hideDelay(3000)
    );
  }

  factory.error = function(message, header){
    $mdToast.show(
      $mdToast.simple().position('top right').textContent(message).theme("error-toast").hideDelay(3000)
    );
  }

  return factory;
}])
