import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({

    intl: service(),
    disabledLanguages: [],
    localeCodes: computed("intl", function () {
        return this.get('intl').get('locales').filter(localeCode => !this.disabledLanguages.includes(localeCode))
    }),

    languageName(localeCode) {
        return this.get('intl').t('localeName', { locale: localeCode })
    },

    actions: {
        setLocale: function (selectedLocaleCode) {
            this.intl.setSelectedLocale(selectedLocaleCode)
        }
    }
});
