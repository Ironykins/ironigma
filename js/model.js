/*
 * model.js
 * Author: Konrad Aust, aka Ironykins
 * Contains the model of the enigma machine 
 * That is, everything that represents working parts and internal state.
 */

/* Represents an Enigma Machine.
 * The rotors are listed in right-to-left order.
 * The plugboard is an array of 2-item arrays. 
 * Eg. ['B','Y'] in the plugboard array indicates that B and Y are 
 * connected via a plug 
 * The reflector is represented as a single substitution alphabet.*/
function Enigma(rotors, reflector, plugboard) {
    this.rotors = rotors;
    this.reflector = reflector;
    this.plugboard = plugboard;
}
Enigma.prototype.checkPlugboard = function() //Verify the plugboard configuration is valid
{
    var totalArray = []; //Add letters to this.
    if(this.plugboard.length > 13) return false;
    for(var x=0;x<this.plugboard.length;x++) {
        if(this.plugboard[x].length != 2) 
            return false;

        if(totalArray.indexOf(this.plugboard[x][0]) > -1)
            return false;

        totalArray.push(this.plugboard[x][0]);

        if(totalArray.indexOf(this.plugboard[x][1]) > -1)
            return false;

        totalArray.push(this.plugboard[x][1]);
    }
    return true;
}
Enigma.prototype.step = function() { //Steps the rightmost rotor. If this triggers another step, perform it. And so on.
    for(var x=0;x<this.rotors.length;x++) {
        var cont = this.rotors[x].willTurnoverOnStep();
        this.rotors[x].step();
        if(!cont) return;
    }
}
Enigma.prototype.plugboardTransform = function(character) {
    for(var x=0;x<this.plugboard.length;x++) {
        if(this.plugboard[x][0] == character)
            return this.plugboard[x][1];
        else if(this.plugboard[x][1] == character)
            return this.plugboard[x][0];
    }

    return character;
}
Enigma.prototype.encrypt = function(character) { //Encrypts a character. Steps the rotors.
    var workingChar = this.plugboardTransform(character);

    //TODO: Working logic with rotors and such here.

    this.step();
    return this.plugboardTransform(workingChar);
}
Enigma.prototype.reset = function() { //Resets the machine.
    this.plugboard = [];
    for(var x=0;x<this.rotors.length;x++) {
        this.rotors[x].position = 0;
    }
}

//General function to substitue a character using a given mapping.
function substitute(character, mapping) { 
    var charIndex = character.charCodeAt() - 65;
    return String.fromCharCode(mapping.charCodeAt(charIndex));
}

/* Working Engima machine default. */
M4.prototype = new Enigma();
M4.prototype.constructor = M4;
function M4() {
    var rIV = new Rotor("ESOVPZJAYQUIRHXLNFTGKDCMWB", 9);
    var rIII = new Rotor("BDFHJLCPRTXVZNYEIWGAKMUSQO", 21);
    var rII = new Rotor("AJDKSIRUXBLHWTMCQGZNPYFVOE", 4);
    var rI = new Rotor("EKMFLGDQVZNTOWYHXUSPAIBRCJ", 16);
    this.rotors = [rIV, rIII, rII, rI];
    this.plugboard = [];
    this.reflector = "YRUHQSLDPXNGOKMIEBFZCWVJAT"; //Reflector B
}

/* Rotors keep track of:
 * mapping: The substitution alphabet of the rotor
 * turnover: The position of the turnover notch 
 *           (If the rotor steps away from the letter with 
 *           the turnover notch, the next rotor is advanced)
 */
function Rotor(mapping, turnover) {
    this.mapping = mapping;
    this.turnover = turnover;
    this.position = 0;
}
//Performs a single character substitution. 
Rotor.prototype.sub = function(character) {
    var charIndex = character.charCodeAt() - 65;
    charIndex = (charIndex + this.position) % 26; //The rotation of the rotor affects incoming letters.
    return String.fromCharCode(this.mapping.charCodeAt(charIndex));
}
//Advances the rotor. Returns the new position.
Rotor.prototype.step = function() { 
    this.position = (this.position + 1) % 26;
    return this.position;
}
//True if the next step will cause the rotor to step the next one forwards.
Rotor.prototype.willTurnoverOnStep = function() {
    return (this.position == this.turnover);
}
Rotor.prototype.displayChar = function() {
    return String.fromCharCode(this.position + 65);
}
