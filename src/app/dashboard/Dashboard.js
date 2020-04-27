import React from 'react';
import { Helmet } from 'react-helmet';
import * as Yup from "yup";
import * as dayjs from "dayjs";

import { Messages } from 'primereact/messages';
import { Card } from 'primereact/card';
import { Formik } from "formik";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { expenseApiEndpoints, incomeApiEndpoints, reportApiEndpoints } from './../../API';
import { ProgressSpinner } from 'primereact/progressspinner';

import CurrencySidebar from './../common/CurrencySidebar';
import ExpenseListItem from "../expense/ExpenseListItem";
import IncomeListItem from "../income/IncomeListItem";

import { AppContext } from "../../context/ContextProvider";
import axios from "../../request/axios";

class Dashboard extends React.Component {

  static contextType = AppContext;

  constructor() {
    super();
    this.state = {
      expenseDate: new Date(),
      recentExpense: [],
      recentExpenseLoading: true,
      recentIncome: [],
      recentIncomeLoading: true,
      monthlyExpenseSummary: {},
      monthlyIncomeSummary: {}
    };
  }

  async componentDidMount() {
    await this.requestExpenseCategory();
    await this.requestExpense();
    await this.requestIncome();
    await this.requestExpenseSummary();
    await this.requestIncomeSummary();
  }

