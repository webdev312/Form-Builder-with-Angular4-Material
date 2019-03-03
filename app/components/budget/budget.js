function BudgetController(dataFactory, dialog, toastr, $scope){
  this.onInit = function(){
    this.df = dataFactory;
    this.dialog = dialog

    this.new_bc = {};
    this.new_ba = {};
    this.selected_bc = {};
    for (var i = 0; i < this.budget.budget_activities.length; i++) {
      this.selected_bc[this.budget.budget_activities[i].id] = [];
    }
    this.selected_ba = [];
    this.editingBC = {};
    this.editingBA = {};

    this.units = ['Month', 'Semester', "Year", "Item", "Credit"];

    this.promise_bc = {};

    this.df.getBudgetCategories();

    this.budget_select = [];
  }


  this.saveActivity = () => {
    if ($scope.BAForm.$valid){
      this.dialog.close();
    } else {
      toastr.error('Cannot save because form is not valid');
    }
  }

  this.newComponent = (ev, a) => {
    this.editingBC = this.new_bc;
    this.editingBC.budget_activity_id = a.id;
    dialog.show(ev, '#editBudgetComponent').then( () => {
      this.df.saveBudgetComponent(this.editingBC).then( () => {
        this.promise_bc = this.df.refreshBudgets(this.df.submission.s.id)
        // this.promise_bc = this.df.getSubmission(this.df.submission.s.id)

        this.new_bc = {};
      });
    }, () => {
      this.df.saveBudgetComponent(this.editingBC).then( () => {
        this.promise_bc = this.df.refreshBudgets(this.df.submission.s.id)
        // this.promise_bc = this.df.getSubmission(this.df.submission.s.id)
        this.new_bc = {};
      });
    });
  }

  var saveForm = () => {
     return this.df.saveBudgetActivity(this.editingBA).then( () => {
       this.promise_bc = this.df.refreshBudgets(this.df.submission.s.id)
      //  this.promise_bc = this.df.getSubmission(this.df.submission.s.id);
       this.new_ba = {};
    });
  }

  this.newActivity = (ev) => {
    this.editingBA = this.new_ba;
    this.editingBA.budget_id = this.budget.id;
    dialog.show(ev, '#editBudgetActivity').then( () => {
      if ($scope.BAForm.$valid ){
        saveForm();
      } else {
        toastr.success('Form was not valid. Unable to  save.')
      }

    }, () => {
      if ($scope.BAForm.$valid ){
        saveForm();
      } else {
        toastr.success('Form was not valid. Unable to  save.')
      }
    });
  }

  this.deleteSelectedBC = ($event, a) => {
    if (window.confirm("Are You Sure?")){
      this.df.deleteSelectedBC(this.selected_bc[a.id]).then( () => {
        this.selected_bc[a.id] = [] ;
        toastr.success('Deleted Successfully', 'Success');
        this.promise_bc = this.df.refreshBudgets(this.df.submission.s.id)
        // this.promise_bc = this.df.getSubmission(this.df.submission.s.id);
      })
    }
  }

  this.deleteBA = ($event, a) => {
    if (window.confirm("Are You Sure?")){
      this.df.deleteBA(a).then( () => {
        toastr.success('Deleted Successfully', 'Success');
        this.promise_bc = this.df.refreshBudgets(this.df.submission.s.id)
        // this.promise_bc = this.df.getSubmission(this.df.submission.s.id);
      })
    }
  }
  this.editComponent = (c, ev) => {
    this.editingBC = c;
    this.dialog.show(ev, '#editBudgetComponent').then( () => {
      this.df.saveBudgetComponent(this.editingBC);
      this.promise_bc = this.df.refreshBudgets(this.df.submission.s.id)
      // this.promise_bc = this.df.getSubmission(this.df.submission.s.id);
    }, () => {
      this.df.saveBudgetComponent(this.editingBC);
      this.promise_bc = this.df.refreshBudgets(this.df.submission.s.id)
      // this.promise_bc = this.df.getSubmission(this.df.submission.s.id);
    });
  }
};

angular.module('myApp').component('budget', {
  templateUrl: 'components/budget/_budget.html',
  controller: BudgetController,
  bindings: {
    budget: "=",
    readonly: "<"
  }
});
