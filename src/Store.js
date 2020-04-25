import { useState } from 'react';
import { createContainer } from 'react-tracked';

import { getItem, setItem, saveState } from './Helpers';

// const currencyUpdated = useCallback((currency) => {
//   this.setState({
//     currentCurrency: currency,
//     currencyLoading: false
//   });
// });

// const layoutModeChanged = useCallback((layout) => {
//   this.setState({ layoutMode: layout });
//   setItem('layoutMode', layout);
// });

// const layoutColorModeChanged = useCallback((theme) => {
//   this.setState({ layoutColorMode: theme });
//   setItem('layoutColorMode', theme);
// });

// const persistState = () => {
//   saveState(this.state);
// };

const globalState = {
  // Declare your global variable and functions here
  language: getItem('state') ? getItem('state').language : 'en',
  layoutMode: getItem('layoutMode') ? getItem('layoutMode') : 'static',
  layoutColorMode: getItem('layoutColorMode') ? getItem('layoutColorMode') : 'dark',
  currentCurrency: null,
  currencyLoading: true,
  user: getItem('user') ? getItem('user') : ''
};

const useMyState = () => useState(globalState);

export const { Provider, useTracked } = createContainer(useMyState);
