import React, { useState, useCallback, useEffect } from 'react';

import { Sidebar } from 'primereact/sidebar';
import { ListBox } from 'primereact/listbox';
import { ProgressSpinner } from 'primereact/progressspinner';

import { useTracked } from './../../Store';
import { getItem } from './../../Helpers';
import { currencyApiEndpoints } from './../../API';
import axios from './../../Axios';

const CurrencySidebar = (props) => {

  const [state, setState] = useTracked();
  const [currencies, setCurrencies] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (currencies.length == 0) {
      requestCurrencies();
    }
  }, [currencies.length == 0]);

  const requestCurrencies = useCallback(() => {
    axios.get(currencyApiEndpoints.currency, {})
      .then(response => {
        // console.log(response.data);
        if (response.data.data.length > 0) {
          let currency = response.data.data.find(el => el.id === getItem('user').currency_id ? el : null)

          setState(prev => ({ ...prev, currentCurrency: currency, currencyLoading: false }));
          setCurrencies(response.data.data);
          setFetching(false);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, [currencies.length == 0]);

  return (
    <Sidebar visible={props.visible} position="right" onHide={props.onHide} style={{ width: '345px' }}>
      <h1 className="p-card-title">Currencies</h1>
      {
        fetching ?
          <div className="p-grid p-justify-center p-align-center" style={{ height: '86vh' }}>
            <ProgressSpinner style={{ height: '35px' }} strokeWidth={'4'} />
          </div>
          :
          <ListBox value={state.currentCurrency}
            filter={true}
            options={currencies}
            dataKey="currency_code"
            optionLabel="currency_code"
            onChange={(e) => {
              console.log(e.value);
              setState(prev => ({ ...prev, currentCurrency: e.value }));
            }}
            itemTemplate={(item) => {
              return (
                <div className="p-clearfix">
                  <span className="color-highlight text-bold">{item.currency_code}</span> <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{item.country}</span>
                </div>
              )
            }}
            listStyle={{ maxHeight: '86vh' }}
            style={{ width: '100%' }}
          />
      }
    </Sidebar>
  );
}

export default React.memo(CurrencySidebar);
