/* eslint "react/prefer-stateless-function": "off" */

import React from 'react';
import { withRouter } from 'react-router-dom';

/**
 * IssueFilter component shows options to filter issues
 */
class IssueFilter extends React.Component {
  constructor({ location: { search } }) {
    super();
    const params = new URLSearchParams(search);
    this.state = {
      status: params.get('status') || '',
      changed: false,
    };
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
  }

  componentDidUpdate(prevProps) {
    const prevSearch = prevProps.location.search;
    const search = this.props.location.search;
    if (prevSearch !== search) {
      this.showOriginalFilter();
    }
  }

  onChangeStatus(e) {
    this.setState({ status: e.target.value, changed: true });
  }

  showOriginalFilter() {
    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    this.setState({
      status: params.get('status') || '',
      changed: false,
    });
  }

  applyFilter() {
    const status = this.state.status;
    const history = this.props.history;
    history.push({
      location: '/isseus',
      search: status ? `?status=${status}` : '',
    });
  }

  render() {
    const { status, changed } = this.state;
    // const {
    //   location: { search },
    // } = this.props;
    // const params = new URLSearchParams(search);
    return (
      <div>
        Status:{' '}
        <select value={status} onChange={this.onChangeStatus}>
          <option value="">(All)</option>
          <option value="New">New</option>
          <option value="Assigned">Assigned</option>
          <option value="Fixed">Fixed</option>
          <option value="Closed">Closed</option>
        </select>{' '}
        <button type="button" onClick={this.applyFilter}>
          Apply
        </button>
        <button
          type="button"
          onClick={this.showOriginalFilter}
          disabled={!changed}
        >
          Reset
        </button>
      </div>
    );
  }
}

export default withRouter(IssueFilter);
