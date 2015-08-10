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
    for (var x=this.rotors.length-1;x>=0;x--) {
        var cont = this.rotors[x].willTurnoverOnStep();
        this.rotors[x].step();
        if(!cont) return;
    }
}
Enigma.prototype.backstep = function() { //Same as above, but backwards.
    for (var x=this.rotors.length-1;x>=0;x--) {
        this.rotors[x].backstep();
        if(!this.rotors[x].willTurnoverOnStep()) return;
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
    var workingChar = this.validate(character);
    if(workingChar == "") {return ""} //If it's invalid, do nothing.
    workingChar = this.plugboardTransform(workingChar);
    this.step(); //You have to step BEFORE encrypting.

    for (var x=this.rotors.length-1;x>=0;x--)
        workingChar = this.rotors[x].sub(workingChar);
    
    workingChar = this.reflector.sub(workingChar);
    
    for (var x=0;x<this.rotors.length;x++) 
        workingChar = this.rotors[x].backsub(workingChar);
    
    return this.plugboardTransform(workingChar);
}
Enigma.prototype.reset = function() { //Resets the machine.
    this.plugboard = [];
    for(var x=0;x<this.rotors.length;x++) {
        this.rotors[x].position = 0;
        this.rotors[x].ringsetting = 0;
    }
}
Enigma.prototype.validate = function(character) { //Returns a sane character input from any character. Or an empty string.
    var charCode = character.charCodeAt();
    if(charCode >= 97) {charCode -= 32}
    if(charCode < 65 || charCode > 90) {return ""}
    return String.fromCharCode(charCode)
}

/*
 * Reflector! Just allows subtitution.
 */
function Reflector(name, mapping) {
    this.name = name;
    this.mapping = mapping;
}
Reflector.prototype.sub= function(character) {
    var charIndex = character.charCodeAt() - 65;
    return this.mapping[charIndex];
}

function shiftChar(character, steps) {
    var charIndex = (character.charCodeAt() - 65 + steps) % 26;
    if(charIndex < 0) charIndex += 26;
    return String.fromCharCode(charIndex + 65);
}

/* Rotors keep track of:
 * name: The name of the rotor. (Eg. "III")
 * mapping: The substitution alphabet of the rotor
 * turnover: The position of the turnover notch 
 *           (If the rotor steps away from the letter with 
 *           the turnover notch, the next rotor is advanced)
 * position: The current rotation of the ring
 * ringsetting: The current ringsetting
 */
function Rotor(name, mapping, turnover, doubleTurnover) {
    this.name = name;
    this.mapping = mapping;
    this.turnover = turnover;
    this.position = 0;
    this.ringsetting = 0;
    this.doubleTurnover = typeof doubleTurnover != 'undefined' ? doubleTurnover : -1;
}
//Performs a single character substitution, from the forward side of the rotor.
Rotor.prototype.sub = function(character) {
    var charIndex = character.charCodeAt() - 65;
    charIndex = (charIndex + this.position - this.ringsetting) % 26; 
    if (charIndex < 0) charIndex += 26;
    var returnChar = this.mapping.charAt(charIndex);
    return shiftChar(returnChar, this.ringsetting - this.position);
}
//Performs a single character substitution, from the back side of the rotor.
Rotor.prototype.backsub = function(character) {
    var newChar = shiftChar(character, this.position - this.ringsetting)
    var charIndex = this.mapping.indexOf(newChar);
    var returnChar = String.fromCharCode(charIndex + 65);
    return shiftChar(returnChar, this.ringsetting - this.position);
}
//Advances the rotor. Returns the new position.
Rotor.prototype.step = function() { 
    this.position = (this.position + 1) % 26;
    return this.position;
}
//Reverse of the above.
Rotor.prototype.backstep = function() { 
    this.position = (this.position - 1 + 26) % 26;
    return this.position;
}
//True if the next step will cause the rotor to step the next one forwards.
Rotor.prototype.willTurnoverOnStep = function() {
    return (this.position == this.turnover) || (this.position == this.doubleTurnover);
}
Rotor.prototype.displayChar = function() {
    return String.fromCharCode(this.position + 65);
}
