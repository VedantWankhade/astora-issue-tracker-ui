// regex of pattern ISOString
const dateRegex = new RegExp("^\\d\\d\\d\\d-\\d\\d-\\d\\d");

// function that will be passed to JSON.parse, will convert each string date into Date object
function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}

/**
 * Wrapper over api fetch, with error handling
 * @param query Api fetch query :string
 * @param variables graphQL variable
 * @returns {Promise<*>}
 */
async function graphQLFetch(query, variables = {}) {
  try {
    const response = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });
    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver);

    // if errors are encountered show them as alert
    if (result.errors) {
      const error = result.errors[0];
      if (error.extensions.code === "BAD_USER_INPUT") {
        const details = error.extensions.exception.errors.join("\n");
        alert(`${error.message}:\n ${details}`);
      } else {
        alert(`${error.extensions.code}: ${error.message}`);
      }
    }
    return result.data;
  } catch (e) {
    // if exception is found, then it must be api error
    alert(`Error in sending data to server: ${e.message}`);
  }
}

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
      <td>{issue.due ? issue.due.toDateString() : ""}</td>
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
        <button>Add</button>
      </form>
    );
  }
}

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

ReactDOM.render(<IssueList />, document.getElementById("contents"));
