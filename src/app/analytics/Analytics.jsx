import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';

import { Messages } from 'primereact/messages';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { ProgressSpinner } from 'primereact/progressspinner';

import ExpenseListItem from './../expense/ExpenseListItem';

import { analyticsApiEndpoints } from './../../API';
import axios from './../../Axios';

let messages;

const Analytics = (props) => {

  const [chartData, setChartData] = useState({
    barChartData: {},
    barChartDataOptions: {},
    barChartDataLoading: true
  });

  useEffect(() => {
    requestChartData();
  }, []);

  const requestChartData = () => {
    axios.get(analyticsApiEndpoints.analyticsYear, {})
      .then(response => {
        // console.log(response.data);
        setChartData({ ...chartData, barChartData: response.data.data.barChartData, barChartDataOptions: response.data.data.options, barChartDataLoading: false });
      })
      .catch(error => {
        // console.log(error);
        setChartData({ ...chartData, barChartDataLoading: false });
      });
  };

  return (
    <div>
      <Helmet title="Analytics" />

      <div className="p-grid p-nogutter">
        <div className="p-col-12">
          <div className="p-fluid">
            <Messages ref={(el) => messages = el} />
          </div>
        </div>
      </div>

      <div className="p-grid">

        <div className="p-col-12">
          <Card className="rounded-border">
            <div className='p-grid'>
              <div className='p-col-6'>
                <div className="p-card-title p-grid p-nogutter p-justify-between">Monthly Income & Expense Chart</div>
                <div className="p-card-subtitle">Glimpse of your incomes and expenses for a year.</div>
              </div>
              <div className="p-col-6" align="right">
                {chartData.barChartDataLoading ? <ProgressSpinner style={{ height: '25px', width: '25px' }} strokeWidth={'4'} /> : ''}
              </div>
            </div>
            <br />
            <div>
              <Chart type="bar" data={chartData.barChartData} options={chartData.barChartDataOptions} />
            </div>
          </Card>
        </div>

      </div>
    </div>

  )
}

export default React.memo(Analytics);
