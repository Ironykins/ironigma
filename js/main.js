//Let's do this shit.
var app = angular.module('ironigma', []);

app.controller('enigma', ['$scope', function($scope) {
    $scope.enigma = new M3();
    $scope.ciphertext = "";
    $scope.plugboard = [];
    $scope.rotorList = [rI,rII,rIII,rIV,rV,rVI,rVII,rVIII];
    $scope.selectedRotors = [];
    $scope.reflectorList = [refBeta,refGamma,refA,refB,refC,refBThin,refCThin,ETW];

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

    //Functions for doing thangs with the machine's rotors.
    $scope.removeRotor = function(rotorIndex) {
        $scope.enigma.rotors.splice(rotorIndex,1);
        $scope.updateRotorView();
    }
    
    $scope.addRotor = function() {
        var newRotor = angular.copy($scope.rotorList[0]);
        $scope.enigma.rotors.push(newRotor);
        $scope.updateRotorView();
    }

    $scope.changeRotor = function(index) {
        var newRotor = angular.copy($scope.selectedRotors[index]);
        $scope.enigma.rotors[index] = newRotor;
        $scope.updateRotorView();
    }

    //Hacky way of syncing the view and model.
    $scope.updateRotorView = function() {
        //Double-nested for with x and y indices. It's like I'm really back in high school...
        for (var x=0,lx=$scope.enigma.rotors.length;x<lx;x++) 
            for(var y=0,ly=$scope.rotorList.length;y<ly;y++)
                if($scope.enigma.rotors[x].name == $scope.rotorList[y].name)
                    $scope.selectedRotors[x] = $scope.rotorList[y];
    }
    $scope.updateRotorView();

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

//Rotor position acts like a number, but wants people to see it as a character.
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

//Ringsetting should be shifted up 1. Because zero indexing will cause users to faint.
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
