/*
 * model.js
 * Author: Konrad Aust, aka Ironykins
 * Contains the model of the enigma machine 
 * That is, everything that represents working parts and internal state.
 */

// The Machine itself
var eMachine = {
    /* Initial single-alphabet substitution cipher. 
     * TODO: Model this more like the actual plugboard with steckered pairs. */
    plugBoard : "ABCDEFGHIJKLMNOPQRSTUVWXYZ", 

    /* Rotors are listed right-to-left here. */
    rotors : [ rotorIV, rotorIII, rotorII, rotorI],
    rotorPositions: [ 'A', 'A', 'A', 'A' ],
}

/* Rotors keep track of:
 * mapping: The substitution alphabet of the rotor
 * turnover: The position of the turnover notch 
 *           (If the rotor steps away from the letter with 
 *           the turnover notch, the next rotor is advanced)
 */
var rotorIV = {
    mapping : "ESOVPZJAYQUIRHXLNFTGKDCMWB",
    turnover: 'J',
}

var rotorIII = {
    mapping : "BDFHJLCPRTXVZNYEIWGAKMUSQO",
    turnover: 'V',
}

var rotorII = {
    mapping : "AJDKSIRUXBLHWTMCQGZNPYFVOE",
    turnover: 'E',
}

var rotorI = {
    mapping : "EKMFLGDQVZNTOWYHXUSPAIBRCJ",
    turnover: 'Q',
}

