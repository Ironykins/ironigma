//Let's do this shit.

angular.module('ironigma', [])
.controller('enigma', ['$scope', function($scope) {
    $scope.enigma = new M4();
    $scope.enigma.rotors[0].step();
}])


