import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import * as yup from 'yup';
import { Link } from "react-router-dom";
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

import { Messages } from 'primereact/messages';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Column } from 'primereact/column';

import { expenseApiEndpoints } from './../../API';
import axios from './../../Axios';

let messages;

const expenseCategoryValidationSchema = yup.object().shape({
  category_name: yup.string().required('Category name field is required').max(100, 'Category name must be at most 100 characters'),
});

const ExpenseCategory = (props) => {

  const { register, handleSubmit, reset, errors, setError } = useForm({
    validationSchema: expenseCategoryValidationSchema
  });
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState(-1);
  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    requestExpenseCategories();
  }, [sortOrder, sortField]);

  const requestExpenseCategories = async (rows = 5, page = 1) => {
    // console.log(sortOrder);
    await axios.get(expenseApiEndpoints.expenseCategory + '?page=' + page + '&per_page=' + rows + '&sort_col=' + sortField + '&sort_order=' + (sortOrder === 1 ? 'asc' : 'desc'), {})
      .then(response => {
        // console.log(response.data);
        if (response.data.data) {
          setExpenseCategories(response.data);
          setFetching(false);
        }
        else {

        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const deleteExpenseCategory = (data) => {
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
      text: `Confirm to delete expense category ${data.category_name}.`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: '<span class="pi pi-trash p-button-icon-left"></span><span class="p-button-text">Delete</span>',
      cancelButtonText: '<span class="pi pi-ban p-button-icon-left"></span><span class="p-button-text">No</span>',
      // confirmButtonColor: '#f76452',
      // cancelButtonColor: '#3085d6',
      focusConfirm: false,
      focusCancel: true
    }).then((result) => {
      if (result.value) {
        axios.delete(expenseApiEndpoints.expenseCategory + '/' + data.id, {})
          .then(response => {
            // console.log(response.data);
            if (response.status === 200) {

              requestExpenseCategories();

              messages.show({
                severity: 'success',
                detail: 'Your expense category ' + data.category_name + ' deleted successfully.',
                sticky: false,
                closable: false,
                life: 5000
              });
            }

          })
          .catch(error => {
            // console.log('error');
            // console.log(error.response);
            if (error.response.status === 409) {
              messages.clear();
              messages.show({
                severity: 'error',
                detail: 'Expense category ' + data.category_name + ' in use.',
                sticky: true,
                closable: true,
                life: 5000
              });
            }

            if (error.response.status === 401) {
              messages.clear();
              messages.show({
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

  const submitExpenseCategory = (data) => {
    axios.post(expenseApiEndpoints.expenseCategory, JSON.stringify(data))
      .then(response => {
        // console.log('success', response.data);

        if (response.status === 201) {

          reset();
          setSubmitting(false);
          requestExpenseCategories();

          messages.show({
            severity: 'success',
            detail: 'New expense category ' + response.data.request.category_name + ' added.',
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
          messages.clear();
          messages.show({
            severity: 'error',
            detail: 'Something went wrong. Try again.',
            sticky: true,
            closable: true,
            life: 5000
          });
        }

        if (error.response.status === 422) {
          let errors = Object.entries(error.response.data).map(([key, value]) => {
            return { name: key, message: value[0] }
          });
          setError(errors);
        }

        setSubmitting(false)
      })
  };

  return (
    <div>
      <Helmet title="Expense Category" />

      <div className="p-grid p-nogutter">
        <div className="p-col-12">
          <div className="p-fluid">
            <Messages ref={(el) => messages = el} />
          </div>
        </div>
      </div>

      <div className="p-grid">

        <div className="p-col-12 p-md-6">
          <Card className="rounded-border">
            <div>
              <div className="p-card-title p-grid p-nogutter p-justify-between">Add Expense Category</div>
              <div className="p-card-subtitle">Enter expense category name below.</div>
            </div>
            <br />
            <form onSubmit={handleSubmit(submitExpenseCategory)}>
              <div className="p-fluid">
                <input type="text" ref={register} placeholder="Category name" name="category_name" className="p-inputtext p-component p-filled" />
                <p className="text-error">{errors.category_name?.message}</p>
              </div>
              <div className="p-fluid">
                <Button disabled={submitting} type="submit" label="Add Category" icon="pi pi-plus"
                  className="p-button-raised" />
              </div>
            </form>
          </Card>
        </div>

        <div className="p-col-12 p-md-6">
          <Card className="rounded-border">
            <div>
              <div className="p-card-title p-grid p-nogutter p-justify-between">View Expenses Categories</div>
              <div className="p-card-subtitle">Here are list of expense categories.</div>
            </div>
            <br />
            {
              fetching ? (
                <div className="p-grid p-justify-center p-align-center">
                  <ProgressSpinner style={{ height: '25px' }} strokeWidth={'4'} />
                </div>
              ) : (
                  <DataTable value={expenseCategories.data}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    responsive={true}
                    paginator={true}
                    rows={rowsPerPage}
                    rowsPerPageOptions={[5, 10, 20]}
                    totalRecords={expenseCategories.total}
                    lazy={true}
                    first={expenseCategories.from - 1}
                    onPage={(e) => {
                      console.log(e);
                      setRowsPerPage(e.rows);
                      requestExpenseCategories(e.rows, (e.page + 1))
                    }}
                    onSort={e => {
                      // console.log(e);
                      setSortField(e.sortField);
                      setSortOrder(e.sortOrder);
                    }}
                    className="text-center"
                  >
                    <Column field="id" header="Serial" sortable={true} />
                    <Column field="category_name" header="Category Name" sortable={true} />
                    <Column
                      body={(rowData, column) => {
                        // console.log(rowData);
                        return (
                          <div>
                            <Link to={`/expense/category/${rowData.id}/edit`}><Button label="Edit"
                              value={rowData.id}
                              icon="pi pi-pencil"
                              className="p-button-raised p-button-rounded p-button-info" /></Link>
                            <Button label="Delete"
                              onClick={() => deleteExpenseCategory(rowData)}
                              icon="pi pi-trash"
                              className="p-button-raised p-button-rounded p-button-danger" />
                          </div>
                        )
                      }}
                      header="Action"
                      style={{ textAlign: 'center', width: '8em' }}
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

export default React.memo(ExpenseCategory);
