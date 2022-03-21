import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({

    intl: service(),
    languageIds: computed("intl", function () {
        return this.get('intl').get('locales')
    }),

    languageName(languageId) {
        return this.get('intl').t('localeName', { locale: languageId })
    },

    actions: {
        setLanguage: function (selectedLanguageId) {
            this.intl.setLanguage(selectedLanguageId)
        }
    }
});