  requestExpenseCategory = async () => {
    await axios.get(expenseApiEndpoints.expenseCategory, {})
      .then(response => {
        // console.log(response.data);
        if (response.data.data.length > 0) {
          this.setState(prevState => {
            return { expenseCategories: response.data.data }
          });
        }
        else {

        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  requestExpenseSummary = async () => {
    await axios.get(reportApiEndpoints.monthlyExpenseSummary, {})
      .then(response => {
        // console.log(response.data);
        this.setState({ monthlyExpenseSummary: response.data.data });
      })
      .catch(error => {
        console.log(error);
      });
  };

  requestIncomeSummary = async () => {
    await axios.get(reportApiEndpoints.monthlyIncomeSummary, {})
      .then(response => {
        // console.log(response.data);
        this.setState({ monthlyIncomeSummary: response.data.data });
      })
      .catch(error => {
        console.log(error);
      });
  };

  requestExpense = async () => {
    await axios.get(expenseApiEndpoints.expense + '?per_page=5&sort_order=' + (this.state.sortOrder > 0 ? 'asc' : 'desc'), {})
      .then(response => {
        // console.log(response.data);
        this.setState(prevState => {
          return {
            recentExpense: response.data.data,
            recentExpenseLoading: false
          }
        });
      })
      .catch(error => {
        console.log(error);
        this.setState(prevState => {
          return {
            recentExpenseLoading: false
          }
        });
      });
  };

  requestIncome = async () => {
    await axios.get(incomeApiEndpoints.income + '?per_page=5&sort_order=' + (this.state.sortOrder > 0 ? 'asc' : 'desc'), {})
      .then(response => {
        // console.log(response.data);
        this.setState(prevState => {
          return {
            recentIncome: response.data.data,
            recentIncomeLoading: false
          }
        });
      })
      .catch(error => {
        console.log(error);
        this.setState(prevState => {
          return {
            recentIncomeLoading: false
          }
        });
      });
  };

  submitExpense = (values, formikBag) => {
    axios.post(expenseApiEndpoints.expense, JSON.stringify(values))
      .then(response => {
        // console.log('success');
        // console.log(response.data);

        if (response.status === 201) {

          formikBag.resetForm();
          formikBag.setSubmitting(false);
          this.setState({
            expenseCategory: '',
          });
          this.requestExpense();
          this.requestExpenseSummary();

          this.messages.show({
            severity: 'success',
            detail: 'Your expense on ' + response.data.request.spent_on + ' added.',
            sticky: false,
            closable: false,
            life: 5000
          });
        }

      })
      .catch(error => {
        console.log('error');
        console.log(error.response);

        if (error.response.status === 401) {
          this.messages.clear();
          this.messages.show({
            severity: 'error',
            detail: 'Something went wrong. Try again.',
            sticky: true,
            closable: true,
            life: 5000
          });
        }

        formikBag.setSubmitting(false)
      })
  };

  renderRecentExpense = () => {
    if (this.state.recentExpenseLoading) {
      return (
        <div className="p-grid p-nogutter p-justify-center">
          <ProgressSpinner style={{ height: '25px' }} strokeWidth={'4'} />
        </div>
      );
    }
    else {
      if (this.state.recentExpense.length > 0) {
        return this.state.recentExpense.map((item, index) => {
          return <ExpenseListItem key={item.id} itemDetail={item} />;
        })
      }
      else {
        return (
          <div className="p-grid p-nogutter p-justify-center">
            <h4 className="color-subtitle">Spend some cash to see recent.</h4>
          </div>
        );
      }
    }
  };

  renderRecentIncome = () => {
    if (this.state.recentIncomeLoading) {
      return (
        <div className="p-grid p-nogutter p-justify-center">
          <ProgressSpinner style={{ height: '25px' }} strokeWidth={'4'} />
        </div>
      );
    }
    else {
      if (this.state.recentIncome.length > 0) {
        return this.state.recentIncome.map((item, index) => {
          return <IncomeListItem key={item.id} itemDetail={item} />;
        })
      }
      else {
        return (
          <div className="p-grid p-nogutter p-justify-center">
            <h4 className="color-subtitle">Add some earnings to see recent.</h4>
          </div>
        );
      }
    }
  };

  renderSummary = (data) => {
    if (data && data.length > 0) {
      return data.map((item, index) => {
        return <div key={index}>
          <div className="color-link text-center">{item.total.toLocaleString()} <span className="color-title">{item.currency_code + '.'}</span></div>
          <hr />
        </div>
      })
    }
    else if (typeof data === "object" && Object.values(data).length > 0) {
      return Object.values(data).map((item, index) => {
        return <div key={index}>
          <div className="color-link text-center">{item.total.toLocaleString()} <span className="color-title">{item.currency_code + '.'}</span></div>
          <hr />
        </div>
      })
    }
    else {
      return <div>
        <div className="text-center">No expense data found.</div>
        <hr />
      </div>
    }
  };

  render() {
    // console.log(this.state);
    return (
      <div>
        <Helmet title="Dashboard" />
        <CurrencySidebar visible={this.state.visible} onHide={(e) => this.setState({ visible: false })} />

        <div className="p-grid p-nogutter">
          <div className="p-col-12">
            <div className="p-fluid">
              <Messages ref={(el) => this.messages = el} />
            </div>
          </div>
        </div>

        <div className="p-grid">
          <div className="p-col-12">
            <div className="p-fluid">

              <div className="p-grid">
                <div className="p-col-6 p-md-3">
                  <div className="p-panel p-component">
                    <div className="p-panel-titlebar"><span className="color-title text-bold">Expense Last Month</span>
                    </div>
                    <div className="p-panel-content-wrapper p-panel-content-wrapper-expanded" id="pr_id_1_content"
                      aria-labelledby="pr_id_1_label" aria-hidden="false">
                      <div className="p-panel-content">
                        {this.renderSummary(this.state.monthlyExpenseSummary.expense_last_month)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-col-6 p-md-3">
                  <div className="p-panel p-component">
                    <div className="p-panel-titlebar"><span className="color-title text-bold">Expense This Month</span></div>
                    <div className="p-panel-content-wrapper p-panel-content-wrapper-expanded" id="pr_id_1_content"
                      aria-labelledby="pr_id_1_label" aria-hidden="false">
                      <div className="p-panel-content">
                        {this.renderSummary(this.state.monthlyExpenseSummary.expense_this_month)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-col-6 p-md-3">
                  <div className="p-panel p-component">
                    <div className="p-panel-titlebar"><span className="color-title text-bold">Income Last Month</span>
                    </div>
                    <div className="p-panel-content-wrapper p-panel-content-wrapper-expanded" id="pr_id_1_content"
                      aria-labelledby="pr_id_1_label" aria-hidden="false">
                      <div className="p-panel-content">
                        {this.renderSummary(this.state.monthlyIncomeSummary.income_last_month)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-col-6 p-md-3">
                  <div className="p-panel p-component">
                    <div className="p-panel-titlebar"><span className="color-title text-bold">Income This Month</span></div>
                    <div className="p-panel-content-wrapper p-panel-content-wrapper-expanded" id="pr_id_1_content"
                      aria-labelledby="pr_id_1_label" aria-hidden="false">
                      <div className="p-panel-content">
                        {this.renderSummary(this.state.monthlyIncomeSummary.income_this_month)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="p-grid">

          <div className="p-col-12 p-md-6 p-lg-4">
            <Card className="rounded-border">
              <div>
                <div className="p-card-title p-grid p-nogutter p-justify-between">Expense Info</div>
                <div className="p-card-subtitle">Enter your expense information below.</div>
              </div>
              <br />
              <Formik
                initialValues={{
                  expense_date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                  category_id: '',
                  amount: '',
                  spent_on: '',
                  remarks: ''
                }}
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
                  values.currency_id = this.context.state.currentCurrency.id;
                  // console.log(values);
                  this.submitExpense(values, formikBag);
                }}
                render={props => (
                  <form onSubmit={props.handleSubmit}>
                    <div className="p-fluid">
                      <Calendar
                        name="expense_date"
                        dateFormat="yy-mm-dd"
                        showTime={true}
                        hourFormat="12"
                        showButtonBar={true}
                        value={this.state.expenseDate}
                        onChange={(e) => {
                          console.log(e.value);
                          props.setFieldValue('expense_date', dayjs(e.value).format('YYYY-MM-DD HH:mm:ss'));
                          this.setState({ expenseDate: e.value });
                        }}
                        maxDate={new Date()}
                        touchUI={window.innerWidth < 768}
                      />
                      <p className="text-error">{props.errors.expense_date}</p>
                    </div>
                    <div className="p-fluid">
                      <Dropdown
                        name="category_id"
                        filter={true}
                        filterPlaceholder="Search here"
                        showClear={true}
                        value={this.state.expenseCategory}
                        options={this.state.expenseCategories}
                        style={{ width: '100%' }}
                        onChange={e => {
                          props.setFieldValue('category_id', e.value.id);
                          this.setState({
                            expenseCategory: e.value,
                          });
                        }}
                        placeholder="Expense Category"
                        optionLabel="category_name"
                      />
                      <p className="text-error">{props.errors.category_id}</p>
                    </div>
                    <div className="p-fluid">
                      <InputText placeholder="Spent on" name="spent_on" value={props.values.spent_on}
                        onChange={props.handleChange} />
                      <p className="text-error">{props.errors.spent_on}</p>
                    </div>
                    <div className="p-fluid">
                      <div className="p-inputgroup">
                        <InputText keyfilter="money" placeholder="Amount" name="amount" value={props.values.amount}
                          onChange={props.handleChange} />
                        <Button
                          label={`${this.context.state.currencyLoading ? 'loading' : this.context.state.currentCurrency.currency_code}`}
                          type="button"
                          onClick={(e) => this.setState({ visible: true })} />
                      </div>
                      <p className="text-error">{props.errors.amount}</p>
                    </div>
                    <div className="p-fluid">
                      <InputTextarea rows={5} autoResize={true} placeholder="Remarks" name="remarks"
                        value={props.values.remarks}
                        onChange={props.handleChange} />
                      <p className="text-error">{props.errors.remarks}</p>
                    </div>
                    <div className="p-fluid">
                      <Button disabled={props.isSubmitting} type="submit" label="Add Expense" icon="pi pi-plus"
                        className="p-button-raised" />
                    </div>
                  </form>
                )} />
            </Card>
          </div>

          <div className="p-col-12 p-md-6 p-lg-4">
            <Card className="rounded-border">
              <div>
                <div className="p-card-title p-grid p-nogutter p-justify-between">Recent Expenses -</div>
                <div className="p-card-subtitle">Here are few expenses you've made.</div>
              </div>
              <br />
              <div>
                {this.renderRecentExpense()}
              </div>
            </Card>
          </div>

          <div className="p-col-12 p-md-6 p-lg-4">
            <Card className="rounded-border">
              <div>
                <div className="p-card-title p-grid p-nogutter p-justify-between">Recent Incomes +</div>
                <div className="p-card-subtitle">Here are few incomes you've added.</div>
              </div>
              <br />
              <div>
                {this.renderRecentIncome()}
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }
}

export default Dashboard;
