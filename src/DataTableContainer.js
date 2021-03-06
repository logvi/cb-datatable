// @flow
import React, {Component} from 'react';
import Table from './Table';
import Pager from './Pager';
import Loader from './Loader';
import {orderBy} from './utils';
import classNames from 'classnames';
import type {DataTableContainerProps, DataTableContainerState, TableProps, DataType} from './types';

class DataTableContainer extends Component<DataTableContainerProps,DataTableContainerState>  {
  props: DataTableContainerProps;
  data: DataType;
  state: DataTableContainerState;

  static defaultProps: Object = {
    TableComponent: props => (
      <div className="cb-datatable__table">
        <Table {...props}/>
      </div>
    ),
    PagerComponent: Pager,
    Loader: <Loader />,
    orderBy: {},
    rowsPerPage: 20
  };

  constructor(props: DataTableContainerProps) {
    super(props);

    const pagerState = props.PagerComponent ? {
      currentPage: 1
    } : {};

    this.state = {
      data: [],
      orderBy: props.orderBy,
      ...pagerState
    };

    if (props.orderBy) {
      this.data = orderBy(props.data, props.orderBy);
    } else {
      this.data = props.data;
    }
  }

  componentWillReceiveProps(nextProps: DataTableContainerProps) {
    this.data = this.setTableData(nextProps.data);
  }

  get displayData(): Array<Object> {
    if (this.props.PagerComponent) {
      let rowsPerPage = this.props.rowsPerPage,
      indexStart = (+this.state.currentPage - 1) * rowsPerPage;
      return this.data.slice(indexStart, indexStart + rowsPerPage);
    }
    return this.data;
  }

  get tableProps(): TableProps {
    return {
      data: this.props.data,
      columns: this.props.columns,
      orderBy: this.state.orderBy,
      displayData: this.displayData,
      setOrderBy: this.setOrderBy,
      loading: this.props.loading,
      Loader: this.props.Loader,
      onRowClick: this.props.onRowClick,
      BodyRowRenderer: this.props.BodyRowRenderer,
      children: this.props.children,
      key: 'table'
    };
  }

  get Table(): React$Element<*> {
    return React.createElement(
      this.props.TableComponent,
      this.tableProps,
    )
  }

  get Pager(): ?React$Element<*> {
    if (!this.props.PagerComponent) return;
    return React.createElement(
      this.props.PagerComponent,
      {
        data: this.data,
        rowsPerPage: this.props.rowsPerPage,
        setCurrentPage: this.setCurrentPage,
        currentPage: this.state.currentPage,
        key: 'pager'
      }
    )
  }

  /**
   * For changing data array with applying ordering, filter, etc.
   * Using when data is changed from props
   * @param data
     */
  setTableData(data: DataType): DataType {
      return orderBy(data, this.state.orderBy);
  }

  /**
   * Using when the sortable header column is clicked
   * @param type
   */
  setOrderBy = (type: Object) => {
    if (this.props.onSort) {
      this.props.onSort(type);
      return;
    }
    this.data = orderBy(this.data, type);
    this.setState({orderBy: type});
  };

  /**
   *
   * @param page
   */
  setCurrentPage = (page: number) => {
    if (this.state.page !== page) {
      this.setState({
        currentPage: page
      });
    }
  };

  renderLayout(Table: React$Element<*>, Pager: ?React$Element<*>) {
    return Pager ? [Table, Pager] :  Table;
  }

  render() {
    return (
      <div className={classNames('cb-datatable', this.props.className)} onClick={this.props.onClick}>
        {(this.props.renderLayout && this.props.renderLayout(this.Table, this.Pager))
        || this.renderLayout(this.Table, this.Pager)}
      </div>
    )
  }
}

export default DataTableContainer;
