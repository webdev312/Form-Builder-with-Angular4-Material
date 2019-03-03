function DialogController(dataFactory, dialog){
  this.df = dataFactory;
  this.dialog = dialog;
};

angular.module('myApp').component('dialog', {
  templateUrl: 'staff/common/dialog/_dialog.html',
  controller: DialogController,
  bindings: {},
  transclude: {
    'header': '?header',
    'content': 'content',
    'controls': '?controls'
  }
});
