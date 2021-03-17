/* eslint "react/react-in-jsx-scope": "off" */
/* globals React ReactDOM */
/* eslint "react/jsx-no-undef": "off" */
/* eslint "no-alert": "off" */

/* globals React ReactDOM PropTypes */

import graphQLFetch from './graphQLFetch';

/**
 * IssueFilter component shows options to filter issues
 */
class IssueFilter extends React.Component {
  render() {
    return <div>ISSUE_FILTER</div>;
  }
}

function IssueRow(props) {
  // issue object passed as props from IssueTable
  const issue = props.issue;

  return (
    <tr>
      <td>{issue.id}</td>
      <td>{issue.owner}</td>
      <td>{issue.status}</td>
      <td>{issue.title}</td>
      <td>{issue.created.toDateString()}</td>
      {/* if due date is present then convert to string else return empty string */}
      <td>{issue.due ? issue.due.toDateString() : ''}</td>
      <td>{issue.effort}</td>
    </tr>
  );
}

function IssueTable(props) {
  // issues list passed as props from IssueList, convert into IssueRow
  const issueRows = props.issues.map((issue) => {
    return <IssueRow key={issue.id} issue={issue} />;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Owner</th>
          <th>Status</th>
          <th>Title</th>
          <th>Created</th>
          <th>Due</th>
          <th>Effort</th>
        </tr>
      </thead>
      <tbody>
        {/*  array of IssueRow */}
        {issueRows}
      </tbody>
    </table>
  );
}

class IssueAdd extends React.Component {
  constructor() {
    super();
    // bind IssueAdd as this to handleSubmit method
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const issue = {
      title: form.title.value,
      owner: form.owner.value,
      // due date 10 days after creation date
      due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10),
    };
    // here this === IssueAdd as we used bind on handleSubmit
    this.props.createIssue(issue);
    form.reset();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" id="owner" name="owner" placeholder="Owner" />
        <input type="text" id="title" name="title" placeholder="Title" />
        <button type="submit">Add</button>
      </form>
    );
  }
}

IssueAdd.propTypes = {
  createIssue: PropTypes.func.isRequired,
};

class IssueList extends React.Component {
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

ReactDOM.render(<IssueList />, document.getElementById('contents'));
