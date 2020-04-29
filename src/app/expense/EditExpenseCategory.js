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

class EditExpenseCategory extends React.Component {

  static contextType = AppContext;

  constructor() {
    super();
    this.state = {
      expenseCategory: {
        id: '',
        category_name: '',
        created_at: '',
        created_by: '',
        updated_at: '',
        updated_by: '',
      }
    }
  }

  async componentDidMount() {
    await this.requestExpenseCategory();
  }

  requestExpenseCategory = async () => {
    await axios.get(expenseApiEndpoints.expenseCategory + '/' + this.props.match.params.category_id, {})
    .then(response => {
      // console.log(response.data);
      this.setState({
        expenseCategory: response.data,
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

  submitUpdateExpenseCategory = (values, formikBag) => {
    axios.put(expenseApiEndpoints.expenseCategory + '/' + this.state.expenseCategory.id, JSON.stringify(values))
    .then(response => {
      console.log('success');
      console.log(response.data.request);

      if (response.status === 200) {

        formikBag.setSubmitting(false);
        formikBag.setValues(response.data.request);

        this.messages.show({
          severity: 'success',
          detail: 'Your expense category info updated successfully.',
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
                <div className="p-card-title p-grid p-nogutter p-justify-between">Edit Expense Category</div>
                <div className="p-card-subtitle">Edit selected expense category information below.</div>
              </div>
              <br/>
              <Formik
                enableReinitialize={true}
                initialValues={this.state.expenseCategory}
                validationSchema={
                  Yup.object().shape({
                    category_name: Yup.string().max(100, 'Category name must be at most 100 characters').required('Category name field is required')
                  })
                }
                onSubmit={(values, formikBag) => {
                  // console.log(values);
                  this.submitUpdateExpenseCategory(values, formikBag);
                }}
                render={props => (
                  <form onSubmit={props.handleSubmit}>
                    <div className="p-fluid">
                      <label>Category Name</label>
                      <div className="p-fluid">
                        <InputText placeholder="Category name" name="category_name" value={props.values.category_name}
                                   onChange={props.handleChange}/>
                        <p className="text-error">{props.errors.category_name}</p>
                      </div>
                      <p className="text-error">{props.errors.expense_date}</p>
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

export default EditExpenseCategory;
