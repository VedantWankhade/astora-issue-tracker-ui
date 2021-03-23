import React from 'react';
import {
  Form,
  FormControl,
  FormGroup,
  ControlLabel,
  Button,
} from 'react-bootstrap';

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
      <Form inline name="issueAdd" onSubmit={this.handleSubmit}>
        <FormGroup>
          <ControlLabel>Owner:</ControlLabel>{' '}
          <FormControl type="text" name="owner" />
        </FormGroup>{' '}
        <FormGroup>
          <ControlLabel>Title:</ControlLabel>{' '}
          <FormControl type="text" name="title" />
        </FormGroup>{' '}
        <Button bsStyle="primary" type="submit">
          Add
        </Button>
      </Form>
    );
  }
}
