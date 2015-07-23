/*
 * model.js
 * Author: Konrad Aust, aka Ironykins
 * Contains the model of the enigma machine 
 * That is, everything that represents working parts and internal state.
 */

// The Machine itself
var eMachine = {
    /* Initial single-alphabet substitution cipher. 
     * An array of 2-item arrays. eg. ['B','Y'] indicates that B and Y are 
     * connected via a plug.*/
    plugBoard : [],

    /* Rotors are listed right-to-left here. */
    rotors : [ rotorIV, rotorIII, rotorII, rotorI],
    rotorPositions: [ 0, 0, 0, 0 ],
}

//Performs a rotor substitution.
//character = The input character
//rotor = The rotor doing the substitution
//returns the character post-substitution
function subRotor(character,rotor)
{
    var charIndex = character.charCodeAt() - 65;
    return String.fromCharCode(rotor.mapping.charCodeAt(charIndex));
}

/* Rotors keep track of:
 * mapping: The substitution alphabet of the rotor
 * turnover: The position of the turnover notch 
 *           (If the rotor steps away from the letter with 
 *           the turnover notch, the next rotor is advanced)
 */
var rotorIV = {
    mapping : "ESOVPZJAYQUIRHXLNFTGKDCMWB",
    turnover: 9,
}

var rotorIII = {
    mapping : "BDFHJLCPRTXVZNYEIWGAKMUSQO",
    turnover: 21,
}

var rotorII = {
    mapping : "AJDKSIRUXBLHWTMCQGZNPYFVOE",
    turnover: 4,
}

var rotorI = {
    mapping : "EKMFLGDQVZNTOWYHXUSPAIBRCJ",
    turnover: 16,
}

