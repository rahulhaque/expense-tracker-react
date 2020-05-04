import React from 'react';

import * as Yup from "yup";
import Head from "../../layout/Head";
import {Messages} from "primereact/components/messages/Messages";
import {Card} from "primereact/components/card/Card";
import {Formik} from "formik";
import {InputText} from "primereact/components/inputtext/InputText";
import {Button} from "primereact/components/button/Button";
import {incomeApiEndpoints} from "../../api/config";
import axios from "../../request/axios";
import {AppContext} from "../../context/ContextProvider";
import {InputTextarea} from "primereact/inputtextarea";
import {Calendar} from "primereact/calendar";
import * as dayjs from "dayjs";
import CurrencySidebar from "../common/CurrencySidebar";
import {Dropdown} from "primereact/dropdown";

class EditIncome extends React.Component {

  static contextType = AppContext;

  constructor() {
    super();
    this.state = {
      income: {
        id: '',
        category_id: '',
        amount: '',
        created_at: '',
        created_by: '',
        currency_id: '',
        income_date: '',
        notes: '',
        source: '',
        updated_at: '',
        updated_by: null
      }
    }
  }

  async componentDidMount() {
    await this.requestIncomeCategory();
    await this.requestIncomeInfo();
  }

  requestIncomeCategory = async () => {
    await axios.get(incomeApiEndpoints.incomeCategory, {})
    .then(response => {
      console.log(response.data);
      if (response.data.data.length > 0) {
        this.setState(prevState => {
          return {incomeCategories: response.data.data}
        });
      }
      else {

      }
    })
    .catch(error => {
      console.log(error);
    });
  };

  requestIncomeInfo = async () => {
    await axios.get(incomeApiEndpoints.income + '/' + this.props.match.params.income_id, {})
    .then(response => {
      // console.log(response.data);
      this.setState({
        income: {
          id: response.data.id,
          category_id: response.data.category_id,
          amount: response.data.amount,
          created_at: response.data.created_at,
          created_by: response.data.created_by,
          currency_id: response.data.currency_id,
          income_date: response.data.transaction_date,
          notes: response.data.remarks,
          source: response.data.source,
          updated_at: response.data.updated_at,
          updated_by: response.data.updated_by
        },
        incomeCategory: this.state.incomeCategories.find(el => el.id === response.data.category_id ? el : null),
      });
    })
    .catch(error => {
      console.log('error');
      console.log(error.response);

      if (error.response.status === 401) {
        this.messages.show({
          severity: 'error',
          detail: 'Something went wrong. Try again.',
          sticky: true,
          closable: true,
          life: 5000
        });
      }

    })
  };

  submitUpdateIncome = (values, formikBag) => {
    axios.put(incomeApiEndpoints.income + '/' + this.state.income.id, JSON.stringify(values))
    .then(response => {
      console.log('success');
      console.log(response.data.request);

      if (response.status === 200) {

        formikBag.setSubmitting(false);
        formikBag.setValues(response.data.request);

        this.messages.show({
          severity: 'success',
          detail: 'Your income info updated successfully.',
          sticky: false,
          closable: false,
          life: 5000
        });
      }

    })
    .catch(error => {
      console.log('error');
      console.log(error.response);

      formikBag.resetForm();
      formikBag.setSubmitting(false);

      this.messages.clear();

      if (error.response.status === 422) {
        formikBag.setErrors(error.response.data);
      }
      else if (error.response.status === 401) {
        this.messages.show({
          severity: 'error',
          detail: 'Something went wrong. Try again.',
          sticky: true,
          closable: true,
          life: 5000
        });
      }

    })
  };

  render() {
    // console.log(this.context);
    return (
      <div>
        <Head title="Edit Income"/>

        <CurrencySidebar visible={this.state.visible} onHide={(e) => this.setState({visible: false})}/>

        <div className="p-grid p-nogutter">
          <div className="p-col-12">
            <div className="p-fluid">
              <Messages ref={(el) => this.messages = el}/>
            </div>
          </div>
        </div>

        <div className="p-grid">

          <div className="p-col-12">
            <Card className="rounded-border">
              <div>
                <div className="p-card-title p-grid p-nogutter p-justify-between">Edit Income</div>
                <div className="p-card-subtitle">Edit selected income information below.</div>
              </div>
              <br/>
              <Formik
                enableReinitialize={true}
                initialValues={this.state.income}
                validationSchema={
                  Yup.object().shape({
                    income_date: Yup.string().required('Income date field is required'),
                    category_id: Yup.number().required('Income category field is required'),
                    source: Yup.string().max(100, 'Income source must be at most 100 characters').required('Income source field is required'),
                    notes: Yup.string().max(200, 'Income notes must be at most 200 characters'),
                    amount: Yup.number().required('Income amount field is required'),
                  })
                }
                onSubmit={(values, formikBag) => {
                  // console.log(values);
                  this.submitUpdateIncome(values, formikBag);
                }}
                render={props => (
                  <form onSubmit={props.handleSubmit}>
                    <div className="p-fluid">
                      <label>Income Date</label>
                      <Calendar
                        name="income_date"
                        dateFormat="yy-mm-dd"
                        showTime={true}
                        hourFormat="12"
                        value={props.values.income_date ? new Date(props.values.income_date) : null}
                        onChange={(e) => {
                          props.setFieldValue('income_date', dayjs(e.value).format('YYYY-MM-DD HH:mm:ss'));
                        }}
                        maxDate={new Date()}
                        touchUI={window.innerWidth < 768}
                      />
                      <p className="text-error">{props.errors.income_date}</p>
                    </div>
                    <div className="p-fluid">
                      <label>Income Category</label>
                      <Dropdown
                        name="category_id"
                        filter={true}
                        filterPlaceholder="Search here"
                        showClear={true}
                        value={this.state.incomeCategory}
                        options={this.state.incomeCategories}
                        style={{width: '100%'}}
                        onChange={e => {
                          props.setFieldValue('category_id', e.value.id);
                          this.setState({
                            incomeCategory: e.value,
                          });
                        }}
                        placeholder="Select a category"
                        optionLabel="category_name"
                      />
                      <p className="text-error">{props.errors.category_id}</p>
                    </div>
                    <div className="p-fluid">
                      <label>Income Source</label>
                      <InputText name="source" value={props.values.source}
                                 onChange={props.handleChange}/>
                      <p className="text-error">{props.errors.source}</p>
                    </div>
                    <div className="p-fluid">
                      <label>Amount</label>
                      <div className="p-inputgroup">
                        <InputText keyfilter="money" name="amount" value={props.values.amount}
                                   onChange={props.handleChange}/>
                        <Button
                          label={`${this.context.state.currencyLoading ? 'loading' : this.context.state.currentCurrency.currency_code}`}
                          type="button"
                          onClick={(e) => this.setState({visible: true})}/>
                      </div>
                      <p className="text-error">{props.errors.amount}</p>
                    </div>
                    <div className="p-fluid">
                      <label>Income Notes</label>
                      <InputTextarea rows={5} autoResize={true} name="notes"
                                     value={props.values.notes}
                                     onChange={props.handleChange}/>
                      <p className="text-error">{props.errors.notes}</p>
                    </div>
                    <div className="p-fluid">
                      <Button disabled={props.isSubmitting} type="submit" label="Save Changes" icon="pi pi-save"
                              className="p-button-raised"/>
                    </div>
                  </form>
                )}/>
            </Card>
          </div>

        </div>
      </div>

    )
  }
}

export default EditIncome;
