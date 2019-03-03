app.service('dialog', ['$mdDialog', function dataFactory($mdDialog){
  this.open = [];
  this.show = function(ev, id){
    this.open.push(id)
    return $mdDialog.show({
      contentElement: id,
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: false,
      fullscreen: true
    });
  }
  this.close = function(id){
    remove(id);
    $mdDialog.hide();
  }

  var remove = (search_term) => {
    for (var i=this.open.length-1; i>=0; i--) {
        if (this.open[i] === search_term) {
            this.open.splice(i, 1);
            // break;       //<-- Uncomment  if only the first term has to be removed
        }
    }
  }
}])
