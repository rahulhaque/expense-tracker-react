import React from 'react';

import * as Yup from "yup";
import Head from "../../layout/Head";
import {Messages} from "primereact/components/messages/Messages";
import {Card} from "primereact/components/card/Card";
import {Formik} from "formik";
import {InputText} from "primereact/components/inputtext/InputText";
import {Button} from "primereact/components/button/Button";
import {DataTable} from 'primereact/datatable';
import {expenseApiEndpoints} from "../../api/config";
import axios from "../../request/axios";
import {Column} from "primereact/components/column/Column";
import {ProgressSpinner} from "primereact/components/progressspinner/ProgressSpinner";
import CurrencySidebar from "../common/CurrencySidebar";
import {AppContext} from "../../context/ContextProvider";
import {Calendar} from "primereact/components/calendar/Calendar";
import * as dayjs from "dayjs";
import {Dropdown} from "primereact/components/dropdown/Dropdown";
import {InputTextarea} from "primereact/components/inputtextarea/InputTextarea";
import {Link} from "react-router-dom";
import Swal from 'sweetalert2';

class Expense extends React.Component {

  static contextType = AppContext;

  constructor() {
    super();
    this.state = {
      expenseDate: new Date(),
      expense: [],
      expenseSummary: {},
      expenseLoading: true,
      sortField: 'id',
      sortOrder: -1,
      rowsPerPage: 5,
      currentPage: 1
    }
  }

