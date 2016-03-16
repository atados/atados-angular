import {locale, facebookClientId} from '../constants';

// config
function facebookCfg (ezfbProvider) {
  'ngInject';
  ezfbProvider.setLocale(locale);
  ezfbProvider.setInitParams({
    appId: facebookClientId
  });
};

export default facebookCfg;
