'use strict';

angular.module('myApp.view3', ['ui.router', 'ngMaterial'])

.controller('View3Ctrl', ['$scope', '$rootScope', '$templateCache', '$http', '$sce', '$location', function($scope, $rootScope, $templateCache, $http, $sce, $location) {
    $scope.arrName = ['Alex Black', 'Alex Star', 'Damien Black'];
    $scope.arrReviewers = [];
    $scope.searchText = "";

    $scope.review = {};
    $scope.review.innerBtnHTML = "";
    $scope.review.innerFullHTML = [];

    $scope.tableHeaders = [
        {Icon:'', Title:'Code', Width:15},
        {Icon:'', Title:'Name', Width:40},
        {Icon:'', Title:'Score', Width:15},
        {Icon:'', Title:'Result', Width:15}
    ];

    $scope.tableInfo = [
        {Index : 0, Code:'ISOO15', Name:'Lobsang Choephel', Score:91, Result:'done'},
        {Index : 1, Code:'ISOO16', Name:'Tsecho Dorje', Score:0, Result:''},
        // {Code:'ISOO17', Name:'Xirao Yunzhen', Score:87, Result:'close'},
        // {Code:'ISOO18', Name:'Luojie', Score:85, Result:'done'},
        // {Code:'ISOO19', Name:'Jiumao Tso', Score:83, Result:'done'},
        // {Code:'ISOO20', Name:'Droma Sangmo', Score:79, Result:'close'},
        // {Code:'ISOO21', Name:'Gyatso', Score:77, Result:'done'},
        // {Code:'ISOO22', Name:'Jimei', Score:75, Result:'done'},
        // {Code:'ISOO23', Name:'Ma Jian Zhong', Score:73, Result:'done'},
        // {Code:'ISOO24', Name:'Souyang', Score:70, Result:'close'}
    ];

    $scope.nSelectedTableIndex = -1;

    $scope.LoadTemplate = function(){
        var nTemplateLen = 1;
        var nLoadSuccess = 0;
        for (var i = 0; i < nTemplateLen; i ++){
            $http.get('view3/sub' + (i + 1) + '.html', {
                cache: true
            }).then(function(resp){
                nLoadSuccess ++;
                $templateCache.put(resp.config.url, resp.data);
            });
        }
    }

    $scope.query = function(searchText) {
        var resultArray = [];
        for (var i = 0; i < $scope.arrName.length; i ++){
            var name = $scope.arrName[i].toLowerCase();
            if (name.indexOf(searchText.toLowerCase()) > -1) resultArray.push($scope.arrName[i]);
        }
        return resultArray;
    };

    $scope.onAutoCompleteKeyPress = function($event){
        if ($event.keyCode == 13){
            var result = $scope.query($scope.searchText);
            if (result.length > 0){
                if (($scope.arrBlockList != undefined) && ($scope.arrBlockList.length > 0)){
                    for (var i = 0; i < result.length; i ++){
                        $scope.arrReviewers.push(result[i]);
                    }
                    $scope.addButtons();
                }
            }
            $scope.searchText = "";
        }
    }

    $scope.addButtons = function(){
        var strBtnHTML = "";
        for (var i = 0; i < $scope.arrReviewers.length; i ++){
            strBtnHTML += "<div>";
            strBtnHTML += "<div class='md-raised md-primary md-roundbtn'>" + $scope.arrReviewers[i] + "<md-button class='md-delete-small md-icon-button' ng-click='onDelete(" + i + ")'><span><i class='material-icons material-font'>clear</i></span></md-button></div>";
            strBtnHTML += "</div>";
        }

        var strReviewHTML = "";
        $scope.review.innerFullHTML = [];
        for (var i = 0; i < $scope.arrReviewers.length; i ++){
            strReviewHTML += "<div class='md-lstaverage'>";
            strReviewHTML += "Reviewer : " + $scope.arrReviewers[i];
            strReviewHTML += "</div>";
            strReviewHTML += "<label class='md-each-review' id='eachblock" + i + "'>";
            strReviewHTML += $rootScope.arrBlockList[$rootScope.arrBlockList.length - 1].description.replaceAll("\n", "<br>");
            strReviewHTML += "</label>";

            strReviewHTML += "<div class='md-each-full-review' id='eachfullblock" + i + "'>";
            if (($rootScope.arrBlockList != undefined) && ($rootScope.arrBlockList.length > 0)){
                strReviewHTML += $scope.InitInterface(i);
                $scope.BindingData();
            }
            strReviewHTML += "</div>";

            strReviewHTML += "<div layout='row'>";
            var template = $templateCache.get('view3/sub1.html');
            template = template.replace("BlockTotalPoint", "ngBlockTotalPoint" + i);
            strReviewHTML += template;
            $scope.setBlockTotalResult();

            strReviewHTML += "<div flex></div>";
            strReviewHTML += "<md-button class='md-full-review' ng-click='onFullReview(" + i + ")' id='reviewBtn" + i + "'>See Full Review</md-button>";
            strReviewHTML += "</div>";
        }

        $scope.review.innerBtnHTML = $sce.trustAsHtml(strBtnHTML);
        $scope.review.innerHTML = $sce.trustAsHtml(strReviewHTML);
    }
    
    $scope.onFullReview = function(index){
        var strTitle = document.getElementById("reviewBtn" + index).innerText;
        if (strTitle == "See Full Review"){
            document.getElementById("reviewBtn" + index).innerText = "See Review Template";         
            document.getElementById("eachfullblock" + index).style.display = "block";
            document.getElementById("eachblock" + index).style.display = "none";
            var textarea = document.getElementById("TextAreaID" + index);
            textarea.style.height = textarea.scrollHeight + 'px';
        }else{
            document.getElementById("reviewBtn" + index).innerText = "See Full Review";
            document.getElementById("eachfullblock" + index).style.display = "none";
            document.getElementById("eachblock" + index).style.display = "block";
        }
    }

    $scope.onDelete = function(index){
        $scope.arrReviewers.splice(index , 1);
        $scope.addButtons();
    }

    $scope.InitInterface = function(index){
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
                        template = template.replaceAll("TextAreaID", "TextAreaID" + index);                                       
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
                    template = template.replaceAll("TextAreaID", "TextAreaID" + index);
                    template = template.replace("TextAreaPlaceholder", "ngTextAreaPlaceholder" + i);
                    template = template.replace("TextAreaTitle", "ngTextAreaTitle" + i);
                    template = template.replace("TextAreaLen", "ngTextAreaLen" + i);
                    template = template.replace("TextAreaMaxLength", "ngTextAreaMaxLength" + i);                    
                    template = template.replace("onTextAreaChange(index, subindex", "onTextAreaChange(" + i + ", -1");
                    

                    strInnerHtml += template;
                }
            }
            // console.log(strInnerHtml);
            return strInnerHtml;
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
            var strDescription = jsonBlock.description.replaceAll('\n', '\\n');
            eval("$scope.ngTextAreaTitle" + model + "='" + jsonBlock.label_field + "'");
            eval("$scope.ngTextAreaModel" + model + "='" + strDescription + "'");
            eval("$scope.ngTextAreaPlaceholder" + model + "='" + jsonBlock.placeholder + "'");    
            eval("$scope.ngTextAreaMaxLength" + model + "='" + jsonBlock.max_character + "'");                        
            eval("$scope.ngTextAreaLen" + model + "='" + jsonBlock.description.length + "/" + jsonBlock.max_character + "'");
        }
    }

    $scope.setBlockTotalResult = function(){
        var max_point = 0;
        var max_rating = 0;
        for (var i = 0; i < $rootScope.arrBlockList.length; i ++){
            if ($rootScope.arrBlockList[i].isChild){
                for (var j = 0; j < $rootScope.arrBlockList[i].arrChild.length; j ++){
                    if ($rootScope.arrBlockList[i].arrChild[j].index == 1){
                        max_point += $rootScope.arrBlockList[i].arrChild[j].rating;
                        max_rating += Math.round($rootScope.arrBlockList[i].arrChild[j].currating * ($rootScope.arrBlockList[i].arrChild[j].rating / 20) * 100) / 100;
                    }
                }
            }else{
                if ($rootScope.arrBlockList[i].index == 1){
                    max_rating += Math.round($rootScope.arrBlockList[i].currating * ($rootScope.arrBlockList[i].rating / 20) * 100) / 100;
                    max_point += $rootScope.arrBlockList[i].rating;
                }
            }
        }
        // console.log($rootScope.arrBlockList[$rootScope.arrBlockList.length - 1]);
        for (var i = 0; i < $scope.arrReviewers.length; i ++){
            eval("$scope.ngBlockTotalPoint" + i + "='" + max_rating + "/" + max_point + "'");
        }
        $scope.ngAveragePoint = max_rating + "/" + max_point;
        $scope.max_rating = max_rating;
        $scope.max_point = max_point;
    }

    $scope.onSelect = function(index){
        $scope.nSelectedTableIndex = index;
        for (var i = 0; i < $scope.tableInfo.length; i ++){
            document.getElementById("idTableRow"+i).style.backgroundColor = "white";  
        }
        document.getElementById("idTableRow"+index).style.backgroundColor = "rgba(79, 175, 180, 0.70)";        
    }

    $scope.onApprove = function(){
        if ($scope.nSelectedTableIndex > -1){
            $scope.tableInfo[$scope.nSelectedTableIndex].Result = "done";
            $scope.tableInfo[$scope.nSelectedTableIndex].Score = $scope.max_rating;
        }
    }

    $scope.onDecline = function(){
        if ($scope.nSelectedTableIndex > -1){
            $scope.tableInfo[$scope.nSelectedTableIndex].Result = "close";
            $scope.tableInfo[$scope.nSelectedTableIndex].Score = $scope.max_rating;
        }
    }

    angular.element(function () {
        $scope.onSelect(1);
    });

    $scope.LoadTemplate();
}]);
