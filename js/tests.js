/* 
 * Enigma Machine Tests!
 */
QUnit.module("Enigma Tests", {
    beforeEach: function() {
        var rIII = new Rotor("BDFHJLCPRTXVZNYEIWGAKMUSQO", 21);
        var rII = new Rotor("AJDKSIRUXBLHWTMCQGZNPYFVOE", 4);
        var rI = new Rotor("EKMFLGDQVZNTOWYHXUSPAIBRCJ", 16);
        this.enigma = new Enigma([rIII,rII,rI],"YRUHQSLDPXNGOKMIEBFZCWVJAT", []);
    },});
QUnit.test("Plugboard validation", function( assert ) {
    assert.ok(this.enigma.checkPlugboard());
    this.enigma.plugboard = [ ['A','A'] ];
    assert.notOk(this.enigma.checkPlugboard());
    this.enigma.plugboard = [ ['A','B','C'] ];
    assert.notOk(this.enigma.checkPlugboard());
    this.enigma.plugboard = [ ['A','B'] ];
    assert.ok(this.enigma.checkPlugboard());
    this.enigma.plugboard = [ ['A','B'], ['C','A']];
    assert.notOk(this.enigma.checkPlugboard());
});
QUnit.test("Properly performs rotor turnover.", function( assert ) {
    this.enigma.rotors[0].position = 21;
    this.enigma.rotors[1].position = 5;
    this.enigma.rotors[2].position = 17;
    this.enigma.step();
    assert.equal(this.enigma.rotors[0].position, 22);
    assert.equal(this.enigma.rotors[1].position, 6);
    assert.equal(this.enigma.rotors[2].position, 17);
});
QUnit.test("Steps forward after character encryption", function( assert ) {
    this.enigma.rotors[0].position = 9;
    var encryption1 = this.enigma.encrypt('A');
    assert.equal(this.enigma.rotors[0].position, 10);
});
QUnit.skip("Encrypts a single character correctly.", function( assert ) {
    var encryption1 = this.enigma.encrypt('A');
    assert.equal(encryption1,'B');

});
QUnit.test("Reset resets the machine.", function( assert) {
    this.enigma.plugboard = [ ['A','B'] ];
    this.enigma.rotors[0].position = 9;
    this.enigma.rotors[1].position = 21;
    this.enigma.rotors[2].position = 0;
    this.enigma.reset();
    assert.equal(this.enigma.plugboard.length, 0);
    assert.equal(this.enigma.rotors[0].position, 0);
    assert.equal(this.enigma.rotors[1].position, 0);
    assert.equal(this.enigma.rotors[2].position, 0);

});
QUnit.test("Encryption is its own inverse", function( assert ) {
    var encryption1 = this.enigma.encrypt('A');
    var encryption2 = this.enigma.encrypt('B');
    this.enigma.reset();
    var decryption1 = this.enigma.encrypt('A');
    var decryption2 = this.enigma.encrypt('B');
    assert.equal(encryption1, decryption1);
    assert.equal(encryption2, decryption2);
});
QUnit.test("Plugboard substitutes characters correctly.", function( assert ) {
    assert.equal(this.enigma.plugboardTransform('A'),'A');
    this.enigma.plugboard = [ ['A','B'], ['D','E'] ];
    assert.equal(this.enigma.plugboardTransform('A'),'B');
    assert.equal(this.enigma.plugboardTransform('B'),'A');
    assert.equal(this.enigma.plugboardTransform('C'),'C');
    assert.equal(this.enigma.plugboardTransform('E'),'D');
    assert.equal(this.enigma.plugboardTransform('D'),'E');
});
QUnit.test("Plugboard settings affect encryption.", function( assert ) {
    var normalEncryption = this.enigma.encrypt('A');
    this.enigma.plugboard = [ ['A','B'] ];
    var plugboardEncryption = this.enigma.encrypt('A');
    assert.notEqual(normalEncryption, plugboardEncryption);
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
QUnit.test( "Single Rotor back substitution without stepping.", function( assert ) {
    assert.equal(this.rotor.backsub('E'),'A');
    assert.equal(this.rotor.backsub('J'),'Z');
    assert.equal(this.rotor.backsub('Z'),'J'); 
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
QUnit.test( "Single Rotor Back Substitution with stepping", function( assert ) {
    assert.equal(this.rotor.backsub('E'),'A');
    this.rotor.step();
    assert.equal(this.rotor.backsub('K'),'A');
    this.rotor.position = 25;
    assert.equal(this.rotor.backsub('C'),'Z'); 
    this.rotor.step();
    assert.equal(this.rotor.backsub('J'),'Z');
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

QUnit.test( "Rotor shows the correct character", function( assert ) {
    this.rotor.position = 0;
    assert.equal(this.rotor.displayChar(),'A');
    this.rotor.position = 15;
    assert.equal(this.rotor.displayChar(),'P');
});
