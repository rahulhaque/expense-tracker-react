import { useState } from 'react';
import { createContainer } from 'react-tracked';

import { getItem } from './Helpers';

const globalState = {
  // Declare your global variable and functions here
  layoutMode: getItem('layoutMode') ? getItem('layoutMode') : 'static',
  layoutColorMode: getItem('layoutColorMode') ? getItem('layoutColorMode') : 'dark',
  currencies: [],
  currentCurrency: null,
  user: getItem('user') ? getItem('user') : ''
};

const useMyState = () => useState(globalState);

export const { Provider, useTracked } = createContainer(useMyState);
