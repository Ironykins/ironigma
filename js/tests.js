/* 
 * Enigma Machine Tests!
 */
QUnit.module("Enigma Tests", {
    beforeEach: function() {
        var rIII = new Rotor("III","BDFHJLCPRTXVZNYEIWGAKMUSQO", 21);
        var rII  = new Rotor("II","AJDKSIRUXBLHWTMCQGZNPYFVOE", 4);
        var rI   = new Rotor("I","EKMFLGDQVZNTOWYHXUSPAIBRCJ", 16);
        var reflector = new Reflector("Beta","YRUHQSLDPXNGOKMIEBFZCWVJAT");
        this.enigma = new Enigma([rI,rII,rIII],reflector,[]);
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
    this.enigma.rotors[2].position = 21;
    this.enigma.rotors[1].position = 5;
    this.enigma.rotors[0].position = 17;
    this.enigma.step();
    assert.equal(this.enigma.rotors[2].position, 22);
    assert.equal(this.enigma.rotors[1].position, 6);
    assert.equal(this.enigma.rotors[0].position, 17);
});
QUnit.test("Properly undoes rotor turnover.", function( assert ) {
    this.enigma.rotors[2].position = 22;
    this.enigma.rotors[1].position = 6;
    this.enigma.rotors[0].position = 17;
    this.enigma.backstep();
    assert.equal(this.enigma.rotors[2].position, 21);
    assert.equal(this.enigma.rotors[1].position, 5);
    assert.equal(this.enigma.rotors[0].position, 17);
});
QUnit.test("Steps forward after character encryption", function( assert ) {
    this.enigma.rotors[2].position = 9;
    var encryption1 = this.enigma.encrypt('A');
    assert.equal(this.enigma.rotors[2].position, 10);
});
QUnit.test("Encrypts a single character correctly.", function( assert ) {
    var encryption1 = this.enigma.encrypt('A');
    var encryption2 = this.enigma.encrypt('B');
    var encryption3 = this.enigma.encrypt('C');
    assert.equal(encryption1,'B');
    assert.equal(encryption2,'J');
    assert.equal(encryption3,'E');
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
QUnit.test("Lowercase characters encrypted the same as uppercase.", function( assert ) {
    var upperEncrypt = this.enigma.encrypt('A');
    this.enigma.reset()
    var lowerEncrypt = this.enigma.encrypt('a');
    assert.equal(upperEncrypt, lowerEncrypt);
});
QUnit.test("Non-letter characters are ignored.", function( assert ) {
    var enc1 = this.enigma.encrypt('.');
    var enc2 = this.enigma.encrypt('/');
    var enc3 = this.enigma.encrypt('6');
    assert.equal(enc1, "");
    assert.equal(enc2, "");
    assert.equal(enc3, "");
    assert.equal(this.enigma.rotors[this.enigma.rotors.length-1].position,0);
});
QUnit.test("Encrypts strings correctly.", function( assert ) {
    var enc1 = this.enigma.encryptStr("THECAKEISALIE");
    assert.equal(enc1,"OPCBOOKBKTOXL");
    assert.equal(this.enigma.rotors[this.enigma.rotors.length-1].position,13);
});

/*
 * Rotor Tests!
 */
QUnit.module("Rotor Tests", {
    beforeEach: function() {
        this.rotor = new Rotor("I","EKMFLGDQVZNTOWYHXUSPAIBRCJ", 16);
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
    assert.equal(this.rotor.sub('A'),'J');
    this.rotor.position = 25;
    assert.equal(this.rotor.sub('Z'),'D'); 
    this.rotor.step();
    assert.equal(this.rotor.sub('Z'),'J');
});
QUnit.test( "Single Rotor Back Substitution with stepping", function( assert ) {
    assert.equal(this.rotor.backsub('E'),'A');
    this.rotor.step();
    assert.equal(this.rotor.backsub('K'),'D');
    this.rotor.position = 25;
    assert.equal(this.rotor.backsub('C'),'X'); 
    this.rotor.step();
    assert.equal(this.rotor.backsub('J'),'Z');
});
QUnit.test( "Rotor advances correctly", function( assert ) {
    this.rotor.position = 24;
    assert.equal(this.rotor.step(),25);
    assert.equal(this.rotor.step(),0);
    assert.equal(this.rotor.step(),1); 
});
QUnit.test( "Rotor moves backwards correctly", function( assert ) {
    this.rotor.position = 1;
    assert.equal(this.rotor.backstep(),0);
    assert.equal(this.rotor.backstep(),25);
    assert.equal(this.rotor.backstep(),24); 
});
QUnit.test( "Rotor steps properly", function( assert ) {
    this.rotor.position = 15;
    assert.notOk(this.rotor.willTurnoverOnStep());
    this.rotor.step();
    assert.ok(this.rotor.willTurnoverOnStep());
});
QUnit.test( "Rotor doublesteps properly", function( assert ) {
    this.rotor = new Rotor("VI","JPGVOUMFYQBENHZRDKASXLICTW", 25, 12);
    this.rotor.position = 24;
    assert.notOk(this.rotor.willTurnoverOnStep());
    this.rotor.step();
    assert.ok(this.rotor.willTurnoverOnStep());
    this.rotor.position = 11;
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
QUnit.test( "Sub and BackSub are inverses.", function( assert ) {
    this.rotor.position = 0;
    assert.equal(this.rotor.sub(this.rotor.backsub('A')),'A');
    assert.equal(this.rotor.backsub(this.rotor.sub('A')),'A');
    this.rotor.position = 1;
    assert.equal(this.rotor.sub(this.rotor.backsub('A')),'A');
    assert.equal(this.rotor.backsub(this.rotor.sub('A')),'A');
    this.rotor.ringsetting = 3;
    assert.equal(this.rotor.sub(this.rotor.backsub('A')),'A');
    assert.equal(this.rotor.backsub(this.rotor.sub('A')),'A');
});
QUnit.test( "Ring setting on forward substitution", function( assert ) {
    this.rotor.ringsetting = 5;
    assert.equal(this.rotor.sub('A'),'N');
    assert.equal(this.rotor.sub('Z'),'F');
    assert.equal(this.rotor.sub('J'),'Q'); 
});
QUnit.test( "Ring setting on backward substitution", function( assert ) {
    this.rotor.ringsetting = 5;
    assert.equal(this.rotor.backsub('N'),'A');
    assert.equal(this.rotor.backsub('F'),'Z');
    assert.equal(this.rotor.backsub('Q'),'J'); 
});
