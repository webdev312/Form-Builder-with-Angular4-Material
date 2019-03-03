'use strict';

angular.module('myApp.view1', ['ui.router', 'ngMaterial'])

.controller('View1Ctrl', ['$scope', '$rootScope', '$sce', '$mdDialog', '$location', function($scope, $rootScope, $sce, $mdDialog, $location) {
  $scope.nSelectedIndex = -1;

  $scope.rPan = {};  
  $scope.rPan.radioVal = "Yes";
  $scope.rPan.Option1 = "Yes";
  $scope.rPan.Option2 = "No";
  $scope.rPan.textField = "Name in pinyin";
  $scope.rPan.textValidation = "none";
  $scope.rPan.textArea = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam gravida venenatis";

  $scope.mPan = {}
  $scope.mPan.innerHTML = "";

  $scope.lPan = {}
  $scope.lPan.Score = {cur : 0, max : 0, total : "0/0"};
  $scope.lPan.blackhole = "<div class='md-black-hole' id='md-black-hole'></div>";
  $scope.lPan.innerHTML = $sce.trustAsHtml("");
  $scope.lPan.nBlockIndex = -1;
  $scope.lPan.nBlockSubIndex = -1;

  if ($rootScope.arrBlockList == undefined) $rootScope.arrBlockList = [];

  // JSON Template
  $scope.jsonEachBlock = {index : 0, isChild : false, arrChild : []};  
  $scope.arrJsonBlock = [
    {index : 1, isChild : false, arrChild : [], label_field : "What is the quality of the publications?", description : "This would impact ...", currating : 16, rating : 20},
    {index : 2, isChild : true, arrChild : [], label_field : "Proof of achievements"},
    {index : 3, isChild : false, arrChild : [], label_field : "Do you consider his/her experience pertinent for the program?", description : "This would be impact...", option1 : "Yes", option2 : "No", radioVal : "Yes", required : false},
    {index : 4, isChild : false, arrChild : [], label_field : "Tibetan Score Text evaluation", description : "Please add the name in pinyin transliteration", placeholder : "Name in pinyin", validation : "text", required : false},
    {index : 5, isChild : false, arrChild : [], label_field : "Final Comment on application", description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam gravida venenatis", placeholder : "Dear Alex", max_character : 500, required : false}
  ];

  // HTML Template
  $scope.arrHTMLTemplate = [
    {index : 1, template : ""},
    {index : 2, template : ""},
    {index : 3, template : ""},
    {index : 4, template : ""},
    {index : 5, template : ""}
  ];

  // Edit Template
  $scope.edit0 = {};
  $scope.edit0.label_field = "a";
  $scope.edit0.description = "b";
  $scope.edit0.rating = 0;

  $scope.edit1 = {};
  $scope.edit1.label_field = "";

  $scope.edit2 = {};
  $scope.edit2.label_field = "";
  $scope.edit2.description = "";
  $scope.edit2.option1 = "";
  $scope.edit2.option2 = "";
  $scope.edit2.required = false;

  $scope.edit3 = {};
  $scope.edit3.label_field = "";
  $scope.edit3.description = "";
  $scope.edit3.placeholder = "";
  $scope.edit3.validation = "";
  $scope.edit3.required = false;

  $scope.edit4 = {};
  $scope.edit4.label_field = "";
  $scope.edit4.description = "";
  $scope.edit4.placeholder = "";
  $scope.edit4.max_character = "";
  $scope.edit4.required = false;

  $scope.arrEdit = [$scope.edit0, $scope.edit1, $scope.edit2, $scope.edit3, $scope.edit4];

  $scope.onNext = function(){
    $location.path('/view2');
  }

  $scope.onMouseDown = function(index, $event){
    $scope.nSelectedIndex = index;
    $scope.mPan.innerHTML = $sce.trustAsHtml($scope.getBlockTemplate(index));
    $scope.onStartMoveTemplate($event.pageX, $event.pageY, true);
  }

  $scope.onMouseDownToDelete = function($event){
    var mouseX = $event.pageX;
    var mouseY = $event.pageY;
    for (var i = 0; i < $rootScope.arrBlockList.length; i ++){
      var rect = document.getElementById("lblock"+i).getBoundingClientRect();
      if ($scope.IsIncludeRect(mouseX, mouseY, rect)){
        if ($rootScope.arrBlockList[i].isChild == true){
          var bIsFind = false;
          for (var j = 0; j < $rootScope.arrBlockList[i].arrChild.length; j ++){
            var subrect = document.getElementById("lsubblock"+i+"_"+j).getBoundingClientRect();
            if ($scope.IsIncludeRect(mouseX, mouseY, subrect)){
              bIsFind = true;
              $scope.onMouseClickEdit(i, j);
              break;
            }
          }
          if (bIsFind == false) $scope.onMouseClickEdit(i, -1);
        }else{
          $scope.onMouseClickEdit(i, -1);
        }        
      }
    }
  }

  function DialogController($scope, $mdDialog) {
    $scope.onDelete = function() {
      $mdDialog.hide("delete");
    };

    $scope.onClose = function() {
      $mdDialog.cancel();
    };

    $scope.onSave = function(answer) {
      $mdDialog.hide(answer);
    };
  }

  $scope.onMouseClickEdit = function(index, subindex){
    var nBlockTemplate = (subindex > -1) ? $rootScope.arrBlockList[index].arrChild[subindex].index : nBlockTemplate = $rootScope.arrBlockList[index].index;    
    var reviewForm = document.getElementById("md-edit-page");

    $scope.getBlockData(index, subindex);

    $mdDialog.show({
      controller: DialogController,
      templateUrl : 'view1/block' + nBlockTemplate + '.html',
      parent: angular.element(reviewForm),
      clickOutsideToClose:true,
      preserveScope: true,
      scope: $scope,
      fullscreen: false,
      onComplete: function(nBlockTemplate){
        if (nBlockTemplate == 4){
          $scope.onChangedType();
        }
      }
    })
    .then(function(answer) {
      if (answer == "delete"){
        for (var i = 0; i < $rootScope.arrBlockList.length; i ++){
          if (i == index){
            if (subindex > -1){
              for (var j = 0; j < $rootScope.arrBlockList[i].arrChild.length; j ++){
                if (j == subindex){
                  // delete
                  $rootScope.arrBlockList[i].arrChild.splice(j , 1);
                  break;
                }
              }
            }else{
              // delete
              $rootScope.arrBlockList.splice(i, 1);
              break;
            }
          }
        }
        $scope.onRefreshLeftPanel();
      }else{
        $scope.setBlockData(index, subindex, answer);
        $scope.bindingBlock(index, subindex);
      }      
    }, function(answer) {
    });
  }

  $scope.onChangedType = function(){
    document.getElementById("specialInput").type = $scope.edit3.validation;
  }

  $scope.onDrag = function($event){
    var mouseX = $event.pageX;
    var mouseY = $event.pageY;

    if ($scope.nSelectedIndex != -1){
      $scope.onStartMoveTemplate(mouseX, mouseY, false);

      // if ($scope.arrJsonBlock[$scope.nSelectedIndex].isChild){
      //   if ($scope.IsHaveSubEle()) return;
      // }       

      var reviewForm = document.getElementById("md-collectbox").getBoundingClientRect();
      if ($scope.IsIncludeRect(mouseX, mouseY, reviewForm)){
        var jsonBlackPosition = {index : 999, isChild : false, arrChild : []};
        var nLeftPanPosition = -1;
        var nSubPanPosition = -1;

        for (var i = 0; i < $rootScope.arrBlockList.length; i ++){
          var block = document.getElementById("lblock"+i);
          if (block == null) continue;
          var blockrect = block.getBoundingClientRect();

          if ($scope.IsIncludeRect(mouseX, mouseY, blockrect)){
            if (($rootScope.arrBlockList[i].isChild == true) && ($scope.nSelectedIndex != 1)){  
              for (var j = 0; j < $rootScope.arrBlockList[i].arrChild.length; j ++){
                var subblock = document.getElementById("lsubblock"+i+"_"+j);
                if (subblock == null) continue;
                var subblockrect = subblock.getBoundingClientRect();
                if ($scope.IsIncludeRect(mouseX, mouseY, subblockrect)){
                  if (mouseY < subblockrect.top + subblockrect.height / 2 + window.scrollY) nSubPanPosition = j;
                  else nSubPanPosition = j + 1;
                  break;
                }
              }
              if (nSubPanPosition > -1){
                nLeftPanPosition = i;
              }else{
                if ($rootScope.arrBlockList[i].arrChild.length == 0){
                  nLeftPanPosition = i;
                  nSubPanPosition = 0;
                }
              }
            }else{
              if (mouseY < blockrect.top + blockrect.height / 2 + window.scrollY) nLeftPanPosition = i;
              else nLeftPanPosition = i + 1;
            }
            break;
          }
        }

        if (nLeftPanPosition > -1){
          $scope.removeBlackTemplate();
          
          var newArrBlockList = [];
          for (var i = 0; i < $rootScope.arrBlockList.length; i ++){
            if (nLeftPanPosition == i){
              if (nSubPanPosition == -1) newArrBlockList.push(jsonBlackPosition);
              else{
                var newArrSubBlockList = [];
                for (var j = 0; j < $rootScope.arrBlockList[i].arrChild.length; j ++){
                  if (nSubPanPosition == j) newArrSubBlockList.push(jsonBlackPosition);
                  newArrSubBlockList.push($rootScope.arrBlockList[i].arrChild[j]);
                }
                if (nSubPanPosition == $rootScope.arrBlockList[i].arrChild.length) newArrSubBlockList.push(jsonBlackPosition);
                $rootScope.arrBlockList[i].arrChild = newArrSubBlockList;
              }
            }
            newArrBlockList.push($rootScope.arrBlockList[i]);
          }
          if (nLeftPanPosition == $rootScope.arrBlockList.length) newArrBlockList.push(jsonBlackPosition);
          $rootScope.arrBlockList = newArrBlockList;
        }else{
          if ($rootScope.arrBlockList.length == 0) $rootScope.arrBlockList.push(jsonBlackPosition);
          else{
            var nBlockCnt = 0;
            for (var i = 0; i < $rootScope.arrBlockList.length; i ++){
              if ($rootScope.arrBlockList[i].index != 999) nBlockCnt ++;
            }
            if (nBlockCnt > 0){
              var fstBlockRect = $scope.getRectByBlockIndex(0);
              var lstBlockRect = $scope.getRectByBlockIndex($rootScope.arrBlockList.length - 1);
              if ((fstBlockRect != null) && (mouseY < fstBlockRect.top + window.scrollY)){
                $scope.removeBlackTemplate();
                $rootScope.arrBlockList.splice(0, 0, jsonBlackPosition);
              }
              if ((lstBlockRect != null) && (mouseY > lstBlockRect.top + lstBlockRect.height + window.scrollY)){
                $scope.removeBlackTemplate();
                $rootScope.arrBlockList.push(jsonBlackPosition);
              }
            }
          }
        }
      }else{
        $scope.removeBlackTemplate();
      }

      $scope.onRefreshLeftPanel();
    }
  }

  $scope.onDrop = function($event){
    var mouseX = $event.pageX;
    var mouseY = $event.pageY;
    
    if ($scope.nSelectedIndex > -1){
      var rect = document.getElementById("md-collectbox").getBoundingClientRect();

      if ($scope.IsIncludeRect(mouseX, mouseY, rect)){
        for (var i = 0; i < $rootScope.arrBlockList.length; i ++){
          if ($rootScope.arrBlockList[i].isChild == false){
            if ($rootScope.arrBlockList[i].index == 999){
              $rootScope.arrBlockList[i] = angular.copy($scope.arrJsonBlock[$scope.nSelectedIndex]);
            }
          }else{
            for (var j = 0; j < $rootScope.arrBlockList[i].arrChild.length; j ++){
              if ($rootScope.arrBlockList[i].arrChild[j].index == 999){
                $rootScope.arrBlockList[i].arrChild[j] = angular.copy($scope.arrJsonBlock[$scope.nSelectedIndex]);
              }
            }
          }          
        }
      }else{
        $scope.removeBlackTemplate();        
      }

      $scope.nSelectedIndex = -1;
      $scope.initData();
      $scope.onStopMoveTemplate();

      $scope.onRefreshLeftPanel();
    }
  }

  $scope.onRefreshLeftPanel = function(){
    var strInnerHtml = "";
    for (var i = 0; i < $rootScope.arrBlockList.length; i ++){
      if ($rootScope.arrBlockList[i].isChild == false){
        if ($rootScope.arrBlockList[i].index == 999){
          strInnerHtml += $scope.lPan.blackhole;
        }else{
          // var result = document.getElementsByClassName("block" + ($rootScope.arrBlockList[i].index - 1));
          // var wrappedResult = angular.element(result);
          var filterTxt = $scope.arrHTMLTemplate[$rootScope.arrBlockList[i].index - 1];
          // Text Field
          filterTxt = filterTxt.replace("rPan.textValidation", "ngTxtValidation" + i);
          filterTxt = filterTxt.replace("rPan.textField", "ngTxtVal" + i);
          filterTxt = filterTxt.replace("rPan.textFieldPlace", "ngTxtFieldPlace" + i);          
          // Text Area
          filterTxt = filterTxt.replace("rPan.textArea", "ngTxtAreaDesc" + i);
          filterTxt = filterTxt.replace("rPan.textAreaPlace", "ngTxtAreaPlace" + i);
          // Radio
          filterTxt = filterTxt.replace("rPan.radioVal", "ngRadioVal" + i);
          filterTxt = filterTxt.replace("rPan.Option1", "ngRadioFstOption" + i);
          filterTxt = filterTxt.replace("rPan.Option2", "ngRadioSndOption" + i);
          strInnerHtml += "<div class='md-lblock lblock" + i + "' id='lblock" + i + "'>" + filterTxt + "</div>";
        }
      }else{
        strInnerHtml += "<div class='md-lblock lblock" + i + "' id='lblock" + i + "'>";
        strInnerHtml += "<div class='md-dot-area'><div class='md-dot-area-title' id='md-dot-area-title'>";
        strInnerHtml += $rootScope.arrBlockList[i].label_field;
        strInnerHtml += "</div>";
        for (var j = 0; j < $rootScope.arrBlockList[i].arrChild.length; j ++){
          if ($rootScope.arrBlockList[i].arrChild[j].index == 999){
            strInnerHtml += $scope.lPan.blackhole;
          }else{
            // var result = document.getElementsByClassName("block" + ($rootScope.arrBlockList[i].arrChild[j].index - 1));
            // var wrappedResult = angular.element(result);
            var filterTxt = $scope.arrHTMLTemplate[$rootScope.arrBlockList[i].arrChild[j].index - 1];
            // Text Field
            filterTxt = filterTxt.replace("rPan.textValidation", "ngTxtValidation" + i + "_" + j);
            filterTxt = filterTxt.replace("rPan.textField", "ngTxtVal" + i + "_" + j);
            filterTxt = filterTxt.replace("rPan.textFieldPlace", "ngTxtFieldPlace" + i + "_" + j);
            // Text Area
            filterTxt = filterTxt.replace("rPan.textArea", "ngTxtAreaDesc" + i + "_" + j);
            filterTxt = filterTxt.replace("rPan.textAreaPlace", "ngTxtAreaPlace" + i + "_" + j);            
            // Radio
            filterTxt = filterTxt.replace("rPan.radioVal", "ngRadioVal" + i + "_" + j);
            filterTxt = filterTxt.replace("rPan.Option1", "ngRadioFstOption" + i + "_" + j);
            filterTxt = filterTxt.replace("rPan.Option2", "ngRadioSndOption" + i + "_" + j);
            strInnerHtml += "<div class='md-lblock lsubblock" + i + "_" + j + "' id='lsubblock" + i + "_" + j + "'>" + filterTxt + "</div>";
          }
        }
        strInnerHtml += "</div>";
        strInnerHtml += "</div>";
        strInnerHtml += "</div>";
      }      
    }

    $scope.lPan.innerHTML = $sce.trustAsHtml(strInnerHtml);

    setTimeout(function(){
      // binding data
      for (var i = 0; i < $rootScope.arrBlockList.length; i ++){
        if ($rootScope.arrBlockList[i].isChild == false){
          $scope.bindingBlock(i, -1);
        }else{
          for (var j = 0; j < $rootScope.arrBlockList[i].arrChild.length; j ++){
            $scope.bindingBlock(i, j);
          }
        }
      }
    }, 0);
  }

  $scope.setBlockData = function(index, subindex, jsonObject){
    if (subindex > -1){
      for (var key in jsonObject) {
        $rootScope.arrBlockList[index].arrChild[subindex][key] = jsonObject[key];
      }
    }else{
      for (var key in jsonObject) {
        $rootScope.arrBlockList[index][key] = jsonObject[key];
      }
    }
  }

  $scope.getBlockData = function(index, subindex){
    if (subindex > -1){
      for (var key in $scope.arrEdit[$rootScope.arrBlockList[index].arrChild[subindex].index - 1]) {
        $scope.arrEdit[$rootScope.arrBlockList[index].arrChild[subindex].index - 1][key] = $rootScope.arrBlockList[index].arrChild[subindex][key];
      }
    }else{
      for (var key in $scope.arrEdit[$rootScope.arrBlockList[index].index - 1]) {
        $scope.arrEdit[$rootScope.arrBlockList[index].index - 1][key] = $rootScope.arrBlockList[index][key];
      }
    }
  }

  $scope.bindingBlock = function(index, subindex){
    // console.log(index + ":" + subindex);
    if (subindex > -1){
      $scope.bindingTemplate(angular.element(document.getElementsByClassName("lsubblock"+index+"_"+subindex)), $rootScope.arrBlockList[index].arrChild[subindex], index+"_"+subindex);
    }else{
      $scope.bindingTemplate(angular.element(document.getElementsByClassName("lblock"+index)), $rootScope.arrBlockList[index], index);
    }
  }

  $scope.bindingTemplate = function(el, jsonBlock, ngModelCon){
    if ($scope.nSelectedIndex != -1) return;

    if (jsonBlock.index == 1){
      // el[0].querySelector("#md-ranking-over").style.width = (10 + (jsonBlock.rating - 1) * 5 + (Math.floor((jsonBlock.rating) / 4)) * 24) + "px";
      el[0].querySelector("#md-rating-point").innerHTML = (16 / 20 * jsonBlock.rating).toFixed(0) + "/" + jsonBlock.rating;
      el[0].querySelector("#md-subtitle").innerHTML = jsonBlock.label_field;
      $scope.initData();
    }
    if (jsonBlock.index == 2){
      el[0].querySelector("#md-dot-area-title").innerHTML = jsonBlock.label_field;      
    }
    if (jsonBlock.index == 3){
      el[0].querySelector("#md-subtitle").innerHTML = jsonBlock.label_field;
      eval("$scope.ngRadioVal" + ngModelCon + "='" + jsonBlock.radioVal + "'");
      eval("$scope.ngRadioFstOption" + ngModelCon + "='" + jsonBlock.option1 + "'");
      eval("$scope.ngRadioSndOption" + ngModelCon + "='" + jsonBlock.option2 + "'");
    }
    if (jsonBlock.index == 4){
      console.log(jsonBlock);
      el[0].querySelector("#md-subtitle").innerHTML = jsonBlock.label_field;
      if (jsonBlock.validation == "number") jsonBlock.description = jsonBlock.description * 1;
      else jsonBlock.description = jsonBlock.description + "";
      eval("$scope.ngTxtVal" + ngModelCon + "='" + jsonBlock.description + "'");
      eval("$scope.ngTxtFieldPlace" + ngModelCon + "='" + jsonBlock.placeholder + "'");
    }
    if (jsonBlock.index == 5){
      el[0].querySelector("#md-subtitle").innerHTML = jsonBlock.label_field;
      el[0].querySelector("#md-maxlen").innerHTML = jsonBlock.description.length + " / " + jsonBlock.max_character;
      eval("$scope.ngTxtAreaDesc" + ngModelCon + "='" + jsonBlock.description + "'");
      eval("$scope.ngTxtAreaPlace" + ngModelCon + "='" + jsonBlock.placeholder + "'");
    }
  }

  $scope.initData = function(){
    $scope.lPan.Score.cur = 0;
    $scope.lPan.Score.max = 0;
    for (var i = 0; i < $rootScope.arrBlockList.length; i ++){
      if ($rootScope.arrBlockList[i].isChild == false){
        if ($rootScope.arrBlockList[i].index == 1){
          $scope.lPan.Score.cur = $scope.lPan.Score.cur*1 + Math.round($rootScope.arrBlockList[i].currating * ($rootScope.arrBlockList[i].rating / 20));
          $scope.lPan.Score.max += $rootScope.arrBlockList[i].rating;
        }
      }else{
        for (var j = 0; j < $rootScope.arrBlockList[i].arrChild.length; j ++){
          if ($rootScope.arrBlockList[i].arrChild[j].index == 1){
            $scope.lPan.Score.cur = $scope.lPan.Score.cur*1 + Math.round($rootScope.arrBlockList[i].arrChild[j].currating * ($rootScope.arrBlockList[i].arrChild[j].rating / 20));
            $scope.lPan.Score.max += $rootScope.arrBlockList[i].arrChild[j].rating;
          }
        }
      }
    }
    $scope.lPan.Score.total = $scope.lPan.Score.cur + "/" + $scope.lPan.Score.max;
  }

  $scope.IsIncludeRect = function(mouseX, mouseY, rect){
    if ((mouseX >= rect.left) && (mouseX < rect.width + rect.left) && (mouseY >= rect.top + window.scrollY) && (mouseY < rect.top + rect.height + window.scrollY)){
      return true;
    }
    return false;
  }

  $scope.IsHaveSubEle = function(){
    for (var i = 0; i < $rootScope.arrBlockList.length; i ++){
      if ($rootScope.arrBlockList[i].isChild == true) return true;
    }
    return false;
  }

  $scope.getBlockTemplate = function(index){
    var result = document.getElementsByClassName("block"+index);
    var wrappedResult = angular.element(result);
    return wrappedResult[0].innerHTML;
  }

  $scope.getRectByBlockIndex = function(index){
    if (index == 999){
      var rectElement = document.getElementById("md-black-hole");
    }else{
      var rectElement = document.getElementById("lblock"+index);
    }
    if (rectElement == null) return null;
    var rect = rectElement.getBoundingClientRect();
    return rect;
  }

  $scope.onStartMoveTemplate = function(mouseX, mouseY, bIsStart){
    if (bIsStart) document.getElementById("md-select-overlap").style.display = "block";
    document.getElementById("md-select-overlap").style.left = (mouseX - 260) + "px";
    document.getElementById("md-select-overlap").style.top = (mouseY - 60) + "px";
  }

  $scope.onStopMoveTemplate = function(){
    document.getElementById("md-select-overlap").style.display = "none";
  }
  
  $scope.removeBlackTemplate = function(){
    var newArrBlockList = [];
    for (var i = 0; i < $rootScope.arrBlockList.length; i ++){
      var newEachBlock = angular.copy($rootScope.arrBlockList[i]);
      if (newEachBlock.index == 999) continue;
      if (newEachBlock.isChild){
        for (var j = 0; j < newEachBlock.arrChild.length; j ++){
          if (newEachBlock.arrChild[j].index == 999){
            newEachBlock.arrChild.splice(j, 1);
            break;
          }
        }
      }
      newArrBlockList.push(newEachBlock);
    }
    $rootScope.arrBlockList = newArrBlockList;
  }
}])
.directive('compile', function($compile, $parse){
    return {
        link: function(scope, element, attr){
            var parsed = $parse(attr.ngBindHtml);
            function getStringValue() {
                return (parsed(scope) || '').toString();
            }
            // Recompile if the template changes
            scope.$watch(getStringValue, function() {
                $compile(element, null, -9999)(scope);  // The -9999 makes it skip directives so that we do not recompile ourselves
            });
        }
    }
})
.directive('dirblock0', function() {
  return {
    restrict: "EA",
    scope : false,
    compile: function(tElement, scope) {
        var html = tElement.html();
        return function(scope, element) {
          scope.arrHTMLTemplate[0] = html;
        }
    }
  };
})
.directive('dirblock1', function() {
  return {
    restrict: "EA",
    scope : false,
    compile: function(tElement, scope) {
        var html = tElement.html();
        return function(scope, element) {
          scope.arrHTMLTemplate[1] = html;
        }
    }
  };
})
.directive('dirblock2', function() {
  return {
    restrict: "EA",
    scope : false,
    compile: function(tElement, scope) {
        var html = tElement.html();
        return function(scope, element) {
          scope.arrHTMLTemplate[2] = html;
        }
    }
  };
})
.directive('dirblock3', function() {
  return {
    restrict: "EA",
    scope : false,
    compile: function(tElement, scope) {
        var html = tElement.html();
        return function(scope, element) {
          scope.arrHTMLTemplate[3] = html;
        }
    }
  };
})
.directive('dirblock4', function() {
  return {
    restrict: "EA",
    scope : false,
    compile: function(tElement, scope) {
        var html = tElement.html();
        return function(scope, element) {
          scope.arrHTMLTemplate[4] = html;
        }
    }
  };
});
