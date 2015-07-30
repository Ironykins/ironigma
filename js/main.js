//Let's do this shit.

angular.module('ironigma', [])
.controller('enigma', ['$scope', function($scope) {
    $scope.enigma = new M3();

    $scope.step = function() { $scope.enigma.step() }
}])

