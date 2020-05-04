import React from 'react';

import * as Yup from "yup";
import Head from "../../layout/Head";
import {Messages} from "primereact/components/messages/Messages";
import {Card} from "primereact/components/card/Card";
import {Formik} from "formik";
import {InputText} from "primereact/components/inputtext/InputText";
import {Button} from "primereact/components/button/Button";
import {DataTable} from 'primereact/datatable';
import {incomeApiEndpoints} from "../../api/config";
import axios from "../../request/axios";
import {Column} from "primereact/components/column/Column";
import {ProgressSpinner} from "primereact/components/progressspinner/ProgressSpinner";
import CurrencySidebar from "../common/CurrencySidebar";
import {AppContext} from "../../context/ContextProvider";
import {Calendar} from "primereact/components/calendar/Calendar";
import * as dayjs from "dayjs";
import {Link} from "react-router-dom";
import {InputTextarea} from "primereact/inputtextarea";
import {Dropdown} from "primereact/dropdown";
import Swal from 'sweetalert2';

class Income extends React.Component {

  static contextType = AppContext;

  constructor() {
    super();
    this.state = {
      incomeDate: new Date(),
      income: [],
      incomeSummary: {},
      incomeLoading: true,
      sortField: 'id',
      sortOrder: -1,
      rowsPerPage: 5,
      currentPage: 1
    }
  }

  async componentDidMount() {
    this.requestIncomeSummary();
    await this.requestIncome();
    await this.requestIncomeCategory();
  }

