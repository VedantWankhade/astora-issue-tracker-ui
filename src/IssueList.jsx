import React from 'react';
import { Route } from 'react-router-dom';
import IssueFilter from './IssueFilter.jsx';
import IssueTable from './IssueTable.jsx';
import IssueAdd from './IssueAdd.jsx';
import IssueDetail from './IssueDetail.jsx';
import graphQLFetch from './graphQLFetch.js';

export default class IssueList extends React.Component {
  constructor() {
    super();
    this.state = { issues: [] };
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    const {
      location: { search: prevSearch },
    } = prevProps;
    const {
      location: { search },
    } = this.props;
    if (prevSearch !== search) {
      this.loadData();
    }
  }

  // add issue to the issuesDB by calling api and then reload the IssueList
  async createIssue(issue) {
    // query to add issue using graphQL variable
    const query = `mutation issueAdd($issue: IssueInputs!) {
                            issueAdd(issue: $issue) {
                                id
                            }
                        }`;

    const data = await graphQLFetch(query, { issue });
    if (data) {
      this.loadData();
    }
  }

  // fetch the issues list by calling api and setting the state which will display the list
  async loadData() {
    const {
      location: { search },
    } = this.props;
    const params = new URLSearchParams(search);
    const vars = {};
    if (params.get('status')) vars.status = params.get('status');

    const effortMin = parseInt(params.get('effortMin'), 10);
    if (!Number.isNaN(effortMin)) vars.effortMin = effortMin;

    const effortMax = parseInt(params.get('effortMax'), 10);
    if (!Number.isNaN(effortMax)) vars.effortMax = effortMax;

    // query to fetch issue list
    const query = `query issueList(
        $status: StatusType
        $effortMin: Int
        $effortMax: Int
      ) {
            issueList(
                  status: $status
                  effortMin: $effortMin
                  effortMax: $effortMax
                ) {
                id title status owner
                created effort due
            }
        }`;

    const data = await graphQLFetch(query, vars);
    if (data) {
      this.setState({ issues: data.issueList });
    }
  }

  render() {
    // const { issue } = this.state;
    const { match } = this.props;

    return (
      <React.Fragment>
        <h1>Issue Tracker</h1>
        <IssueFilter />
        <hr />
        <IssueTable issues={this.state.issues} />
        <hr />
        {/* bind IssueList as this to createIssue method */}
        <IssueAdd createIssue={this.createIssue.bind(this)} />
        <hr />
        <Route path={`${match.path}/:id`} component={IssueDetail} />
      </React.Fragment>
    );
  }
}
