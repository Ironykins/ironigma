//Let's do this shit.

angular.module('ironigma', [])
.controller('enigma', ['$scope', function($scope) {
    $scope.enigma = new M3();
    $scope.ciphertext = "";
    //$scope.plugboard = [];

    $scope.step = function() { $scope.enigma.step() }
    $scope.reset = function() { 
        $scope.enigma.reset() 
        $scope.ciphertext = ""
        $scope.plugboard = []
    }

    $scope.charEncrypt = function() { 
        $scope.ciphertext += $scope.enigma.encrypt($scope.input);
        $scope.input = "";
    }

    $scope.notImplemented = function() {
        alert("Not yet implemented!");
    }

    //Change plugboard input
    $scope.plugboardInput = function(changedChar) {
        var enteredChar = $scope.plugboard[changedChar];

        //If the plugboard has an entry for this char, remove it.
        for(var i=0;i<$scope.enigma.plugboard.length;i++) {
            if($scope.enigma.plugboard[i].indexOf(changedChar) != -1) {
                $scope.enigma.plugboard.splice(i,1);
                break;
            }
            if($scope.enigma.plugboard[i].indexOf(enteredChar) != -1) {
                $scope.enigma.plugboard.splice(i,1);
                break;
            }
        }
        
        if(enteredChar.length == 1 && enteredChar != changedChar) 
            $scope.enigma.plugboard.push([changedChar, enteredChar]);

        //Then we sync up the view. Shouldn't be bad on performance. Small arrays.
        $scope.plugboard = [];
        for(var i=0;i<$scope.enigma.plugboard.length;i++) {
            var char1 = $scope.enigma.plugboard[i][0];
            var char2 = $scope.enigma.plugboard[i][1];

            $scope.plugboard[char1] = char2;
            $scope.plugboard[char2] = char1;
        }
    }
}])

