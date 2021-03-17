/* globals React */
/* eslint "react/jsx-no-undef": "off" */

import IssueFilter from './IssueFilter.jsx';
import IssueTable from './IssueTable.jsx';
import IssueAdd from './IssueAdd.jsx';
import graphQLFetch from './graphQLFetch';

export default class IssueList extends React.Component {
  constructor() {
    super();
    this.state = { issues: [] };
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

  componentDidMount() {
    this.loadData();
  }

  // fetch the issues list by calling api and setting the state which will display the list
  async loadData() {
    // query to fetch issue list
    const query = `query {
            issueList {
                id title status owner
                created effort due
            }
        }`;

    const data = await graphQLFetch(query);
    if (data) {
      this.setState({ issues: data.issueList });
    }
  }

  render() {
    return (
      <React.Fragment>
        <h1>Issue Tracker</h1>
        <IssueFilter />
        <hr />
        <IssueTable issues={this.state.issues} />
        <hr />
        {/* bind IssueList as this to createIssue method */}
        <IssueAdd createIssue={this.createIssue.bind(this)} />
      </React.Fragment>
    );
  }
}
