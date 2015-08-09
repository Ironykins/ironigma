//Let's do this shit.
var app = angular.module('ironigma', []);

app.controller('enigma', ['$scope', function($scope) {
    $scope.enigma = new M3();
    $scope.ciphertext = "";
    $scope.plugboard = [];
    $scope.rotorList = [rI,rII,rIII,rIV,rV,rVI,rVII,rVIII];
    $scope.reflectorList = [refBeta,refGamma,refA,refB,refC,refBThin,refCThin,ETW];
    $scope.selectedReflector = $scope.reflectorList[3];

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

    //Steps a rotor up or down.
    $scope.stepRotor = function(rotor, up) {
        var shiftVal = up ? 1 : -1;
        rotor.position = (rotor.position + shiftVal + 26) % 26
    }

    //Adjust a ring setting
    $scope.stepRingsetting = function(rotor, up) {
        var shiftVal = up ? 1 : -1;
        rotor.ringsetting = (rotor.ringsetting + shiftVal + 26) % 26
    }
    
    $scope.changeReflector = function() {
        $scope.enigma.reflector = $scope.selectedReflector;
    }

    //Change plugboard settings
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

//Show rotor position as a character. 
app.directive('rotorPosFormatter', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, controller) {
            controller.$formatters.push(function(value) {
                return String.fromCharCode(value + 65);
            });
            controller.$parsers.push(function(value) {
                if(value.length != 1) return 0;
                var charCode = value.charCodeAt();
                if(charCode >= 97) {charCode -= 32} //Convert lowercase.
                if(charCode < 65 || charCode > 90) {return 0}
                return charCode - 65;
            });
        }
    };
});

//Ringsetting should be shifted up 1. 
app.directive('rotorRingsettingFormatter', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, controller) {
            controller.$formatters.push(function(value) {
                return value+1;
            });
            controller.$parsers.push(function(value) {
                return value-1;
            });
        }
    };
});
