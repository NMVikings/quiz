(function () {
	var app = angular.module('myQuiz', []);

	app.controller('QuizController', ['$scope', '$http', '$sce', '$window', function ($scope, $http, $sce, $window) {

		/*Запрос json файла*/
		$http.get('guess_art.json').then(function (quizData) {
			$scope.Data = quizData.data;
			$scope.quizName = $scope.Data.title;
			$scope.totalQuestions = $scope.Data.numberOfQuestions;
			$scope.quizData = shakeAnswers(shakeQuestions($scope.Data.quiz).slice(0, $scope.totalQuestions));
			$scope.resultData = $scope.Data.result;
			//$scope.url = $scope.Data.shareUrl;
		});
		/*Запрос json файла*/

		$scope.score = 0;
		$scope.activeQuestionIndex = -1;
		$scope.currentStep = 'intro';
		$scope.result = null;
		var demo = false;// confirm('Включить демо-режим  отображением только result-card?'); // код для тестирования карточек
		var isClicked = false;

		$scope.startQuiz = function () {
			$scope.activeQuestionIndex = 0;
			$scope.activeQuestion = $scope.quizData[$scope.activeQuestionIndex];
			$scope.currentStep = 'progress';
			if (demo) { // код для тестирования карточек
				$scope.score = Number(prompt("Какой результат вы хотите?"));
				$scope.activeQuestionIndex = $scope.totalQuestions;
				$scope.endQuiz();
			}
		};

		$scope.selectAnswer = function (id) {
			if (!isClicked) {
				isClicked = true;
				$scope.result = (id == $scope.activeQuestion.correct);
				if ($scope.result)  $scope.score++;
			}
		};

		$scope.answerIsCorrect = function (id) {
			return (isClicked && id == $scope.activeQuestion.correct);
		};

		$scope.answerIsIncorrect = function (id) {
			return (isClicked && id != $scope.activeQuestion.correct);
		};

		$scope.nextQuestion = function () {
			$scope.activeQuestionIndex++;
			$scope.result = null;
			isClicked = false;
			if ($scope.activeQuestionIndex == $scope.totalQuestions) {
				$scope.endQuiz();
			} else {
				$scope.activeQuestion = $scope.quizData[$scope.activeQuestionIndex];
			}
		};

		var shakeAnswers = function (Data) {
			for (var i = 0; i < Data.length; i++) {
				var answer = Data[i].answers;
				var rand = Math.random()*10;
				if (rand > 5) {
					answer[0] = [answer[1], answer[1] = answer[0]][0];
				}
			}
			return Data;
		};

		var shakeQuestions = function (a) {
			for (var i = 0; i < a.length; i++) {
				var rand = Math.floor(Math.random() * a.length);
				a[i] = [a[rand], a[rand] = a[i]][0];
			}
			return a;
		};

		var createResultCard = function(score,total) {
			var percentage = score/total*100 || 0 ;
			$scope.resultCard = {};

			if ($scope.currentStep !== 'resume')
				return;

			var found = false,
				lastCard = $scope.resultData[0];
			angular.forEach($scope.resultData, function(item){
				if (!found && item.percent >= percentage)
				{
					lastCard = item;
					found = true;
				}
			});
			$scope.resultCard = lastCard;
		};

		$scope.endQuiz = function () {
			$scope.currentStep = "resume";
			createResultCard($scope.score, $scope.totalQuestions);
		};
	}]);
})();