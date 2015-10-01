import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('pilas-blockly', 'Unit | Component | pilas blockly', {
  // Specify the other units that are required for this test
  //needs: ['component:foo', 'helper:bar'],
  //needs: ['em-modal'],
  unit: true
});

test('it renders', function(assert) {
  assert.expect(1);

  var component = this.subject({test: 123123123});
  this.render();
  debugger;
  assert.equal(this.$().text().trim(), '');
});
