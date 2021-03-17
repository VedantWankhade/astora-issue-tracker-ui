/* globals React */

export default class IssueAdd extends React.Component {
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
