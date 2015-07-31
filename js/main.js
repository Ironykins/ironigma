//Let's do this shit.

angular.module('ironigma', [])
.controller('enigma', ['$scope', function($scope) {
    $scope.enigma = new M3();
    $scope.ciphertext = "";

    $scope.step = function() { $scope.enigma.step() }
    $scope.reset = function() { $scope.enigma.reset() }

    $scope.charEncrypt = function() { 
        $scope.ciphertext += $scope.enigma.encrypt($scope.input);
        $scope.input = "";

    }
}])

