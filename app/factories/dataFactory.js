angular.module('myApp').factory('dataFactory', ['$http', '$stateParams', '$mdToast', 'toastr', 'Upload', '$timeout', '$auth', '$q', function dataFactory($http, $stateParams, $mdToast, toastr, Upload, $timeout, $auth, $q ){
  var factory = {};
  // LISTS
  factory.programs = [];
  factory.models = [];

  factory.submissions = [];
  factory.submissions_page = 1;

  factory.settings = {};
  factory.currency_list = [];
  factory.actions_required = [];
  factory.workflows = [];
  factory.taxonomies = [];
  factory.access_logs = [];
  factory.access_logs_page = 1;
  factory.access_logs_max_page = -1;
  factory.access_logs_staff = [];
  factory.access_logs_blocked = [];
  factory.roles = [];
  factory.letters_templates = [];
  factory.workflow_states = [];
  factory.new_workflow_name ='';
  factory.imports = [];
  factory.import_logs = [];
  factory.import_errors = [];
  factory.states = [];
  factory.new_state = {};
  factory.views = [];
  factory.view_elements = [];
  factory.view_elements_tree = [];
  factory.my_permissions = [];

  factory.models_fields = {};


  // SUBMISSION
  factory.workflow = {};
  factory.submission = {};
  factory.actions = [];
  factory.state = {};
  factory.model_tasks = [];
  factory.state_events = [];

  factory.users = [];
  factory.users_page = 1;

  factory.user = {};
  factory.organization = {};
  factory.multi_element_values = [];
  factory.multi_element_groups = [];
  factory.organizations = [];
  factory.virtual_columns = [];
  factory.current_model = {};
  factory.current_submissions = [];
  factory.virtual_fields = [];
  factory.hq_s = {};
  factory.field_s = {};
  factory.my_account = null;

  // PERMISSIONS
  factory.getPermissions = () => {
    return $http.get('/api/admin/my_permissions').then((res) => {
      factory.my_permissions = res.data.reduce(function(result, item){
        result[item.id] = item
        return result
      }, {})
    })
  }

  // BANK ACCOUNTS
  factory.saveBankAccount = function(ba){
    return $http.post('/api/staff/bank_account', {bank_account: ba})
  }

  factory.delete_selected_ba = function(array){
    return $http.post('/api/staff/bank_account/delete', {bank_account: array})
  }

  factory.refreshBudgets = (submission_id) => {
    return $http.get('/api/staff/budgets/' + submission_id).then((res) => {
      factory.submission.budgets = res.data
    })
  }

  factory.deleteBA = function(a){
    return $http.post('/api/staff/budget_activity/delete', {budget_activity: a})
  }
// INSTALMENT
  factory.saveInstalment = function(instalment){
    return $http.post('/api/staff/instalment', {instalment: instalment})
  }

    factory.delete_selected_instalments = function(array){
      return $http.post('/api/staff/instalment/delete', {instalments: array})
    }


  // BUDGET
  factory.saveBudgetComponent = function(bc){
    return $http.post('/api/staff/budget_component', {budget_component: bc})
  }

  factory.saveBudgetActivity = function(ba){
    return $http.post('/api/staff/budget_activity', {budget_activity: ba})
  }

  factory.getBudgetCategories = () => {
    return $http.get('/api/staff/budget_category/list').then( (res) => {
      factory.budget_categories = res.data
    }, () => {
      toastr.error('There was an error loading Budget Categories', 'Error')
    })
  }
  // REPORTS
  factory.saveReport = (r) => {
    return $http.post('api/staff/report', {report: r}).then( (res) => {
    }, () => {
      toastr.error('There was an error saving the Narrative Report', 'Error')
    })
  }

  factory.delete_selected_reports = (array) => {
    return $http.post('/api/staff/report/delete', {reports: array})
  }

// SETTINGS
  factory.getSettings = function(){
    return $http.get('/api/admin/settings').then(function(res){
      factory.settings = res.data
    })
  }

  factory.saveSettings = function(){
    return $http.post('/api/admin/settings', {settings: factory.settings}).then(function(res){
    })
  }

  factory.deleteSelectedBC = function(array){
    return $http.post('/api/staff/budget_component/delete', {budget_components: array})
  }

  factory.getCurrencyList = () => {
    if (factory.currency_list.length == 0) {
      return $http.get('/api/common/currency/list').then( (res) => {
        factory.currency_list = res.data;
      })
    }
  }



// SUBMISSIONS
  factory.getSubmissions = function(page){
    factory.submission_page = parseInt(page, 10);
    return $http.get('/api/staff/submissions?page=' + page).success(function(data){
      factory.submissions = data;
    });
  }

  factory.createSubmission = function(model_id){
    return $http.post('/api/grantee/create_submission?model_id=' + model_id)
  }

  factory.getSearchSubmissions = function(search, page, filters, model_id){
    fs = JSON.stringify(filters)
    factory.submission_page = parseInt(page, 30);
    return $http.get('/api/staff/submissions?q=' + search + '&page=' + page + '&filters=' + fs + '&model=' + model_id).success(function(data){
      factory.submissions = data;
    });
  }

  factory.submissionLoadNextPage = function(search, page, filters, model_id){
    fs = JSON.stringify(filters)
    factory.submission_page = parseInt(page, 30);
    return $http.get('/api/staff/submissions?q=' + search + '&page=' + page + '&filters=' + fs + '&model=' + model_id).success(function(data){
      factory.submissions.push.apply(factory.submissions, data)
    });
  };

  factory.changeState =  function(submission_id, event_id){
    return $http.post('/api/staff/submission/' + submission_id + '/change_state/' + event_id).then(function(res){
      $mdToast.show(
        $mdToast.simple().position('top right').textContent('Changed State!').hideDelay(3000)
      );
      factory.getSubmission(submission_id)
    }, function(){
      $mdToast.show(
        $mdToast.simple().position('top right').textContent('There was an error!').hideDelay(3000)
      );
    })
  }

  factory.saveState = function(state){
    return $http.post('/api/staff/state', {'state': state}).then(function(res){
      toastr.success('State Saved', 'Success');
    }, function(){

    })
  }
  factory.saveEvent = function(e){
    return $http.post('/api/staff/event', {'event': e}).then(function(res){
      toastr.success('Events Saved', 'Success');
    }, function(){

    })
  }
  factory.deleteEvent = function(e){
    return $http.delete('/api/staff/event/' + e.id).then(function(res){
      toastr.success('Event Deleted')
    })
  }
  factory.saveTasks = function(tasks){
    return $http.post('/api/staff/state', {'tasks': tasks}).then(function(res){
      toastr.success('Tasks Saved', 'Success');
    }, function(){

    })
  }
  // INDICATORS
  factory.deleteIndicator = function(indicator){
    return $http.delete('/api/staff/indicator/' + indicator.id ).then(function(res){
      factory.getSubmission(factory.submission.s.id);
      $mdToast.show(
        $mdToast.simple().position('top right').textContent('Indicator deleted successfully!').hideDelay(3000)
      );
    }, function(){
      $mdToast.show(
        $mdToast.simple().position('top right').textContent('Could\'nd delete indicator!').hideDelay(3000)
      );
    })
  }

  factory.saveIndicator = function(indicator){
    return $http.post('/api/staff/indicator', {indicator: indicator}).then(function(res){
      factory.getSubmission(factory.submission.s.id);
      $mdToast.show(
        $mdToast.simple().position('top right').textContent('Indicator saved successfully!').hideDelay(3000)
      );
    }, function(){
      $mdToast.show(
        $mdToast.simple().position('top right').textContent('Could\'nd save indicator!').hideDelay(3000)
      );
    })
  }
  factory.addIndicator = function(indicator){
    return $http.post('/api/staff/indicator', {indicator: indicator}).then(function(res){
      factory.getSubmission(factory.submission.s.id);
      $mdToast.show(
        $mdToast.simple().position('top right').textContent('Indicator added successfully!').hideDelay(3000)
      );
    }, function(){
      $mdToast.show(
        $mdToast.simple().position('top right').textContent('Could\'nd save indicator!').hideDelay(3000)
      );
    })
  }
  // NOTES
  factory.addNote = function(note){
    return $http.post('/api/staff/note', {note: note}).then(function(res){
      factory.getSubmission(factory.submission.s.id);
      $mdToast.show(
        $mdToast.simple().position('top right').textContent('Note added successfully!').hideDelay(3000)
      );
    }, function(){
      $mdToast.show(
        $mdToast.simple().position('top right').textContent('Could\'nd save note!').hideDelay(3000)
      );
    })
  }
  // LETTERS AND COMMUNICATIONS
  factory.deleteLetter = function(letter){
    return $http.delete('/api/admin/communication/' + letter.id ).then(function(res){
      var index = factory.letters_templates.indexOf(letter);
      factory.letters_templates.splice(index, 1);
      $mdToast.show(
        $mdToast.simple().position('top right').textContent('Letter delete successfully!').hideDelay(3000)
      );
    }, function(){
      $mdToast.show(
        $mdToast.simple().position('top right').textContent('Could\'nd delete letter!').hideDelay(3000)
      );
    })
  }

  factory.saveLetter = function(old_letter, letter){
    return $http.post('/api/admin/communication', {template: letter}).then(function(res){
      var index = factory.letters_templates.indexOf(old_letter);
      factory.letters_templates[index] = letter;
      $mdToast.show(
        $mdToast.simple().position('top right').textContent('Letter saved successfully!').hideDelay(3000)
      );
    }, function(){
      $mdToast.show(
        $mdToast.simple().position('top right').textContent('Could\'nd save letter!').hideDelay(3000)
      );
    })
  }
  factory.addLetter = function(letter){
    return $http.post('/api/admin/communication', {template: letter}).then(function(res){
      factory.letters_templates.push(letter);
      $mdToast.show(
        $mdToast.simple().position('top right').textContent('Letter added successfully!').hideDelay(3000)
      );
    }, function(){
      $mdToast.show(
        $mdToast.simple().position('top right').textContent('Could\'nd save letter!').hideDelay(3000)
      );
    })
  }

  // UPLOAD FILES
  factory.uploadFile = function(file, id, type){
    if (file && !file.$error) {
      file.upload = Upload.upload({
        url: '/api/staff/file_upload?id=' + id + '&type=' + type,
        file: file
      });

      file.upload.then(function (response) {
        factory.getSubmission(factory.submission.s.id);
        $timeout(function () {
          file.result = response.data;
        });
      }, function (response) {
        if (response.status > 0){}
      });

      file.upload.progress(function (evt) {
        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });
    }
  }
  // USE FOR PUBLIC IMAGE ONLY

  factory.deleteFile = (doc_id) => {
    $http.delete('/api/staff/file/' + doc_id)
  }
  factory.uploadFilePublic = function(file){
    if (file && !file.$error) {
      file.upload = Upload.upload({
        url: '/api/staff/file_upload_public',
        file: file
      });

      file.upload.then(function (response) {
        $http.post('/api/admin/settings', {settings: {'logo_file': '/uploads/' + response.config.file.name}}).then(function(res){
          factory.getSettings();
        });
      }, function (response) {
        if (response.status > 0){}
      });

      file.upload.progress(function (evt) {
        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });
    }
  }

  factory.uploadGranteeFile = function(file, id, type){
    if (file && !file.$error) {
      file.upload = Upload.upload({
        url: '/api/staff/file_upload_grantee?id=' + id + '&type=' + type,
        file: file
      });

      file.upload.then(function (response) {
        factory.getSubmission(factory.submission.s.id);
        $timeout(function () {
          file.result = response.data;
        });
      }, function (response) {
        if (response.status > 0){}
      });

      file.upload.progress(function (evt) {
        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });
    }
  }

  factory.uploadGranteeFile2 = function(file, id, type, virtual_column_id){
    if (file && !file.$error) {
      file.upload = Upload.upload({
        url: '/api/staff/file_upload_grantee2?id=' + id + '&type=' + type + '&virtual_column_id=' + virtual_column_id,
        file: file
      });

      file.upload.progress(function (evt) {
        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });

      return file.upload.then(function (response) {
        // factory.getSubmission(factory.submission.s.id);
        $timeout(function () {
          file.result = response.data;
        });
        return response
      }, function (response) {
        if (response.status > 0){}
      });
    }
  }

  // SETTINGS: VIEWS
  factory.getViewElements = function(view_id){
    return $http.get('/admin/views/'+ view_id + '.json').then(function (res){
      factory.view_elements = res.data
    });
  }

  factory.getViewElementsTree = function(view_id){
    return $http.get('/api/staff/view_elements/list/'+ view_id).then(function (res){
      factory.view_elements_tree = res.data
    });
  }

  factory.saveViewElementsTree = function(vet, deleted, view_id){
    return $http.post('/api/staff/view_elements', {node: vet, deleted: deleted, view_id: view_id}).then(function(res){
      toastr.success('view elements saved successfully');
    })
  }

  factory.saveViewElement = (item) => {
    return $http.post('/api/staff/view_element', {item: item})
  }

  factory.deleteViewElementWithChildren = function(ve){
    return $http.delete('/api/staff/view_element_with_children/' + ve.id).then(function(){
      factory.removeElementFromTree(ve, factory.view_elements_tree)
      toastr.success('view elements deleted');
    })
  }

  factory.removeElementFromTree = function(item, tree){
    for (var i = 0; i < tree.length; i++) {
      if (tree[i].children != null){
        factory.removeElementFromTree(item, tree[i].children)
      }
      if (tree[i] == item){
        tree.splice(i, 1)
      }
    }
  }
  // ### ###

  factory.getStates =  function(workflow_id){
    return $http.get('/api/admin/states?workflow_id=' + workflow_id).then(function(res){
      factory.states = res.data;
    }, function(){

    })
  }

  factory.getImports = function(){
    return $http.get('/api/admin/imports').then(function(res){
      factory.imports = res.data;
    }, function(){

    })
  }

  factory.getImportLogs = function(id){
    return $http.get('/api/admin/imports/logs/' + id).then(function(res){
      factory.import_logs = res.data;
    }, function(){

    })
  }

  factory.getImportErrors = function(id){
    return $http.get('/api/admin/imports/errors/' + id).then(function(res){
      factory.import_errors = res.data;
    }, function(){

    })
  }

  factory.getImportAssociation = function(id){
    return $http.get('/api/admin/imports/association/' + id).then(function(res){
      factory.import_associations = res.data;
    }, function(){

    });
  }
  factory.deleteImport = function(id){
    return $http.post('/api/admin/import/delete/' + id).then(function(res){
      factory.getImports();
    }, function(){

    })
  }

  factory.getWorkflow = function(id){
    return $http.get('/api/admin/workflow/' + id + '/w').success(function(data){
      factory.workflow = data;
    });
  }
  factory.getWorkflowStates = function(id){
    return $http.get('/api/admin/workflow/' + id + '/states').success(function(data){
      factory.workflow_states = data;
    });
  }
  factory.saveNewWorkflow = function(){
    return $http.post('/api/admin/new_workflow', {workflow_name: factory.new_workflow_name}).then(function(res){
      factory.getWorkflows();
      factory.new_workflow_name = '';
    })
  }

  factory.deleteWorkflow = function(id){
    if(confirm("Are you sure you want to delete this workflow?")){
      return $http.delete('/api/admin/workflow/' + id).then(function(){
        factory.getWorkflows();
        toastr.success('Workflow State Added', 'Success');
      })
    }
  }

  factory.saveNewWorkflowState = function(){
    return $http.post('/api/admin/workflow/state', {state: factory.new_state}).then(function(res){
      factory.getWorkflows();
      toastr.success('Workflow State Added', 'Success');
      factory.new_state = {};
      return res;
    });
  }

  factory.getState = function(id){
    return $http.get('/api/admin/state/' + id).then(function(res){
      factory.state = res.data;
      factory.getModelTasks(factory.state.name);
      factory.getStateEvents(factory.state.name, factory.state.workflow_id)
    }, function(){

    })
  }
  factory.getModelTasks = function(workflow_state){
    return $http.get('/api/admin/model_tasks/' + workflow_state).then(function(res){
      factory.model_tasks = res.data;
    }, function(){

    })
  }

  factory.getMyWorkflowActions = function(workflow_state){
    return $http.get('/api/admin/model_tasks/' + workflow_state).then(function(res){
      factory.model_tasks = res.data;
    }, function(){

    })
  }

  factory.getStateEvents = function(workflow_state, workflow_id){
    return $http.get('/api/admin/state_events/' + workflow_state + '/' + workflow_id).then(function(res){
      factory.state_events = res.data;
    }, function(){

    })
  }

  factory.getWorkflows = function(){
    return $http.get('/api/admin/workflows_list').success(function(data){
      factory.workflows = data;
    });
  }

  factory.getAccessLogs = function(page){
    return $http.get('/api/admin/access_logs?page=' + page).success(function(data){
      factory.access_logs = data;
    });
  }

  factory.getAccessLogsStaff = function(page){
    return $http.get('/api/admin/access_logs_staff?page=' + page).success(function(data){
      factory.access_logs_staff = data;
    });
  }

  factory.getAccessLogsBlocked = function(){
    return $http.get('/api/admin/access_logs_blocked').success(function(data){
      factory.access_logs_blocked = data;
    });
  }

  factory.getLettersTemplates = function(){
    return $http.get('/api/admin/communication').success(function(data){
      factory.letters_templates = data;
    });
  }

  factory.getRoles = function(){
    return $http.get('/api/admin/roles_list').success(function(data){
      factory.roles = data;
    });
  }

  factory.getTaxonomies = function(){
    return $http.get('/api/staff/multi_element_groups').success(function(data){
      factory.taxonomies = data;
    });
  }

  factory.getMultiElementValues = function(){
    return $http.get('/api/staff/multi_element_values').success(function(data){
      factory.multi_element_values = data;
    });
  }

  factory.getMultiElementGroups = function(){
    return $http.get('/api/staff/multi_element_groups').success(function(data){
      factory.multi_element_groups = data;
    });
  }

  factory.getActions = function(id){
    return $http.get('/api/staff/actions/' + id).then(function(result){
      factory.actions = result.data
    }, function(result){

    })
  }

  factory.getActionsRequired = function(model_id){
    return $http.get('/api/staff/actions_required/' + model_id).then(function(result){
      factory.actions_required = result.data
    }, function(result){

    })
  }

  factory.getFields = function(model_id){
    return $http.get('/api/staff/model_fields/' + model_id).then(function(result){
      factory.virtual_fields = result.data;
    }, function(result){})
  }

  factory.getSubmission = function(id){
    return $http.get('/api/staff/submission/' + id).then(function(result){
      factory.submission = result.data
      convertToDate(factory.submission.fields);
    }, function(result){

    })
  }

  var convertToDate = function(array){
    if (array){
      for (var i = 0; i < array.length ; i++){
        if (array[i].kind == "block"){
          convertToDate(array[i].children)
          if (array[i].virtual_column != null){
            convertToDate(array[i].virtual_column.children)
          }
        }
        if (array[i].kind == 'date' && array[i].content != null){
          array[i].fdate = new Date(array[i].content)
          array[i].content = new Date(array[i].content)
        }
      }
    }
  }

  factory.saveApplication = function(model){
    return $http.post('/api/staff/submission/' + model.id, {model: model}).then(function(res){
      toastr.success('Application Saved', 'Success');
    })
  }

  factory.getSubmissionFields = function(id){
    return $http.get('/api/staff/dynamic_model/' + id + '/fields').then(function(result){
      factory.models_fields[id] = result.data
    }, function(result){})
  }

  factory.getModel = function(model_id){
    return $http.get('/api/model/' + model_id).success(function(data){
      factory.current_model = data
      factory.current_model.available_from = new Date(data.available_from);
      factory.current_model.available_to = new Date(data.available_to);
    });
  }

  factory.getModels = function(){
    return $http.get('/api/models').success(function(data){
      factory.models = data;
      factory.programs = data;
    });
  }

  factory.getViews = function(){
    $http.get('/api/view_list/' + $stateParams.id + '.json').success(function(data){
        factory.views = data
    });
  }

  factory.getField = function(){
    return $http.get('/api/workflow/approval_total/' + $stateParams['id'] + '/' + 'field' ).then(function(result){
      factory.field_s = result.data
    }, function() {
    });
  }
  factory.getHq = function(){
    return $http.get('/api/workflow/approval_total/' + $stateParams['id'] + '/' + 'hq' ).then(function(result){
      factory.hq_s = result.data
    }, function() {
    });
  }

// USERS
  factory.getUsers = function(page){
    return $http.get('/api/users/' + page).success(function(data){
      factory.users = data
    });
  }

  factory.saveUser = function(user){
    return $http.post('/api/users', {user: user}).then( (data) => {

    })
  }

  factory.userSearch = (search, page, filters) => {
    fs = JSON.stringify(filters)
    factory.submission_page = parseInt(page, 30);

    return $http.get('/api/staff/users/search?q=' + search + '&page=' + page + '&filters=' + fs).success(function(data){
      factory.users =  data
    });
  }

  factory.organizationSearch = (search, page, filters) => {
    fs = JSON.stringify(filters)
    factory.submission_page = parseInt(page, 30);

    return $http.get('/api/staff/organization/search?q=' + search + '&page=' + page + '&filters=' + fs).success(function(data){
      factory.organizations =  data
    });
  }

  factory.usersLoadNextPage = function(search, page, filters, model_id){
    fs = JSON.stringify(filters)
    factory.submission_page = parseInt(page, 30);

    // Reduced Version
    // return $http.get('/api/users/' + page).success(function(data){
    //   factory.users.push.apply(factory.users, data)
    // });

    return $http.get('/api/staff/users/search?q=' + search + '&page=' + page + '&filters=' + fs).success(function(data){
      factory.users.push.apply(factory.users, data)
    });
  };

  factory.organizationsLoadNextPage = function(search, page, filters, model_id){
    fs = JSON.stringify(filters)
    factory.submission_page = parseInt(page, 30);

    // Reduced Version
    // return $http.get('/api/users/' + page).success(function(data){
    //   factory.users.push.apply(factory.users, data)
    // });

    return $http.get('/api/staff/users/search?q=' + search + '&page=' + page + '&filters=' + fs).success(function(data){
      factory.users.push.apply(factory.users, data)
    });
  };


  factory.getUser = function(id){
    return $http.get('/api/staff/user/' + id).then(function(res){
      factory.user = res.data;
    }, function(res){})
  }

  factory.getOrganizations = function(){
    $http.get('/api/organizations').success(function(data){
      factory.organizations = data
    });
  }

  factory.getOrganization = function(id){
    return $http.get('/api/staff/organization/' + id).then(function(res){
      factory.organization = res.data;
    }, function(res){})
  }

  factory.saveOrganization = function(organization){
    return $http.post('/api/organizations', {organization: organization}).then( (data) => {

    })
  }

  factory.getVirtualColumns = function(){
    return $http.get('/api/staff/virtual_columns').then(function(res){
      factory.virtual_columns = res.data;
    })
  };

  factory.getVirtualColumns = function(view_id){
    return $http.get('/api/staff/virtual_columns/tree/' + view_id).then(function(res){
      factory.virtual_columns = res.data;
    })
  };

  if (factory.submissions == []){
    factory.getSubmissions(factory.submission_page);
  }

  factory.getAllData = function(){
    factory.getSubmissions(1);
    factory.getModels();
    factory.getOrganizations();
    factory.getVirtualColumns();

  }

  factory.activateAccount = (token) => {
    return $http.post('/api/activate_token', {token: token} );
  }

  factory.loginWithTokenAccount = (token) => {
    return $http.post('/api/login_with_token', {token: token});
  }

  factory.changePassword = (password) => {
    return $http.post('/api/change_password', {password: password})
  }

  factory.getMyAccount = () => {
    if($auth.isAuthenticated() == false){
      return $q.when();
    }
    return $http.get('/api/accounts/my_account').then((result) => {
      factory.my_account = result.data;
    });
  }

  factory.recoverPassword = (email) => {
    $http.post('/api/recover_password').then(() => {

    })
  }

  return factory;
}
]);