  async componentDidMount() {
    this.requestExpenseSummary();
    await this.requestExpenseCategory();
    await this.requestExpense();
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

  requestExpense = async () => {
    await axios.get(expenseApiEndpoints.expense + '?page=' + this.state.currentPage + '&sort_col=' + this.state.sortField + '&per_page=' + this.state.rowsPerPage + '&sort_order=' + (this.state.sortOrder > 0 ? 'asc' : 'desc'), {})
    .then(response => {
      // console.log(response.data);
      if (response.data.data) {
        this.setState(prevState => {
          return {
            expense: response.data,
            expenseLoading: false,
          }
        });
      }
      else {
        this.setState(prevState => {
          return {
            expenseLoading: false,
          }
        });
      }
    })
    .catch(error => {
      console.log(error);
    });
  };

  requestExpenseSummary = async () => {
    await axios.get(expenseApiEndpoints.summary, {})
    .then(response => {
      // console.log(response.data);
      this.setState({expenseSummary: response.data.data});
    })
    .catch(error => {
      console.log(error);
    });
  };

  deleteExpense = (data) => {
    // console.log(data);
    Swal.fire({
      customClass: {
        container: 'container-class',
        popup: 'popup-class',
        header: 'header-class',
        title: 'p-card-title',
        content: 'content-class',
        closeButton: 'close-button-class',
        image: 'image-class',
        input: 'input-class',
        actions: 'actions-class',
        confirmButton: 'p-button p-button-raised p-button-danger p-button-text-icon-left',
        cancelButton: 'p-button p-button-raised p-button-info p-button-text-icon-left',
        footer: 'footer-class'
      },
      title: 'Are you sure?',
      text: `Confirm to delete expense on ${data.spent_on}.`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: '<span class="pi pi-trash p-button-icon-left"></span><span class="p-button-text">Delete</span>',
      cancelButtonText: '<span class="pi pi-ban p-button-icon-left"></span><span class="p-button-text">No</span>',
      // confirmButtonColor: '#f76452',
      // cancelButtonColor: '#3085d6',
      focusConfirm: false,
      focusCancel: true
    })
    .then((result) => {
      if (result.value) {
        axios.delete(expenseApiEndpoints.expense + '/' + data.id, {})
        .then(response => {
          // console.log(response.data);
          if (response.status === 200) {

            this.requestExpense();
            this.requestExpenseSummary();

            this.messages.show({
              severity: 'success',
              detail: 'Your expense on ' + data.spent_on + ' deleted successfully.',
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

        });
      }
    });
  };

  submitExpense = (values, formikBag) => {
    axios.post(expenseApiEndpoints.expense, JSON.stringify(values))
    .then(response => {
      // console.log('success');
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

      if (error.response.status === 422) {
        formikBag.setErrors(error.response.data);
      }

      formikBag.setSubmitting(false)
    })
  };

  renderExpenseSummary = (data) => {
    if (data && data.length > 0) {
      return data.map((item, index) => {
        return <div key={index}>
          <div className="color-link text-center">{item.total.toLocaleString()} <span className="color-title">{item.currency_code + '.'}</span></div>
          <hr/>
        </div>
      })
    }
    else {
      return <div>
        <div className="text-center">No expense data found.</div>
        <hr/>
      </div>
    }
  };

  render() {
    // console.log(this.state);
    return (
      <div>
        <Head title="Expense"/>

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
            <div className="p-fluid">

              <div className="p-grid">
                <div className="p-col-6">
                  <div className="p-panel p-component">
                    <div className="p-panel-titlebar"><span className="color-title text-bold">Expense This Month</span>
                    </div>
                    <div className="p-panel-content-wrapper p-panel-content-wrapper-expanded" id="pr_id_1_content"
                         aria-labelledby="pr_id_1_label" aria-hidden="false">
                      <div className="p-panel-content">
                        {this.renderExpenseSummary(this.state.expenseSummary.expense_month)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-col-6">
                  <div className="p-panel p-component">
                    <div className="p-panel-titlebar"><span className="color-title text-bold">Expense Today</span></div>
                    <div className="p-panel-content-wrapper p-panel-content-wrapper-expanded" id="pr_id_1_content"
                         aria-labelledby="pr_id_1_label" aria-hidden="false">
                      <div className="p-panel-content">
                        {this.renderExpenseSummary(this.state.expenseSummary.expense_today)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="p-grid">

          <div className="p-col-12 p-md-6">
            <Card className="rounded-border">
              <div>
                <div className="p-card-title p-grid p-nogutter p-justify-between">Add Expense</div>
                <div className="p-card-subtitle">Add your expense information below.</div>
              </div>
              <br/>
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
                          this.setState({expenseDate: e.value});
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
                        style={{width: '100%'}}
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
                                 onChange={props.handleChange}/>
                      <p className="text-error">{props.errors.spent_on}</p>
                    </div>
                    <div className="p-fluid">
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
                      <InputTextarea rows={5} autoResize={true} placeholder="Remarks" name="remarks"
                                     value={props.values.remarks}
                                     onChange={props.handleChange}/>
                      <p className="text-error">{props.errors.remarks}</p>
                    </div>
                    <div className="p-fluid">
                      <Button disabled={props.isSubmitting} type="submit" label="Add Expense" icon="pi pi-plus"
                              className="p-button-raised"/>
                    </div>
                  </form>
                )}/>
            </Card>
          </div>

          <div className="p-col-12 p-md-6">
            <Card className="rounded-border">
              <div>
                <div className="p-card-title p-grid p-nogutter p-justify-between">View Expenses</div>
                <div className="p-card-subtitle">Here are few expenses you've added.</div>
              </div>
              <br/>
              {
                this.state.expenseLoading ? (
                  <div className="p-grid p-justify-center p-align-center">
                    <ProgressSpinner style={{height: '25px'}} strokeWidth={'4'}/>
                  </div>
                ) : (
                  <DataTable value={this.state.expense.data}
                             sortField={this.state.sortField}
                             sortOrder={this.state.sortOrder}
                             responsive={true}
                             paginator={true}
                             rows={this.state.rowsPerPage}
                             rowsPerPageOptions={[5, 10, 20]}
                             totalRecords={this.state.expense.total}
                             lazy={true}
                    // loading={this.state.expenseLoading}
                    // loadingIcon={'pi pi-save'}
                             first={this.state.expense.from - 1}
                             onPage={(e) => {
                               // console.log(e);
                               this.setState({
                                 currentPage: (e.page + 1),
                                 rowsPerPage: e.rows,
                                 expenseLoading: true
                               }, () => {
                                 this.requestExpense();
                               });
                             }}
                             onSort={e => {
                               // console.log(e);
                               this.setState({
                                 sortField: e.sortField,
                                 sortOrder: e.sortOrder,
                                 expenseLoading: true
                               }, () => {
                                 this.requestExpense();
                               });

                             }}
                             className="text-center"
                  >
                    <Column field="id" header="Serial" sortable={true}/>
                    <Column field="spent_on" header="Spent On" sortable={true}/>
                    <Column field="category_name" header="Category" sortable={true}/>
                    <Column field="amount" header="Amount" sortable={true}
                            body={(rowData, column) => {
                              return rowData.amount.toLocaleString() + ' ' + rowData.currency_name
                            }}
                    />
                    <Column field="expense_date" header="Date" sortable={true}
                            body={(rowData, column) => {
                              return dayjs(rowData.expense_date).format('YYYY-MM-DD hh:mm a')
                            }}
                    />
                    <Column
                      body={(rowData, column) => {
                        // console.log(rowData);
                        return (
                          <div>
                            <Link to={`/expense/${rowData.id}/edit`}>
                              <Button label="Edit" value={rowData.id}
                                      icon="pi pi-pencil"
                                      className="p-button-raised p-button-rounded p-button-info"/>
                            </Link>
                            <Button label="Delete"
                                    onClick={() => this.deleteExpense(rowData)}
                                    icon="pi pi-trash"
                                    className="p-button-raised p-button-rounded p-button-danger"/>
                          </div>
                        )
                      }}
                      header="Action"
                      style={{textAlign: 'center', width: '8em'}}
                    />
                  </DataTable>
                )
              }
            </Card>
          </div>

        </div>
      </div>

    )
  }
}

export default Expense;
