import React, {Component} from 'react';
import {getItem} from "../../helper/index";
import {currencyApiEndpoints} from "../../api/config";
import axios from "../../request/axios";
import {Sidebar} from "primereact/components/sidebar/Sidebar";
import {ListBox} from "primereact/components/listbox/ListBox";
import {AppContext} from "../../context/ContextProvider";
import {ProgressSpinner} from "primereact/components/progressspinner/ProgressSpinner";

class CurrencySidebar extends Component {

  static contextType = AppContext;

  constructor() {
    super();
    this.state = {
      currencies: [],
      currencyLoading: true
    };

  }

  componentDidMount() {
    this.requestCurrencies();
  }

  requestCurrencies = () => {
    axios.get(currencyApiEndpoints.currency, {})
    .then(response => {
      // console.log(response.data);
      if (response.data.data.length > 0) {
        this.context.currencyUpdated(response.data.data.find(el => el.id === getItem('user').currency_id ? el : null));
        this.setState({currencies: response.data.data,});
      }
    })
    .catch(error => {
      console.log(error);
    });
  };

  render() {
    return (
      <Sidebar visible={this.props.visible} position="right" onHide={this.props.onHide} style={{width: '345px'}}>
        <h1 className="p-card-title">Currencies</h1>
        {
          this.context.state.currencyLoading ?
            <div className="p-grid p-justify-center p-align-center" style={{height: '86vh'}}>
              <ProgressSpinner style={{height: '35px'}} strokeWidth={'4'}/>
            </div>
            :
            <ListBox value={this.context.state.currentCurrency}
                     filter={true}
                     options={this.state.currencies}
                     dataKey="currency_code"
                     optionLabel="currency_code"
                     onChange={(e) => {
                       console.log(e.value);
                       this.context.currencyUpdated(e.value);
                     }}
                     itemTemplate={(item) => {
                       return (
                         <div className="p-clearfix">
                           <span className="color-highlight text-bold">{item.currency_code}</span> <span style={{fontSize: '12px', fontWeight: 'bold'}}>{item.country}</span>
                         </div>
                       )
                     }}
                     listStyle={{maxHeight: '86vh'}}
                     style={{width: '100%'}}
            />
        }
      </Sidebar>
    );
  }
}

export default CurrencySidebar;
