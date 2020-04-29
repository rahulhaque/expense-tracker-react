import React, {Component} from 'react';
import {Card} from "primereact/components/card/Card";
import * as dayjs from "dayjs";

class ExpenseListItem extends Component {
  render() {
    const itemDetail = this.props.itemDetail;
    return (
      <Card>
        <div>
          <div className="" style={{display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 16}}>{itemDetail.spent_on}<div className="color-title">{itemDetail.amount.toLocaleString()} {itemDetail.currency_code}.</div></div>
          <div className="color-link" style={{fontSize: 12}}>{itemDetail.category_name}</div>
          <div className="color-title" style={{fontSize: 12}}>{dayjs(itemDetail.expense_date).format('YYYY-MM-DD hh:mma')}</div>
        </div>
      </Card>
    );
  }
}

export default ExpenseListItem;