// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();

$("#medicaments-toggler").click(function() {
	$("#medicaments-inter").toggle();
});


var app = angular.module('aiderapide', ['ngRoute']);
function aideRapideController($scope) {
	$scope.interactions = interactions;
}
