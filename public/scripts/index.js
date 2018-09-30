//navbar opening and closing functions

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("mySidenav").style.backgroundColor = "rgba(0,0,0,0.9)";
    document.getElementById("main-heading").style.marginLeft = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.2)";
    document.getElementById("main-heading").innerHTML = '<span style="font-size:30px;cursor:pointer" onclick="closeNav()">&times; CODE IT <span class="glyphicon glyphicon-knight"></span></span>';
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main-heading").style.marginLeft= "0";
    document.body.style.backgroundColor = "rgba(200,200,200,0.9)";
    document.getElementById("main-heading").innerHTML = '<span style="font-size:30px;cursor:pointer" onclick="openNav()">&#9776; CODE IT <span class="glyphicon glyphicon-knight"></span></span>';
}

function loginValidate(){
    var uname = document.querySelector('#email1').value;
    var pwd = document.querySelector('#password').value;
    if(uname.length==0 || pwd.length.length==0)
    {
        var element = document.getElementById("errors");
        element.style.display = "block";
        return false;
    }
    else
        return true;
}

function signupValidate(){
    console.log("I am validating");
    var phn = document.querySelector('#phn').value;
    var pwd = document.querySelector('#password').value;
    var repwd = document.querySelector('#repwd').value;
    if(!(/^[0-9]{10}$/.test(phn)) || pwd.length==0 || pwd!=repwd)
    {
        var element = document.getElementById("errors1");
        element.style.display = "block";
        console.log(pwd,repwd);
        return false;
    }
    else
        return true;
}

$(document).ready(function () {
		    $(".arrow-right").bind("click", function (event) {
		        event.preventDefault();
		        $(".vid-list-container").stop().animate({
		            scrollLeft: "+=336"
		        }, 750);
		    });
		    $(".arrow-left").bind("click", function (event) {
		        event.preventDefault();
		        $(".vid-list-container").stop().animate({
		            scrollLeft: "-=336"
		        }, 750);
		    });
		});


var counter = 0;
var data;

function startQuiz(){
    document.querySelector("#quiz_rules").style.display = "none";
    document.querySelector("#quiz-body").style.display = "block";
    var quizData = JSON.parse(document.querySelector("#quiz-data").value);
    data = quizData;
    console.log(quizData);
}

function next(){
    if(counter==data.length){
        document.querySelector("#quiz-body").style.display = "none";
        document.querySelector("#quiz-message").style.display = "block";
        return;
    }
    console.log("fdefk");
    document.querySelector("#question").innerHTML = data[counter++].q;
}