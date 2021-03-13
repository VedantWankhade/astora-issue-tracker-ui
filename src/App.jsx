const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
    if (dateRegex.test(value)) return new Date(value);
    return value;
}


class IssueFilter extends React.Component {

    render() {

        return (
            <div>
                ISSUE_FILTER
            </div>
        )
    }
}

function IssueRow(props) {

    const issue = props.issue;

    return (
        <tr>
            <td>{issue.id}</td>
            <td>{issue.owner}</td>
            <td>{issue.status}</td>
            <td>{issue.title}</td>
            <td>{issue.created.toDateString()}</td>
            <td>{issue.due ? issue.due.toDateString() : ''}</td>
            <td>{issue.effort}</td>
        </tr>
    );
}

function IssueTable(props) {

    const issueRows = props.issues.map((issue) => {
        return <IssueRow key={issue.id} issue={issue}/>;
    })

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
            {issueRows}
            </tbody>
        </table>
    )
}

class IssueAdd extends React.Component {

   constructor() {
       super();
       this.handleSubmit = this.handleSubmit.bind(this);
   }

   handleSubmit(e) {
       e.preventDefault();
       const form = e.target;
       const issue = {
           title: form.title.value,
           owner: form.owner.value,
            due: new Date(new Date().getTime() + 1000*60*60*24*10)
       }
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
        )
    }
}

class IssueList extends React.Component {

    constructor() {
        super();
        this.state = {issues: []};
    }

    async createIssue(issue) {

        const query = `mutation issueAdd($issue: IssueInputs!) {
                            issueAdd(issue: $issue) {
                                id
                            }
                        }`;




        const response = await fetch('/api', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ query, variables: { issue } })
        });
        this.loadData();
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        const query = `query {
            issueList {
                id title status owner
                created effort due
            }
        }`;

        let res = await fetch('/api', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({query})
        });

        const body = await res.text();
        const result = JSON.parse(body, jsonDateReviver);

        this.setState({issues: result.data.issueList});
    }

    render() {

        return (
            <React.Fragment>
                <h1>Issue Tracker</h1>
                <IssueFilter />
                <hr />
                <IssueTable issues={this.state.issues} />
                <hr />
                <IssueAdd createIssue={this.createIssue.bind(this)} />
            </React.Fragment>
        )
    }
}

ReactDOM.render(<IssueList />, document.getElementById('contents'));