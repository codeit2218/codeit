

console.log('working');

var answers=[];
var imagesavedbefore;
const  imgsrc="https://image.freepik.com/free-icon/male-user-shadow_318-34042.jpg"
quizApp=angular.module('quizApp' , []);
quizApp.controller('quizController' , [  '$scope' , '$http', function($scope, $http)
{
    $http.get('/requestQuestion').then(function(data)
{
console.log(data.data);
$scope.questionArray=data.data;
$scope.totalQuestions=$scope.questionArray.length;


}, function(error)
{
    console.log('some error occured');
})

$scope.questionNumber=0;
$scope.skippedQuestions=[];
$scope.attemptedQuestions=0;
$scope.score=0;
$scope.accuracy=0;
$scope.submit_message = "END QUIZ";

$scope.optionSelected='';


$scope.startQuiz =function(){
    document.querySelector("#quiz_rules").style.display = "none";
    document.querySelector("#quiz-body").style.display = "block";
   
}




$scope.checkQuestions=function()
{
 
return !($scope.totalQuestions-1>$scope.questionNumber);
}


$scope.previousEvaluation=function()
{

  
    if( document.querySelector('input[name="option"]:checked'))
    {
    
      
        $scope.questionNumber--;
        document.querySelector('input[name="option"]:checked').checked=false;
    }
else{
  
    $scope.skippedQuestions[$scope.questionNumber]=$scope.questionNumber+1;
    $scope.questionNumber--;
} 
    if(answers[$scope.questionNumber])
    {
        answers[$scope.questionNumber].checked=true;
    }
    

    
}
$scope.evaluation=function()
{

   
    if(document.querySelector('input[name="option"]:checked'))
    {
       
      
       
   
 $scope.questionNumber++;
 document.querySelector('input[name="option"]:checked').checked=false;

}else{
    
$scope.skippedQuestions[$scope.questionNumber]=$scope.questionNumber+1;
    $scope.questionNumber++;
}
  
    if(answers[$scope.questionNumber])
    {
        answers[$scope.questionNumber].checked=true;
    }
 

   

}


var x=document.querySelectorAll('input[name="option"]');

for(var y=0;y<x.length;y++)
{

x[y].addEventListener('click' , function(event){
    console.log('clicked');
answers[$scope.questionNumber]=this
 $scope.skippedQuestions[$scope.questionNumber]=null;
$scope.attemptedQuestions++;
if($scope.attemptedQuestions==$scope.totalQuestions)
{
  $scope.submit_message="SUBMIT"  
  console.log($scope.submit_message);
  console.log($scope.attemptedQuestions);
}
console.log($scope.skippedQuestions);
})

}






$scope.submitAnswers=function()
{
document.querySelector('#questionBody').style.display="none";

for(var i=0;i<answers.length;i++)
{
 {
     if(answers[i].value==$scope.questionArray[i].ans )
     {
$scope.score++;

     }
 }

}
$scope.accuracy=($scope.score/$scope.attemptedQuestions)*100;
google.charts.load("current", {packages:["corechart"]});
google.charts.setOnLoadCallback(drawChart);
function drawChart() {
  var data = google.visualization.arrayToDataTable([
    ['Task', 'Hours per Day'],
    ['attempt',     $scope.attemptedQuestions],
    ['right',      $scope.score],
    ['wrong',  $scope.attemptedQuestions-$scope.score],
  ]);

  var options = {
    title: 'My Daily Activities',
    pieHole: 0.4,
  };

  var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
  chart.draw(data, options);
}



document.querySelector('#quizScore').style.display="block";


}


$scope.skippedQuestionManage=function( skippedQuestion)
{

console.log('reached here somehow');
console.log($scope.skippedQuestions);
console.log(skippedQuestion);
$scope.questionNumber=skippedQuestion-1;

}
$scope.skippedQuestionDisplay=function()
{
for(var x=0;x<$scope.skippedQuestions.length;x++)
{
   
    if ($scope.skippedQuestions[x]!=null)
    {return true;}

}
return false;

}




}]);


quizApp.controller('userController',['$scope','$http','$timeout', function($scope,$http,$timeout)
{
$scope.uid="";
$scope.imagesource=0;


$http.get('/getProfilePhoto').then(function(data)
{
    if(data!=null)
    {
    console.log('got the data back ',data.data)
   
    if(data.data.present==true)
    {
        $scope.imgpath=data.data.path;
    }
    else{
        $scope.imgpath="https://image.freepik.com/free-icon/male-user-shadow_318-34042.jpg";
    }

    }
   
 }, function(err)
{
    console.log(err);
})









$http.get('/getUserName').then(function(data){
    console.log(data.data.uid);
$scope.uid=data.data.uid;
}, function(error)
{
    console.log('some error occured line 204');
})

$scope.changeProfilePicture=0;
$scope.photochanged=function()
{
    $scope.changeProfilePicture=0;
//     $http.get('/getProfilePhoto').then(function(data)
// {
//     console.log(data);
// }, function(err)
// {
//     console.log(err);
// })
}


var changeButton=document.querySelector('#changeButton');
var submitButton;
changeButton.addEventListener('click' ,function()
{
     submitButton=document.querySelector('#submitter');
console.log(submitButton);
submitButton.addEventListener('click',function(){
$scope.changeProfilePicture=0;
    console.log('submit was clicked');
myvar=$timeout( function()
{
    $http.get('/getProfilePhoto').then(function(data)
{
    if(data!=null)
    {
    console.log('got the data back ',data.data)
   
    if(data.data.present==true)
    {
        $scope.imgpath=data.data.path;
    }
    else{
        alert('file not valid');
        $scope.imgpath="https://image.freepik.com/free-icon/male-user-shadow_318-34042.jpg";
    }

    }
   
 }, function(err)
{
    console.log(err);
}) 
},4000);


 })

 
 })




}])
