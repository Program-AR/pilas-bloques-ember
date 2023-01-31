/* jshint ignore:start */
import Component from '@ember/component';
import ParentMixin from '../mixins/parent-mixin';
import { computed, action } from '@ember/object'
import { tagName } from '@ember-decorators/component';

@tagName('form')
export default class PbForm extends Component.extend(ParentMixin) {

    @computed('isInvalid')
    get isValid() {
        return !this.isInvalid
    }

    @computed('childComponents.@each.isInvalid')
    get isInvalid() {
        return this.childComponents.isAny('isInvalid')
    }

    submit() {
        this.send('localOnSubmit');
        return false;
    }

    @action
    localOnSubmit() {
        this.childComponents.forEach(c => c.send('submitClicked'))
        if (this.isValid) {
            this.onSubmit()
        }
    }
}
/* jshint ignore:end */
