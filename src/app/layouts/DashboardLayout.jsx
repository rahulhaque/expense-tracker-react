import React from 'react'
import classNames from 'classnames';
import { AppTopbar } from './../dashboard/AppTopbar';
import { ScrollPanel } from "primereact/components/scrollpanel/ScrollPanel";
import { AppInlineProfile } from "./../dashboard/AppInlineProfile";
import { AppMenu } from "./../dashboard/AppMenu";
import AppFooter from './../dashboard/AppFooter';
import { logout } from "./../request/axios";
import { Route, Switch } from "react-router-dom";
import { PrivateRoute } from "../routes/Web";
import { AppContext } from "../context/ContextProvider";

// import Dashboard from "../app/dashboard/Dashboard";
// import ExpenseCategory from "../app/expense/ExpenseCategory";
// import Setting from "../app/setting/Setting";
// import Expense from "../app/expense/Expense";
// import EditExpense from "../app/expense/EditExpense";
// import Income from "../app/income/Income";
// import EditIncome from "../app/income/EditIncome";
// import Profile from "../app/profile/Profile";
// import EditProfile from "../app/profile/EditProfile";
// import EditExpenseCategory from "../app/expense/EditExpenseCategory";
// import IncomeCategory from "../app/income/IncomeCategory";
// import EditIncomeCategory from "../app/income/EditIncomeCategory";
// import TransactionCalendar from "../app/calendar/TransactionCalendar";
// import PageNotFound from "../app/error/404";

class DashboardLayout extends React.Component {

  static contextType = AppContext;

  constructor() {
    super();
    this.state = {
      staticMenuInactive: false,
      overlayMenuActive: false,
      mobileMenuActive: false
    };

    this.onWrapperClick = this.onWrapperClick.bind(this);
    this.onToggleMenu = this.onToggleMenu.bind(this);
    this.onSidebarClick = this.onSidebarClick.bind(this);
    this.onMenuItemClick = this.onMenuItemClick.bind(this);
    this.createMenu();
  }

  onWrapperClick(event) {
    if (!this.menuClick) {
      this.setState({
        overlayMenuActive: false,
        mobileMenuActive: false
      });
    }

    this.menuClick = false;
  }

  onToggleMenu(event) {
    this.menuClick = true;

    if (this.isDesktop()) {
      if (this.context.state.layoutMode === 'overlay') {
        this.setState({
          overlayMenuActive: !this.state.overlayMenuActive
        });
      }
      else if (this.context.state.layoutMode === 'static') {
        this.setState({
          staticMenuInactive: !this.state.staticMenuInactive
        });
      }
    }
    else {
      const mobileMenuActive = this.state.mobileMenuActive;
      this.setState({
        mobileMenuActive: !mobileMenuActive
      });
    }

    event.preventDefault();
  }

  onSidebarClick(event) {
    this.menuClick = true;
    this.layoutMenuScroller.moveBar();
  }

  onMenuItemClick(event) {
    if (!event.item.items) {
      this.setState({
        overlayMenuActive: false,
        mobileMenuActive: false
      })
    }
  }

  createMenu = () => {
    this.menu = [
      { label: 'Dashboard', url: '/dashboard', icon: 'pi pi-fw pi-home', command: () => { } },
      {
        label: 'Expense', url: '', icon: 'pi pi-fw pi-dollar',
        items: [
          { label: 'Manage', url: '/expense', icon: 'pi pi-fw pi-plus', command: () => { } },
          { label: 'Category', url: '/expense/category', icon: 'pi pi-fw pi-list', command: () => { } },
        ]
      },
      {
        label: 'Income', url: '', icon: 'pi pi-fw pi-money-bill',
        items: [
          { label: 'Manage', url: '/income', icon: 'pi pi-fw pi-plus', command: () => { } },
          { label: 'Category', url: '/income/category', icon: 'pi pi-fw pi-list', command: () => { } },
        ]
      },
      { label: 'Calendar', url: '/calendar', icon: 'pi pi-fw pi-calendar', command: () => { } },
      { label: 'Settings', url: '/setting', icon: 'pi pi-fw pi-cog', command: () => { } },
      { label: 'Profile', url: '/profile', icon: 'pi pi-fw pi-user', command: () => { } },
      { label: 'Logout', url: '', icon: 'pi pi-fw pi-power-off', command: () => logout() },
    ];
  };

