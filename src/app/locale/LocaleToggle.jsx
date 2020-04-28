import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { Button } from 'primereact/button';

import { useTracked } from './../../Store';

const LocaleToggle = (props) => {

  const [state, setState] = useTracked();
  const [t, i18n] = useTranslation();

  console.log('LocaleToggle', state);

  const toggleLanguage = useCallback(() => {
    setState(prev => {
      if (prev.language === 'bn') {
        i18n.changeLanguage('en');
        return {...prev, language: 'en' };
      }
      else {
        i18n.changeLanguage('bn');
        return {...prev, language: 'bn' }
      }
    });
  }, [state.language]);

  return (
    <Button type="button" onClick={toggleLanguage}
      label={state.language === 'en' ? 'English' : 'বাংলা'} icon="pi pi-globe"
      className={props.className ? props.className : "p-button-raised p-button-rounded p-button-secondary"}
      style={{ width: '100px' }} />
  );
};

LocaleToggle.propTypes = {
  className: PropTypes.string,
};

export default React.memo(LocaleToggle);