  requestIncomeCategory = async () => {
    await axios.get(incomeApiEndpoints.incomeCategory, {})
    .then(response => {
      // console.log(response.data);
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

  requestIncome = async () => {
    await axios.get(incomeApiEndpoints.income + '?page=' + this.state.currentPage + '&sort_col=' + this.state.sortField + '&per_page=' + this.state.rowsPerPage + '&sort_order=' + (this.state.sortOrder > 0 ? 'asc' : 'desc'), {})
    .then(response => {
      // console.log(response.data);
      if (response.data.data) {
        this.setState(prevState => {
          return {
            income: response.data,
            incomeLoading: false,
          }
        });
      }
      else {
        this.setState(prevState => {
          return {
            incomeLoading: false,
          }
        });
      }
    })
    .catch(error => {
      console.log(error);
    });
  };

  requestIncomeSummary = async () => {
    await axios.get(incomeApiEndpoints.summary, {})
    .then(response => {
      // console.log(response.data);
      this.setState({incomeSummary: response.data.data});
    })
    .catch(error => {
      console.log(error);
    });
  };

  deleteIncome = (data) => {
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
      text: `Confirm to delete income from ${data.source}.`,
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
        axios.delete(incomeApiEndpoints.income + '/' + data.id, {})
        .then(response => {
          // console.log(response.data);
          if (response.status === 200) {

            this.requestIncome();
            this.requestIncomeSummary();

            this.messages.show({
              severity: 'success',
              detail: 'Your income from ' + data.source + ' deleted successfully.',
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

  submitIncome = (values, formikBag) => {
    axios.post(incomeApiEndpoints.income, JSON.stringify(values))
    .then(response => {
      // console.log(response.data);
      if (response.status === 201) {

        formikBag.resetForm();
        formikBag.setSubmitting(false);
        this.requestIncome();
        this.requestIncomeSummary();

        this.messages.show({
          severity: 'success',
          detail: 'Your income from ' + response.data.request.source + ' added.',
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

  renderIncomeSummary = (data) => {
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
        <div className="text-center">No income data found.</div>
        <hr/>
      </div>
    }
  };

  render() {
    // console.log(this.context.state);
    return (
      <div>
        <Head title="Income"/>

        <CurrencySidebar visible={this.state.visible} onHide={(e) => this.setState({visible: false})}/>

        <div className="p-grid p-nogutter">
          <div className="p-col-12">
            <div className="p-fluid">
              <Messages ref={(el) => this.messages = el}/>
            </div>
          </div>
        </div>

        <div className="p-grid p-nogutter">
          <div className="p-col-12">
            <div className="p-fluid">

              <div className="p-grid">
                <div className="p-col-6">
                  <div className="p-panel p-component">
                    <div className="p-panel-titlebar"><span className="color-title text-bold">Income This Month</span>
                    </div>
                    <div className="p-panel-content-wrapper p-panel-content-wrapper-expanded" id="pr_id_1_content"
                         aria-labelledby="pr_id_1_label" aria-hidden="false">
                      <div className="p-panel-content">
                        {this.renderIncomeSummary(this.state.incomeSummary.income_month)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-col-6">
                  <div className="p-panel p-component">
                    <div className="p-panel-titlebar"><span className="color-title text-bold">Income Today</span></div>
                    <div className="p-panel-content-wrapper p-panel-content-wrapper-expanded" id="pr_id_1_content"
                         aria-labelledby="pr_id_1_label" aria-hidden="false">
                      <div className="p-panel-content">
                        {this.renderIncomeSummary(this.state.incomeSummary.income_today)}
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
                <div className="p-card-title p-grid p-nogutter p-justify-between">Add Income</div>
                <div className="p-card-subtitle">Add your income information below.</div>
              </div>
              <br/>
              <Formik
                initialValues={{
                  income_date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                  source: '',
                  notes: '',
                  amount: ''
                }}
                validationSchema={
                  Yup.object().shape({
                    source: Yup.string().max(100, 'Income source must be at most 100 characters').required('Income source field is required'),
                    notes: Yup.string().max(200, 'Income notes must be at most 200 characters'),
                    amount: Yup.number().required('Income amount field is required'),
                  })
                }
                onSubmit={(values, formikBag) => {
                  values.currency_id = this.context.state.currentCurrency.id;
                  // console.log(values);
                  this.submitIncome(values, formikBag);
                }}
                render={props => (
                  <form onSubmit={props.handleSubmit}>
                    <div className="p-fluid">
                      <Calendar
                        name="income_date"
                        dateFormat="yy-mm-dd"
                        showTime={true}
                        hourFormat="12"
                        value={this.state.incomeDate}
                        onChange={(e) => {
                          console.log(e.value);
                          props.setFieldValue('income_date', dayjs(e.value).format('YYYY-MM-DD HH:mm:ss'));
                          this.setState({incomeDate: e.value});
                        }}
                        maxDate={new Date()}
                        touchUI={window.innerWidth < 768}
                      />
                      <p className="text-error">{props.errors.income_date}</p>
                    </div>
                    <div className="p-fluid">
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
                        placeholder="Income Category"
                        optionLabel="category_name"
                      />
                      <p className="text-error">{props.errors.category_id}</p>
                    </div>
                    <div className="p-fluid">
                      <InputText placeholder="Income Source" name="source" value={props.values.source}
                                 onChange={props.handleChange}/>
                      <p className="text-error">{props.errors.source}</p>
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
                      <InputTextarea rows={5} autoResize={true} placeholder="Income Notes" name="notes" value={props.values.notes}
                                 onChange={props.handleChange}/>
                      <p className="text-error">{props.errors.notes}</p>
                    </div>
                    <div className="p-fluid">
                      <Button disabled={props.isSubmitting} type="submit" label="Add Income" icon="pi pi-plus"
                              className="p-button-raised"/>
                    </div>
                  </form>
                )}/>
            </Card>
          </div>

          <div className="p-col-12 p-md-6">
            <Card className="rounded-border">
              <div>
                <div className="p-card-title p-grid p-nogutter p-justify-between">View Incomes</div>
                <div className="p-card-subtitle">Here are few incomes you've added.</div>
              </div>
              <br/>
              {
                this.state.incomeLoading ? (
                  <div className="p-grid p-justify-center p-align-center">
                    <ProgressSpinner style={{height: '25px'}} strokeWidth={'4'}/>
                  </div>
                ) : (
                  <DataTable value={this.state.income.data}
                             sortField={this.state.sortField}
                             sortOrder={this.state.sortOrder}
                             responsive={true}
                             paginator={true}
                             rows={this.state.rowsPerPage}
                             rowsPerPageOptions={[5, 10, 20]}
                             totalRecords={this.state.income.total}
                             lazy={true}
                    // loading={this.state.incomeLoading}
                    // loadingIcon={'pi pi-save'}
                             first={this.state.income.from - 1}
                             onPage={(e) => {
                               console.log(e);
                               this.setState({
                                 currentPage: (e.page + 1),
                                 rowsPerPage: e.rows,
                                 incomeLoading: true
                               }, () => {
                                 this.requestIncome();
                               });
                             }}
                             onSort={e => {
                               console.log(e);
                               this.setState({
                                 sortField: e.sortField,
                                 sortOrder: e.sortOrder,
                                 incomeLoading: true
                               }, () => {
                                 this.requestIncome();
                               });

                             }}
                             className="text-center"
                  >
                    <Column field="id" header="Serial" sortable={true}/>
                    <Column field="source" header="Source" sortable={true}/>
                    <Column field="amount" header="Amount" sortable={true}
                            body={(rowData, column) => {
                              return rowData.amount.toLocaleString() + ' ' + rowData.currency_name
                            }}
                    />
                    <Column field="income_date" header="Date" sortable={true}
                            body={(rowData, column) => {
                              return dayjs(rowData.income_date).format('YYYY-MM-DD hh:mm a')
                            }}
                    />
                    <Column
                      body={(rowData, column) => {
                        // console.log(rowData);
                        return (
                          <div>
                            <Link to={`/income/${rowData.id}/edit`}>
                              <Button label="Edit" value={rowData.id}
                                      icon="pi pi-pencil"
                                      className="p-button-raised p-button-rounded p-button-info"/>
                            </Link>
                            <Button label="Delete"
                                    onClick={() => this.deleteIncome(rowData)}
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

export default Income;
