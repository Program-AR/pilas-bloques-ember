import Ember from 'ember';

export function not([value]) {
    return !value;
}

export default Ember.Helper.helper(not);