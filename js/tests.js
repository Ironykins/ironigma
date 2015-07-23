QUnit.test( "Single Rotor Substitution", function( assert ) {
    var sub1 = subRotor('A',rotorI);
    var sub2 = subRotor('Z',rotorI);
    var sub3 = subRotor('J',rotorI);
    assert.equal(sub1,'E');
    assert.equal(sub2,'J');
    assert.equal(sub3,'Z');
});
