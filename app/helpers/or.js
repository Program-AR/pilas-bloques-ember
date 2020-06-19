import Ember from 'ember';

export function or([bool1, bool2]) {
    return bool1 || bool2;
}

export default Ember.Helper.helper(or);