  addClass = (element, className) => {
    if (element.classList)
      element.classList.add(className);
    else
      element.className += ' ' + className;
  };

  removeClass = (element, className) => {
    if (element.classList)
      element.classList.remove(className);
    else
      element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  };

  isDesktop = () => {
    return window.innerWidth > 1024;
  };

  componentDidUpdate() {
    if (this.state.mobileMenuActive)
      this.addClass(document.body, 'body-overflow-hidden');
    else
      this.removeClass(document.body, 'body-overflow-hidden');
  }

  render() {
    // console.log('DashboardLayout rendered');

    let logo = this.context.state.layoutColorMode === 'dark' ? '/assets/layout/images/dollar-logo.png' : '/assets/layout/images/dollar-logo.png';
    let wrapperClass = classNames('layout-wrapper', {
      'layout-overlay': this.context.state.layoutMode === 'overlay',
      'layout-static': this.context.state.layoutMode === 'static',
      'layout-static-sidebar-inactive': this.state.staticMenuInactive && this.context.state.layoutMode === 'static',
      'layout-overlay-sidebar-active': this.state.overlayMenuActive && this.context.state.layoutMode === 'overlay',
      'layout-mobile-sidebar-active': this.state.mobileMenuActive
    });
    let sidebarClassName = classNames("layout-sidebar", { 'layout-sidebar-dark': this.context.state.layoutColorMode === 'dark' });

    return (
      <div className={wrapperClass} onClick={this.onWrapperClick}>
        <AppTopbar onToggleMenu={this.onToggleMenu} />

        <div ref={(el) => this.sidebar = el} className={sidebarClassName} onClick={this.onSidebarClick}>
          <ScrollPanel ref={(el) => this.layoutMenuScroller = el} style={{ height: '100%' }}>
            <div className="layout-sidebar-scroll-content">
              <div className="layout-logo">
                <img alt="Logo" src={logo} style={{ height: '80px' }} />
              </div>
              <AppInlineProfile />
              <AppMenu model={this.menu} onMenuItemClick={this.onMenuItemClick} />
            </div>
          </ScrollPanel>
        </div>
        <div className="layout-main" style={{ minHeight: '95vh' }}>
          <Switch>
            {/* <PrivateRoute exact strict path={'/dashboard'} component={Dashboard} />
            <PrivateRoute exact strict path={'/expense'} component={Expense} />
            <PrivateRoute exact strict path={'/expense/:expense_id/edit'} component={EditExpense} />
            <PrivateRoute exact strict path={'/income'} component={Income} />
            <PrivateRoute exact strict path={'/income/:income_id/edit'} component={EditIncome} />
            <PrivateRoute exact strict path={'/expense/category'} component={ExpenseCategory} />
            <PrivateRoute exact strict path={'/expense/category/:category_id/edit'} component={EditExpenseCategory} />
            <PrivateRoute exact strict path={'/income/category'} component={IncomeCategory} />
            <PrivateRoute exact strict path={'/income/category/:category_id/edit'} component={EditIncomeCategory} />
            <PrivateRoute exact strict path={'/calendar'} component={TransactionCalendar} />
            <PrivateRoute exact strict path={'/setting'} component={Setting} />
            <PrivateRoute exact strict path={'/profile'} component={Profile} />
            <PrivateRoute exact strict path={'/profile/edit'} component={EditProfile} />
            <Route render={props => <PageNotFound {...props} />} /> */}
          </Switch>
        </div>
        <AppFooter />
        <div className="layout-mask" />
      </div>
    )
  }
}

export default DashboardLayout;
