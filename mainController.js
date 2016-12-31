app.controller('mainController', ['factService', '$scope', '$interval', function(factService, $scope, $interval) {


  //The default time is 25 minutes
  var DEFAULT_TIME = 60*25;

  //Generate the facts in the service
  factService.generate();

  //Private function which will update the status of the test
  function updateHUD() {
    $scope.correctCount = factService.getCorrectCount();
    $scope.incorrectCount = factService.getIncorrectCount();
    $scope.remainingCount = factService.getRemainingCount();
    $scope.score = ($scope.correctCount / ($scope.correctCount + $scope.incorrectCount)) * 100 || 0;
  }

  //variable to use to track ellapsed ticks
  var timer = DEFAULT_TIME; //25 minutes in seconds
  
  //Interval function to count down from the default time to 0 by 1 tick at a time
  //one tick = once second since the interval is at 1000ms
  var countDown = $interval(function(){
    timer--; //Decrement the timer
    $scope.minutes = Math.floor(timer / 60);
    $scope.seconds = timer - $scope.minutes * 60;
    if($scope.seconds < 10){
      $scope.seconds = "0" + $scope.seconds;
    }
    $scope.timedOut = timer === 0;
  }, 1000);
  

  //Update the stats for the initial state of the test
  updateHUD();


  /*
   START SCOPE FUNCTIONS
  */
  
  //Display the first fact
  $scope.currentFact = factService.getNext();
  
  //Reset and restart the test
  $scope.reset = function(){
    //Variables to tracker user input
    $scope.userAnswer = null, $scope.correct = false, $scope.answered = false;
  
    $scope.timedOut = false;    
    timer = DEFAULT_TIME;
    
    factService.generate();
    $scope.allotedTime = DEFAULT_TIME/60;
    updateHUD();
  };

  //If the time is changed then we restart the test
  $scope.changeTime = function(time){
    DEFAULT_TIME = time*60;
    $scope.reset();
  }

  //This will cycle to the next fact
  $scope.getNext = function() {
    $scope.currentFact = factService.getNext();
    $scope.userAnswer = null;
    $scope.answered = false, $scope.correct = null;
  };

  //This checks the current fact for correctness
  $scope.check = function() {
    if (+$scope.userAnswer === $scope.currentFact.answer) {
      $scope.correct = true;
      factService.addCorrect($scope.currentFact);
    } else {
      $scope.correct = false;
      factService.addIncorrect($scope.currentFact);
    }
    $scope.answered = true;
    //Update test statistics
    updateHUD();
    //If the test is donethen cancel the timer
    if($scope.isTestDone()){
      $interval.cancel(countDown);   
    }
  };

  //The test is done after all facts are answered
  $scope.isTestDone = function(){
    return factService.getRemainingCount() === 0;
  }

  //If we timeout then stop the timer
  $scope.$watch('timedOut', function(newVal){
    if(newVal)
      $interval.cancel(countDown);    
  });
}]);
