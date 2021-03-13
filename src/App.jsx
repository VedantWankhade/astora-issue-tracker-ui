const initialIssues = [
    {
        id: 1, status: 'New', owner: 'Ravan', effort: 5,
        created: new Date('2018-08-15'), due: undefined,
        title: 'Error in console when clicking Add',
    },
    {
        id: 2, status: 'Assigned', owner: 'Eddie', effort: 14,
        created: new Date('2018-08-16'), due: new Date('2018-08-30'),
        title: 'Missing bottom border on panel',
    },
];

const sampleIssue = {
    status: 'New', owner: 'Pieta',
    title: 'Completion date should be optional',
};

const sampleIssue2 = {
    status: 'New', owner: 'Pieta',
    title: 'Completion date should be optional',
};

class IssueFilter extends React.Component {

    render() {

        return (
            <div>
                ISSUE_FILTER
            </div>
        )
    }
}

class IssueRow extends React.Component {

    render() {

        const issue = this.props.issue;

        return (
            <tr>
                <td>{issue.id}</td>
                <td>{issue.owner}</td>
                <td>{issue.status}</td>
                <td>{issue.title}</td>
                <td>{issue.created.toDateString()}</td>
                <td>{issue.due ? issue.due.toDateString() : ''}</td>
                <td>{issue.effort}</td></tr>
        )
    }
}

class IssueTable extends React.Component {

    constructor() {
        super();
        this.state = {issues: []}
    }

    createIssue(issue) {

        issue.id = this.state.issues.length + 1;
        issue.created = new Date();
        const newIssueList = this.state.issues.slice();
        newIssueList.push(issue);
        this.setState({issues: newIssueList});
    }

    componentDidMount() {
        this.loadData();
        setTimeout(() => {
            this.createIssue(sampleIssue);
        }, 2000);
        setTimeout(() => {
            this.createIssue(sampleIssue2);
        }, 2000);
    }

    loadData() {
        setTimeout(() => {
            this.setState({issues: initialIssues});
        }, 500);
    }

    render() {

        const issueRows = this.state.issues.map((issue) => {
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
}

class IssueAdd extends React.Component {

    render() {

        return (
            <div>
                ISSUE_ADD
            </div>
        )
    }
}

class IssueList extends React.Component {

    render() {

        return (
            <React.Fragment>
                <h1>Issue Tracker</h1>
                <IssueFilter />
                <hr />
                <IssueTable />
                <hr />
                <IssueAdd />
            </React.Fragment>
        )
    }
}

ReactDOM.render(<IssueList />, document.getElementById('contents'));