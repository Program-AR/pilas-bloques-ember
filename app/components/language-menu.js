import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({

    intl: service(),
    localeCodes: computed("intl", function () {
        return this.get('intl').get('locales')
    }),

    languageName(localeCode) {
        return this.get('intl').t('localeName', { locale: localeCode })
    },

    actions: {
        setLanguage: function (selectedLocaleCode) {
            this.intl.setLanguage(selectedLocaleCode)
        }
    }
});
