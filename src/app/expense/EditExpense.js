import React from 'react';

import * as Yup from "yup";
import Head from "../../layout/Head";
import {Messages} from "primereact/components/messages/Messages";
import {Card} from "primereact/components/card/Card";
import {Formik} from "formik";
import {InputText} from "primereact/components/inputtext/InputText";
import {Button} from "primereact/components/button/Button";
import {expenseApiEndpoints} from "../../api/config";
import axios from "../../request/axios";
import {AppContext} from "../../context/ContextProvider";
import {InputTextarea} from "primereact/inputtextarea";
import {Calendar} from "primereact/calendar";
import * as dayjs from "dayjs";
import {Dropdown} from "primereact/dropdown";
import CurrencySidebar from "../common/CurrencySidebar";

class EditExpense extends React.Component {

  static contextType = AppContext;

  constructor() {
    super();
    this.state = {
      expense: {
        id: '',
        amount: '',
        category_id: '',
        created_at: '',
        created_by: '',
        currency_id: '',
        expense_date: '',
        remarks: '',
        spent_on: '',
        updated_at: '',
        updated_by: ''
      }
    }
  }

  async componentDidMount() {
    await this.requestExpenseCategory();
    await this.requestExpenseInfo();
  }

  requestExpenseCategory = async () => {
    await axios.get(expenseApiEndpoints.expenseCategory, {})
    .then(response => {
      // console.log(response.data);
      if (response.data.data.length > 0) {
        this.setState(prevState => {
          return {expenseCategories: response.data.data}
        });
      }
      else {

      }
    })
    .catch(error => {
      console.log(error);
    });
  };

  requestExpenseInfo = async () => {
    await axios.get(expenseApiEndpoints.expense + '/' + this.props.match.params.expense_id, {})
    .then(response => {
      // console.log(response.data);
      this.setState({
        expense: {
          id: response.data.id,
          category_id: response.data.category_id,
          amount: response.data.amount,
          created_at: response.data.created_at,
          created_by: response.data.created_by,
          currency_id: response.data.currency_id,
          expense_date: response.data.transaction_date,
          remarks: response.data.remarks,
          spent_on: response.data.spent_on,
          updated_at: response.data.updated_at,
          updated_by: response.data.updated_by
        },
        expenseCategory: this.state.expenseCategories.find(el => el.id === response.data.category_id ? el : null),
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

  submitUpdateExpense = (values, formikBag) => {
    axios.put(expenseApiEndpoints.expense + '/' + this.state.expense.id, JSON.stringify(values))
    .then(response => {
      console.log('success');
      console.log(response.data.request);

      if (response.status === 200) {

        formikBag.setSubmitting(false);
        formikBag.setValues(response.data.request);

        this.messages.show({
          severity: 'success',
          detail: 'Your expense info updated successfully.',
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
        <Head title="Edit Expense"/>

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
                <div className="p-card-title p-grid p-nogutter p-justify-between">Edit Expense</div>
                <div className="p-card-subtitle">Edit selected expense information below.</div>
              </div>
              <br/>
              <Formik
                enableReinitialize={true}
                initialValues={this.state.expense}
                validationSchema={
                  Yup.object().shape({
                    expense_date: Yup.string().required('Expense date field is required'),
                    category_id: Yup.number().required('Expense category field is required'),
                    amount: Yup.number().required('Expense amount field is required'),
                    spent_on: Yup.string().max(100, 'Spent on must be at most 100 characters').required('Spent on field is required'),
                    remarks: Yup.string().max(200, 'Remarks must be at most 200 characters'),
                  })
                }
                onSubmit={(values, formikBag) => {
                  // console.log(values);
                  this.submitUpdateExpense(values, formikBag);
                }}
                render={props => (
                  <form onSubmit={props.handleSubmit}>
                    <div className="p-fluid">
                      <label>Expense Date</label>
                      <Calendar
                        name="expense_date"
                        dateFormat="yy-mm-dd"
                        showTime={true}
                        hourFormat="12"
                        showButtonBar={true}
                        value={props.values.expense_date ? new Date(props.values.expense_date) : null}
                        onChange={(e) => {
                          props.setFieldValue('expense_date', dayjs(e.value).format('YYYY-MM-DD HH:mm:ss'));
                        }}
                        touchUI={window.innerWidth < 768}
                      />
                      <p className="text-error">{props.errors.expense_date}</p>
                    </div>
                    <div className="p-fluid">
                      <label>Expense Category</label>
                      <Dropdown
                        name="category_id"
                        filter={true}
                        filterPlaceholder="Search here"
                        showClear={true}
                        value={this.state.expenseCategory}
                        options={this.state.expenseCategories}
                        style={{width: '100%'}}
                        onChange={e => {
                          props.setFieldValue('category_id', e.value.id);
                          this.setState({
                            expenseCategory: e.value,
                          });
                        }}
                        placeholder="Select a category"
                        optionLabel="category_name"
                      />
                      <p className="text-error">{props.errors.category_id}</p>
                    </div>
                    <div className="p-fluid">
                      <label>Amount</label>
                      <div className="p-inputgroup">
                        <InputText keyfilter="money" placeholder="Amount" name="amount" value={props.values.amount}
                                   onChange={props.handleChange}/>
                        <Button
                          label={`${this.context.state.currencyLoading ? 'loading' : this.context.state.currentCurrency.currency_code}`}
                          type="button"
                          onClick={(e) => this.setState({visible: true})}/>
                      </div>
                      <p className="text-error">{props.errors.amount}</p>
                    </div>
                    <div className="p-fluid">
                      <label>Spent On</label>
                      <InputText name="spent_on" value={props.values.spent_on}
                                 onChange={props.handleChange}/>
                      <p className="text-error">{props.errors.spent_on}</p>
                    </div>
                    <div className="p-fluid">
                      <label>Remarks</label>
                      <InputTextarea rows={5} autoResize={true} placeholder="" name="remarks"
                                     value={props.values.remarks}
                                     onChange={props.handleChange}/>
                      <p className="text-error">{props.errors.remarks}</p>
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

export default EditExpense;
