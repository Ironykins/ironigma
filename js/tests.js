/* 
 * Enigma Machine Tests!
 */
QUnit.module("Enigma Tests", {
    beforeEach: function() {
        var rIV = new Rotor("ESOVPZJAYQUIRHXLNFTGKDCMWB", 9);
        var rIII = new Rotor("BDFHJLCPRTXVZNYEIWGAKMUSQO", 21);
        var rII = new Rotor("AJDKSIRUXBLHWTMCQGZNPYFVOE", 4);
        var rI = new Rotor("EKMFLGDQVZNTOWYHXUSPAIBRCJ", 16);
        this.enigma = new Enigma([rIV,rIII,rII,rI], []);
    },});
QUnit.test("Plugboard validation", function( assert ) {
    this.enigma.plugboard = [ ['A','A'] ];
    assert.notOk(this.enigma.checkPlugboard());
    this.enigma.plugboard = [ ['A','B','C'] ];
    assert.notOk(this.enigma.checkPlugboard());
    this.enigma.plugboard = [ ['A','B'] ];
    assert.ok(this.enigma.checkPlugboard());
    this.enigma.plugboard = [ ['A','B'], ['C','A']];
    assert.notOk(this.enigma.checkPlugboard());
});

/*
 * Rotor Tests!
 */
QUnit.module("Rotor Tests", {
    beforeEach: function() {
        this.rotor = new Rotor("EKMFLGDQVZNTOWYHXUSPAIBRCJ", 16);
    },});
QUnit.test( "Single Rotor Substitution without stepping", function( assert ) {
    assert.equal(this.rotor.sub('A'),'E');
    assert.equal(this.rotor.sub('Z'),'J');
    assert.equal(this.rotor.sub('J'),'Z'); 
});

QUnit.test( "Single Rotor Substitution with stepping", function( assert ) {
    assert.equal(this.rotor.sub('A'),'E');
    this.rotor.step();
    assert.equal(this.rotor.sub('A'),'K');
    this.rotor.position = 25;
    assert.equal(this.rotor.sub('Z'),'C'); 
    this.rotor.step();
    assert.equal(this.rotor.sub('Z'),'J');
});

QUnit.test( "Rotor advances correctly", function( assert ) {
    this.rotor.position = 24;
    assert.equal(this.rotor.step(),25);
    assert.equal(this.rotor.step(),0);
    assert.equal(this.rotor.step(),1); 
});

QUnit.test( "Rotor steps properly", function( assert ) {
    this.rotor.position = 15;
    assert.notOk(this.rotor.willTurnoverOnStep());
    this.rotor.step();
    assert.ok(this.rotor.willTurnoverOnStep());
});
