/*
 * parts.js
 * Author: Konrad Aust, aka Ironykins
 * Contains several parts of the enigma machine.
 * Common rotors, reflectors, configurations, etc.
 */

/* Classic M3 Enigma Machine. */
M3.prototype = new Enigma();
M3.prototype.constructor = M3;
function M3() {
    var rIII = new Rotor("III","BDFHJLCPRTXVZNYEIWGAKMUSQO", 21);
    var rII  = new Rotor("II","AJDKSIRUXBLHWTMCQGZNPYFVOE", 4);
    var rI   = new Rotor("I","EKMFLGDQVZNTOWYHXUSPAIBRCJ", 16);
    var reflectorB = new Reflector("Beta","YRUHQSLDPXNGOKMIEBFZCWVJAT");
    this.rotors = [rI, rII, rIII];
    this.plugboard = [];
    this.reflector = reflectorB;
}

