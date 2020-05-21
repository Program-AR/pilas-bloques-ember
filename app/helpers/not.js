import Ember from 'ember';

export function not([value]/*, hash */) {
    return !value;
}

export default Ember.Helper.helper(not);