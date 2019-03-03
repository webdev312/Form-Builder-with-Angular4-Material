'use strict';

angular.module('myApp.view2', ['ui.router', 'ngMaterial'])

.controller('View2Ctrl', ['$scope', '$rootScope', '$templateCache', '$http', '$sce', '$location', function($scope, $rootScope, $templateCache, $http, $sce, $location) {
    $scope.review = {};
    $scope.review.innerHTML = "";
    
    $scope.Pan = {}
    $scope.Pan.Score = {cur : 0, max : 0, total : "0/0"};

    $scope.LoadTemplate = function(){
        var nTemplateLen = 5;
        var nLoadSuccess = 0;
        for (var i = 0; i < nTemplateLen; i ++){
            $http.get('view2/element' + (i + 1) + '.html', {
                cache: true
            }).then(function(resp){
                nLoadSuccess ++;
                $templateCache.put(resp.config.url, resp.data);
                if (nLoadSuccess == nTemplateLen){
                    $scope.InitInterface();
                }
            });
        }
    }

    $scope.RefreshData = function(){
        $scope.Pan.Score.cur = 0;
        $scope.Pan.Score.max = 0;
        for (var i = 0; i < $rootScope.arrBlockList.length; i ++){
          if ($rootScope.arrBlockList[i].isChild == false){
            if ($rootScope.arrBlockList[i].index == 1){
              $scope.Pan.Score.cur = $scope.Pan.Score.cur*1 + $rootScope.arrBlockList[i].currating * ($rootScope.arrBlockList[i].rating / 20);
              $scope.Pan.Score.max += $rootScope.arrBlockList[i].rating;
            }
          }else{
            for (var j = 0; j < $rootScope.arrBlockList[i].arrChild.length; j ++){
              if ($rootScope.arrBlockList[i].arrChild[j].index == 1){
                $scope.Pan.Score.cur = $scope.Pan.Score.cur*1 + $rootScope.arrBlockList[i].arrChild[j].currating * ($rootScope.arrBlockList[i].arrChild[j].rating / 20);
                $scope.Pan.Score.max += $rootScope.arrBlockList[i].arrChild[j].rating;
              }
            }
          }
        }
        $scope.Pan.Score.total = (Math.round($scope.Pan.Score.cur * 100) / 100) + "/" + $scope.Pan.Score.max;
    }

    String.prototype.replaceAll = function(str1, str2, ignore) 
    {
        return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
    } 

    $scope.InitInterface = function(){
        if ($rootScope.arrBlockList != undefined){
            var strInnerHtml = "";
            for (var i = 0; i < $rootScope.arrBlockList.length; i ++){
                if ($rootScope.arrBlockList[i].isChild){
                    strInnerHtml += "<div class='md-lblock lblock" + i + "' id='lblock" + i + "'>";
                    strInnerHtml += "<div class='md-dot-area'><div class='md-dot-area-title' id='md-dot-area-title'>";
                    strInnerHtml += $rootScope.arrBlockList[i].label_field;
                    strInnerHtml += "</div>";
                    for (var j = 0; j < $rootScope.arrBlockList[i].arrChild.length; j ++){
                        var template = $templateCache.get('view2/element' + $rootScope.arrBlockList[i].arrChild[j].index + '.html');
                        // Rating
                        template = template.replace("RatingTitle", "ngRatingTitle" + i + "_" + j);
                        template = template.replace("RatingPoint", "ngRatingPoint" + i + "_" + j);   
                        template = template.replace("id-rating-over", "id-rating-over" + i + "_" + j);
                        template = template.replace("id-ranking-over", "id-ranking-over" + i + "_" + j);
                        template = template.replaceAll("onRatingOver($event, index, subindex)", "onRatingOver($event, " + i + ", " + j + ")");
                        template = template.replaceAll("onRatingSubmit($event, index, subindex)", "onRatingSubmit($event, " + i + ", " + j + ")");
                        template = template.replaceAll("onRatingLeave(index, subindex)", "onRatingLeave(" + i + ", " + j + ")");

                        // Dot Area
                        template = template.replace("DotAreaTitle", "ngDotAreaTitle" + i + "_" + j);
                        
                        // Radio Button                        
                        template = template.replace("RadioTitle", "ngRadioTitle" + i + "_" + j);
                        template = template.replace("RadioModel", "ngRadioModel" + i + "_" + j);
                        template = template.replace("OptionY", "ngOptionY" + i + "_" + j);
                        template = template.replace("OptionN", "ngOptionN" + i + "_" + j);

                        // Text Field                        
                        template = template.replace("TextFieldTitle", "ngTextFieldTitle" + i + "_" + j);
                        template = template.replace("TextFieldModel", "ngTextFieldModel" + i + "_" + j);
                        if($rootScope.arrBlockList[i].arrChild[j].hasOwnProperty('validation')) template = template.replace("TextFieldValidation", $rootScope.arrBlockList[i].arrChild[j].validation);                    
                        template = template.replace("TextFieldPlaceholder", "ngTextFieldPlaceholder" + i + "_" + j);

                        // Text Area
                        template = template.replaceAll("TextAreaModel", "ngTextAreaModel" + i + "_" + j);
                        template = template.replace("TextAreaPlaceholder", "ngTextAreaPlaceholder" + i + "_" + j);
                        template = template.replace("TextAreaTitle", "ngTextAreaTitle" + i + "_" + j);
                        template = template.replace("TextAreaLen", "ngTextAreaLen" + i + "_" + j);
                        template = template.replace("TextAreaMaxLength", "ngTextAreaMaxLength" + i + "_" + j);                        
                        template = template.replace("onTextAreaChange(index, subindex", "onTextAreaChange(" + i + ", " + j);
                        
                        strInnerHtml += template;
                    }
                    strInnerHtml += "</div>";
                    strInnerHtml += "</div>";
                    strInnerHtml += "</div>";
                }else{                    
                    var template = $templateCache.get('view2/element' + $rootScope.arrBlockList[i].index + '.html');
                    // Rating
                    template = template.replace("RatingTitle", "ngRatingTitle" + i);
                    template = template.replace("RatingPoint", "ngRatingPoint" + i);
                    template = template.replace("id-rating-over", "id-rating-over" + i + "_999");
                    template = template.replace("id-ranking-over", "id-ranking-over" + i + "_999");
                    template = template.replaceAll("onRatingOver($event, index, subindex)", "onRatingOver($event, " + i + ", -1)");
                    template = template.replaceAll("onRatingSubmit($event, index, subindex)", "onRatingSubmit($event, " + i + ", -1)");
                    template = template.replaceAll("onRatingLeave(index, subindex)", "onRatingLeave(" + i + ", -1)");

                    // Dot Area
                    template = template.replace("DotAreaTitle", "ngDotAreaTitle" + i);

                    // Radio Button
                    template = template.replace("RadioTitle", "ngRadioTitle" + i);
                    template = template.replace("RadioModel", "ngRadioModel" + i);
                    template = template.replace("OptionY", "ngOptionY" + i);
                    template = template.replace("OptionN", "ngOptionN" + i);

                    // Text Field
                    template = template.replace("TextFieldTitle", "ngTextFieldTitle" + i);
                    template = template.replace("TextFieldModel", "ngTextFieldModel" + i);
                    if($rootScope.arrBlockList[i].hasOwnProperty('validation')) template = template.replace("TextFieldValidation", $rootScope.arrBlockList[i].validation);
                    template = template.replace("TextFieldPlaceholder", "ngTextFieldPlaceholder" + i);

                    // Text Area
                    template = template.replaceAll("TextAreaModel", "ngTextAreaModel" + i);
                    template = template.replace("TextAreaPlaceholder", "ngTextAreaPlaceholder" + i);
                    template = template.replace("TextAreaTitle", "ngTextAreaTitle" + i);
                    template = template.replace("TextAreaLen", "ngTextAreaLen" + i);
                    template = template.replace("TextAreaMaxLength", "ngTextAreaMaxLength" + i);                    
                    template = template.replace("onTextAreaChange(index, subindex", "onTextAreaChange(" + i + ", -1");
                    

                    strInnerHtml += template;
                }
            }
            // console.log(strInnerHtml);
            $scope.review.innerHTML = $sce.trustAsHtml(strInnerHtml);
            $scope.BindingData();
            $scope.RefreshData();
        }
    }

    $scope.BindingData = function(){
        for (var i = 0; i < $rootScope.arrBlockList.length; i ++){
            if ($rootScope.arrBlockList[i].isChild){
                for (var j = 0; j < $rootScope.arrBlockList[i].arrChild.length; j ++){
                    $scope.BindingDataFromModel($rootScope.arrBlockList[i].arrChild[j], i + "_" + j);
                }
            }else{
                $scope.BindingDataFromModel($rootScope.arrBlockList[i], i);
            }
        }

    }

    $scope.BindingDataFromModel = function(jsonBlock, model){
        // console.log(jsonBlock);
        if (jsonBlock.index == 1){
            eval("$scope.ngRatingTitle" + model + "='" + jsonBlock.label_field + "'");
            eval("$scope.ngRatingPoint" + model + "='" + (Math.round(jsonBlock.currating * (jsonBlock.rating / 20) * 100) / 100) + "/" + jsonBlock.rating + "'");
        }
        if (jsonBlock.index == 2){
            eval("$scope.ngDotAreaTitle" + model + "='" + jsonBlock.label_field + "'");
        }
        if (jsonBlock.index == 3){
            eval("$scope.ngRadioTitle" + model + "='" + jsonBlock.label_field + "'");
            eval("$scope.ngOptionY" + model + "='" + jsonBlock.option1 + "'");
            eval("$scope.ngOptionN" + model + "='" + jsonBlock.option2 + "'");
        }
        if (jsonBlock.index == 4){
            eval("$scope.ngTextFieldTitle" + model + "='" + jsonBlock.label_field + "'");            
            if (jsonBlock.validation == "number"){
                jsonBlock.description = jsonBlock.description * 1;
                eval("$scope.ngTextFieldModel" + model + "=" + jsonBlock.description);
            }else{
                eval("$scope.ngTextFieldModel" + model + "='" + jsonBlock.description + "'");
            }            
            eval("$scope.ngTextFieldPlaceholder" + model + "='" + jsonBlock.placeholder + "'");
        }
        if (jsonBlock.index == 5){
            eval("$scope.ngTextAreaTitle" + model + "='" + jsonBlock.label_field + "'");
            eval("$scope.ngTextAreaModel" + model + "='" + jsonBlock.description + "'");
            eval("$scope.ngTextAreaPlaceholder" + model + "='" + jsonBlock.placeholder + "'");    
            eval("$scope.ngTextAreaMaxLength" + model + "='" + jsonBlock.max_character + "'");                        
            eval("$scope.ngTextAreaLen" + model + "='" + jsonBlock.description.length + "/" + jsonBlock.max_character + "'");
        }
    }

    $scope.onRatingOver = function($event, index, subindex){
        if (subindex == -1) subindex = 999;
        $scope.onShowRating($event, index + "_" + subindex);
    }

    $scope.onRatingSubmit = function($event, index, subindex){
        if (subindex == -1) subindex = 999;
        var rating = $scope.onShowRating($event, index + "_" + subindex);
        if (subindex == 999){
            $rootScope.arrBlockList[index].currating = rating;
            $scope.BindingDataFromModel($rootScope.arrBlockList[index], index);
        }else{
            $rootScope.arrBlockList[index].arrChild[subindex].currating = rating;
            $scope.BindingDataFromModel($rootScope.arrBlockList[index].arrChild[subindex], index + "_" + subindex);
        }
        $scope.RefreshData();
    }

    $scope.onRatingLeave = function(index, subindex){
        if (subindex == -1) subindex = 999;
        var strOrgId = "id-ranking-over" + index + "_" + subindex;
        var curIndex = 0;
        if (subindex == 999) curIndex = $rootScope.arrBlockList[index].currating;
        else curIndex = $rootScope.arrBlockList[index].arrChild[subindex].currating;
        document.getElementById(strOrgId).style.width = (10 + ((curIndex - 1) * 5) + ((Math.floor((curIndex) / 4)) * 5) + ((Math.floor((curIndex - 1) / 4)) * 19)) + "px";        
    }

    $scope.onShowRating = function($event, el_name){
        var mouseX = $event.pageX;
        var mouseY = $event.pageY;

        var rect = document.getElementById("id-rating-over" + el_name).getBoundingClientRect();
        var nRatingBlock = 30 / 4;
        var mousePosition = mouseX - rect.left;
        var orgPos = mousePosition;
        
        // console.log(mousePosition + ":" + Math.floor(mousePosition / 44));
        mousePosition = mousePosition - Math.floor(mousePosition / 44) * 14;
        // console.log(mousePosition);
        var curIndex = Math.round(mousePosition / nRatingBlock) * 1;
        // console.log(curIndex + ":" + orgPos);
        if (curIndex < 1) document.getElementById("id-ranking-over" + el_name).style.width = "0px";
        else{
            for (var i = 1; i <= 5; i ++){
                if ((orgPos > 30*i + (14*(i-1))) && (orgPos < 30*i+14 + (14*(i-1)))){
                    return i*4;
                }
            }
            document.getElementById("id-ranking-over" + el_name).style.width = (10 + ((curIndex - 1) * 5) + ((Math.floor((curIndex) / 4)) * 5) + ((Math.floor((curIndex - 1) / 4)) * 19)) + "px";        
        }

        if (curIndex > 20) curIndex = 20;
        return (curIndex > 20) ? 20 : curIndex;
        // console.log((10 + ((curIndex - 1) * 5) + ((Math.floor((curIndex) / 4)) * 5) + ((Math.floor((curIndex - 1) / 4)) * 19)));
        /* 10, 15, 20, 30, 54, 59, 64, 74, 98, 103, 108, 118, 142, 147, 152, 162, 186, 191, 196, 2006*/
        // document.getElementById("id-ranking-over" + el_name).style.width = (10 + (curIndex - 1) * 5 + (Math.round((curIndex) / 4)) * 24) + "px";
    }

    $scope.onTextAreaChange = function(index, subindex, text){
        var model;
        var jsonBlock;

        if (subindex == -1){
            model = index;
            jsonBlock = $rootScope.arrBlockList[index];
        }else{
            model = index + "_" + subindex;
            jsonBlock = $rootScope.arrBlockList[index].arrChild[subindex];
        }

        jsonBlock.description = text;
        eval("$scope.ngTextAreaLen" + model + "='" + jsonBlock.description.length + "/" + jsonBlock.max_character + "'");
    }

    $scope.onSubmit = function(){
        $location.path('/view3');
    }

    $scope.LoadTemplate();
}]);
