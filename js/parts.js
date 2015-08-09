/*
 * parts.js
 * Author: Konrad Aust, aka Ironykins
 * Contains several parts of the enigma machine.
 * Common rotors, reflectors, configurations, etc.
 */

/* All the different rotors. */
var rI   = new Rotor("I","EKMFLGDQVZNTOWYHXUSPAIBRCJ", 16);
var rII  = new Rotor("II","AJDKSIRUXBLHWTMCQGZNPYFVOE", 4);
var rIII = new Rotor("III","BDFHJLCPRTXVZNYEIWGAKMUSQO", 21);
var rIV = new Rotor("IV","ESOVPZJAYQUIRHXLNFTGKDCMWB", 9);
var rV = new Rotor("V","VZBRGITYUPSDNHLXAWMJQOFECK", 25);
var rVI = new Rotor("VI","JPGVOUMFYQBENHZRDKASXLICTW", 25, 12);
var rVII = new Rotor("VII","NZJHGRCXMYSWBOUFAIVLPEKQDT", 25, 12);
var rVIII = new Rotor("VIII","FKQHTLXOCBJSPDZRAMEWNIUYGV", 25, 12);

var rotorList = [rI,rII,rIII,rIV,rV,rVI,rVII,rVIII];

/* ALl the different Reflectors */
var refBeta = new Reflector("Reflector Beta","LEYJVCNIXWPBQMDRTAKZGFUHOS");
var refGamma = new Reflector("Reflector Gamma","FSOKANUERHMBTIYCWLQPZXVGJD");
var refA = new Reflector("Reflector A","EJMZALYXVBWFCRQUONTSPIKHGD");
var refB = new Reflector("Reflector B","YRUHQSLDPXNGOKMIEBFZCWVJAT");
var refC = new Reflector("Reflector C","FVPJIAOYEDRZXWGCTKUQSBNMHL");
var refBThin = new Reflector("Reflector B Thin","ENKQAUYWJICOPBLMDXZVFTHRGS");
var refCThin = new Reflector("Reflector C Thin","RDOBJNTKVEHMLFCWZAXGYIPSUQ");
var ETW = new Reflector("ETW","ABCDEFGHIJKLMNOPQRSTUVWXYZ");

var reflectorList = [refBeta,refGamma,refA,refB,refC,refBThin,refCThin,ETW];

/* Classic M3 Enigma Machine. */
M3.prototype = new Enigma();
M3.prototype.constructor = M3;
function M3() {
    this.rotors = [rI, rII, rIII];
    this.plugboard = [];
    this.reflector = refB;
}

