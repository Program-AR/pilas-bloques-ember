import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pilas-toggle', 'Integration | Component | pilas toggle', {
  integration: true
});

test('it renders', function(assert) {
  this.render(toggle);

  assert.ok(this.$("input")[0]);
});

test('it can be disabled', function(assert) {
  this.set("disabled", true);
  this.render(toggle);

  assert.ok(this.$("input")[0].disabled);
});

test('it can be checked', function(assert) {
  this.set("checked", true);
  this.render(toggle);

  assert.ok(this.$("input")[0].checked);
});

let toggle = hbs`{{pilas-toggle isDisabled=disabled isChecked=checked}}`;
