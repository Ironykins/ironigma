//Let's do this shit.

angular.module('ironigma', [])
.controller('enigma', ['$scope', function($scope) {
    $scope.enigma = new M4();
    $scope.a = 1;
    $scope.b = 2;
}])


