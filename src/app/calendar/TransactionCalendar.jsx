import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';

import { Messages } from 'primereact/messages';
import { Card } from 'primereact/card';
import { FullCalendar } from 'primereact/fullcalendar';
import { ProgressSpinner } from 'primereact/progressspinner';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

import { reportApiEndpoints } from './../../API';
import axios from './../../Axios';



let messages;

const options = {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
  defaultView: 'dayGridMonth',
  themeSystem: 'standard',
  height: 'auto',
  titleFormat: { year: 'numeric', month: 'long' },
  buttonText: {
    today: 'Today',
    month: 'Month',
    week: 'Week',
    day: 'Day',
    list: 'List'
  },
  header: {
    left: 'dayGridMonth,listWeek', // timeGridWeek,timeGridDay
    center: 'title',
    right: 'today,prev,next' // prevYear,nextYear
  },
  editable: false,
  dateClick: (info) => {
    console.log('Clicked on: ' + info.dateStr);
    console.log('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
    console.log('Current view: ' + info.view.type);
  },
  eventClick: (info) => {
    console.log(info.event);
  },
};

const TransactionCalendar = (props) => {

  const [fetching, setFetching] = useState(true);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (events.length == 0) {
      requestTransaction();
    }
  });

  const requestTransaction = () => {
    axios.get(reportApiEndpoints.transaction, {})
      .then(response => {
        // console.log(response.data);
        if (response.data.transactions.length > 0) {
          setEvents({
            events: response.data.transactions.map(item => {
              return item.transaction_type === 'Income' ? {
                id: item.formatted_date,
                title: `(+) ${item.total} ${item.currency_name}`,
                date: item.formatted_date,
                backgroundColor: '#4caf50',
                borderColor: '#3c9c40',
              } :
                {
                  id: item.formatted_date,
                  title: `(-) ${item.total} ${item.currency_name}`,
                  date: item.formatted_date,
                  backgroundColor: '#f47036',
                  borderColor: '#f45b36'
                }
            })
          });
          setFetching(false);
        } else {

        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <div>
      <Helmet title="Calendar" />

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
                <div className="p-card-title p-grid p-nogutter p-justify-between">Transactions +/-</div>
                <div className="p-card-subtitle">Detail of your daily incomes and expenses.</div>
              </div>
              <div className="p-col-6" align="right">
                {fetching ? <ProgressSpinner style={{ height: '25px', width: '25px' }} strokeWidth={'4'} /> : ''}
              </div>
            </div>
            <br />
            <div>
              <FullCalendar events={events} options={options} />
            </div>
          </Card>
        </div>

      </div>
    </div>

  )
}

export default React.memo(TransactionCalendar);
