import React from 'react';

import * as Yup from "yup";
import Head from "../../layout/Head";
import {Messages} from "primereact/components/messages/Messages";
import {Card} from "primereact/components/card/Card";
import {Formik} from "formik";
import {InputText} from "primereact/components/inputtext/InputText";
import {Button} from "primereact/components/button/Button";
import {Dropdown} from "primereact/dropdown";
import {userApiEndpoints, currencyApiEndpoints} from "../../api/config";
import axios from "../../request/axios";
import {getItem, saveItem} from "../../helper";
import {AppContext} from "../../context/ContextProvider";

class EditProfile extends React.Component {

  static contextType = AppContext;

  constructor() {
    super();
    this.state = {
      user: {
        id: '',
        name: '',
        email: '',
        currency_id: ''
      }
    }
  }

  async componentDidMount() {
    await this.requestCurrencies();
    await this.requestProfileInfo();
  }

  requestCurrencies = () => {
    axios.get(currencyApiEndpoints.currency, {})
    .then(response => {
      // console.log(response.data);
      if (response.data.data.length > 0) {
        this.setState({currencies: response.data.data});
      }
    })
    .catch(error => {
      console.log(error);
    });
  };

  currencyTemplate = (option) => {
    return (<span><span className="color-highlight text-bold">{option.currency_code}</span> - {option.currency_name}</span>);
  };

  requestProfileInfo = () => {
    axios.get(userApiEndpoints.self, {})
    .then(response => {
      // console.log(response.data);

      this.setState({
        user: response.data,
        currency: response.data.currency
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

  submitUpdateProfile = (values, formikBag) => {
    axios.put(userApiEndpoints.profile, JSON.stringify(values))
    .then(response => {
      // console.log('success');
      // console.log(response.data.request);

      if (response.status === 200) {

        formikBag.setSubmitting(false);
        formikBag.setValues(response.data.request);

        let {currency, ...rest} = response.data.request;
        saveItem('user', rest);
        this.context.userUpdated(rest);

        this.messages.show({
          severity: 'success',
          detail: 'Your profile info updated successfully. Log back again to see the changes.',
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
        <Head title="Edit Profile"/>

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
                <div className="p-card-title p-grid p-nogutter p-justify-between">Edit Profile</div>
                <div className="p-card-subtitle">Edit current profile information below.</div>
              </div>
              <br/>
              <Formik
                enableReinitialize={true}
                initialValues={this.state.user}
                validationSchema={
                  Yup.object().shape({
                    name: Yup.string().min(4, 'Name must be at most 4 character').required('Name field is required'),
                    email: Yup.string().min(6, 'Email must be at most 6 character').required('Email field is required'),
                    currency_id: Yup.number().required('Currency field is required'),
                  })
                }
                onSubmit={(values, formikBag) => {
                  // console.log(values);
                  this.submitUpdateProfile(values, formikBag);
                }}
                render={props => (
                  <form onSubmit={props.handleSubmit}>
                    <div className="p-fluid">
                      <label htmlFor="name">Name</label>
                      <InputText name="name" value={props.values.name}
                                 onChange={props.handleChange}/>
                      <p className="text-error">{props.errors.name}</p>
                    </div>
                    <div className="p-fluid">
                      <label htmlFor="email">Email</label>
                      <InputText name="email" value={props.values.email}
                                 onChange={props.handleChange}/>
                      <p className="text-error">{props.errors.email}</p>
                    </div>
                    <div className="p-fluid">
                      <label>Currency</label>
                      <Dropdown
                        name="currency_id"
                        filter={true}
                        filterBy="currency_code,currency_name"
                        filterPlaceholder="Search here"
                        showClear={true}
                        value={this.state.currency}
                        options={this.state.currencies}
                        style={{width: '100%'}}
                        onChange={e => {
                          props.setFieldValue('currency_id', e.value.id);
                          this.setState({
                            currency: e.value,
                          });
                        }}
                        itemTemplate={this.currencyTemplate}
                        placeholder="Select a currency"
                        optionLabel="currency_code"
                      />
                      <p className="text-error">{props.errors.currency_id}</p>
                    </div>
                    <div className="p-fluid">
                      <Button disabled={props.isSubmitting} type="submit" label="Update Profile" icon="pi pi-refresh"
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

export default EditProfile;
