import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { Button } from 'primereact/button';

import { setItem } from './../../Helpers';
import { useTracked } from './../../Store';

const LocaleToggle = (props) => {

  const [state, setState] = useTracked();
  const [t, i18n] = useTranslation();

  console.log('LocaleToggle', state);

  const toggleLanguage = useCallback(() => {
    i18n.language === 'en' ? i18n.changeLanguage('bn') : i18n.changeLanguage('en')
    setItem('language', i18n.language);
  });

  return (
    <Button type="button" onClick={toggleLanguage}
      label={i18n.language === 'en' ? 'English' : 'বাংলা'} icon="pi pi-globe"
      className={props.className ? props.className : "p-button-raised p-button-rounded p-button-secondary"}
      style={{ width: '100px' }} />
  );
};

LocaleToggle.propTypes = {
  className: PropTypes.string,
};

export default React.memo(LocaleToggle);
