/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';

import { LinkContainer } from 'react-router-bootstrap';

import Toast from './Toast.jsx';

import {
  Col,
  Panel,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  ButtonToolbar,
  Button,
  Alert,
} from 'react-bootstrap';

import NumInput from './NumInput.jsx';
import DateInput from './DateInput.jsx';
import TextInput from './TextInput.jsx';
import graphQLFetch from './graphQLFetch.js';

export default class IssueEdit extends React.Component {
  constructor() {
    super();
    this.state = {
      issue: {},
      invalidFields: {},
      showingValidation: false,
      toastVisible: false,
      toastMessage: ' ',
      toastType: 'success',
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onValidityChange = this.onValidityChange.bind(this);
    this.dismissValidation = this.dismissValidation.bind(this);
    this.showSuccess = this.showSuccess.bind(this);
    this.showError = this.showError.bind(this);
    this.dismissToast = this.dismissToast.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    const {
      match: {
        params: { id: prevId },
      },
    } = prevProps;
    const {
      match: {
        params: { id },
      },
    } = this.props;
    if (id !== prevId) {
      this.loadData();
    }
  }

  onValidityChange(e, valid) {
    const { name } = e.target;
    this.setState((prevState) => {
      const invalidFields = { ...prevState.invalidFields, [name]: !valid };
      if (valid) delete invalidFields[name];
      return { invalidFields };
    });
  }

  onChange(event, naturalValue) {
    const { name, value: textValue } = event.target;
    const value = naturalValue === undefined ? textValue : naturalValue;
    this.setState((prevState) => ({
      issue: { ...prevState.issue, [name]: value },
    }));
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.showValidation();
    const { issue, invalidFields } = this.state;

    if (Object.keys(invalidFields).length !== 0) return;

    const query = `mutation issueUpdate(
                    $id: Int!
                    $changes: IssueUpdateInputs!
                ) {
                    issueUpdate(
                    id: $id
                    changes: $changes
                ) {
                    id title status owner
                    effort created due description
                  }
              }`;

    const { id, created, ...changes } = issue;
    const data = await graphQLFetch(query, { changes, id }, this.showError);
    if (data) {
      this.setState({ issue: data.issueUpdate });
      this.showSuccess('Updated issue successfully');
    }
  }

  showValidation() {
    this.setState({ showingValidation: true });
  }

  dismissValidation() {
    this.setState({ showingValidation: false });
  }

  async loadData() {
    const query = `query issue($id: Int!) {
      issue(id: $id) {
        id title status owner
        effort created due description
      }
    }`;

    const {
      match: {
        params: { id },
      },
    } = this.props;

    const data = await graphQLFetch(query, { id }, this.showError);
    // if (data) {
    //   const { issue } = data;
    //   issue.due = issue.due ? issue.due.toDateString() : '';
    //   issue.effort = issue.effort != null ? issue.effort.toString() : '';
    //   issue.owner = issue.owner != null ? issue.owner : '';
    //   issue.description = issue.description != null ? issue.description : '';
    //   this.setState({ issue, invalidFields: {} });
    // } else {
    //   this.setState({ issue: {}, invalidFields: {} });
    // }
    this.setState({ issue: data ? data.issue : {}, invalidFields: {} });
  }

  showSuccess(message) {
    this.setState({
      toastVisible: true,
      toastMessage: message,
      toastType: 'success',
    });
  }

  showError(message) {
    this.setState({
      toastVisible: true,
      toastMessage: message,
      toastType: 'danger',
    });
  }

  dismissToast() {
    this.setState({ toastVisible: false });
  }

  render() {
    const {
      issue: { id },
    } = this.state;
    const {
      match: {
        params: { id: propsId },
      },
    } = this.props;
    if (id == null) {
      if (propsId != null) {
        return <h3>{`Issue with ID ${propsId} not found`}</h3>;
      }
      return null;
    }

    const { toastVisible, toastMessage, toastType } = this.state;

    const { invalidFields, showingValidation } = this.state;
    let validationMessage;

    if (Object.keys(invalidFields).length !== 0 && showingValidation) {
      validationMessage = (
        <Alert bsStyle="danger" onDismiss={this.dismissValidation}>
          Please correct invalid fields before submitting
        </Alert>
      );
    }

    const {
      issue: { title, status },
    } = this.state;
    const {
      issue: { owner, effort, description },
    } = this.state;
    const {
      issue: { created, due },
    } = this.state;

    return (
      // <form onSubmit={this.handleSubmit}>
      //   <h3>{`Editing issue: ${id}`}</h3>
      //   <table>
      //     <tbody>
      //       <tr>
      //         <td>Created:</td>
      //         <td>{created.toDateString()}</td>
      //       </tr>
      //       <tr>
      //         <td>Status:</td>
      //         <td>
      //           <select name="status" value={status} onChange={this.onChange}>
      //             <option value="New">New</option>
      //             <option value="Assigned">Assigned</option>
      //             <option value="Fiexd">Fixed</option>
      //             <option value="Closed">Closed</option>
      //           </select>
      //         </td>
      //       </tr>
      //       <tr>
      //         <td>Owner:</td>
      //         <td>
      //           <TextInput
      //             key={id}
      //             name="owner"
      //             value={owner}
      //             onChange={this.onChange}
      //           />
      //         </td>
      //       </tr>
      //       <tr>
      //         <td>Effort:</td>
      //         <td>
      //           <NumInput
      //             key={id}
      //             name="effort"
      //             value={effort}
      //             onChange={this.onChange}
      //           />
      //         </td>
      //       </tr>
      //       <tr>
      //         <td>Due:</td>
      //         <td>
      //           <DateInput
      //             name="due"
      //             value={due}
      //             onChange={this.onChange}
      //             onValidityChange={this.onValidityChange}
      //             key={id}
      //           />
      //         </td>
      //       </tr>
      //       <tr>
      //         <td>Title:</td>
      //         <td>
      //           <TextInput
      //             key={id}
      //             size={50}
      //             name="title"
      //             value={title}
      //             onChange={this.onChange}
      //           />
      //         </td>
      //       </tr>
      //       <tr>
      //         <td>Description:</td>
      //         <td>
      //           <TextInput
      //             tag="textarea"
      //             key={id}
      //             rows={8}
      //             cols={50}
      //             name="description"
      //             value={description}
      //             onChange={this.onChange}
      //           />
      //         </td>
      //       </tr>
      //       <tr>
      //         <td />
      //         <td>
      //           <button type="submit">Submit</button>
      //         </td>
      //       </tr>
      //     </tbody>
      //   </table>
      //   {validationMessage}
      //   <Link to={`/edit/${id - 1}`}>Prev</Link>
      //   {' | '}
      //   <Link to={`/edit/${id + 1}`}>Next</Link>
      // </form>

      <Panel>
        <Panel.Heading>
          <Panel.Title>{`Editing issue: ${id}`}</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <Form horizontal onSubmit={this.handleSubmit}>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>
                Created
              </Col>
              <Col sm={9}>
                <FormControl.Static>
                  {created.toDateString()}
                </FormControl.Static>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>
                Status
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  name="status"
                  value={status}
                  onChange={this.onChange}
                >
                  <option value="New">New</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Fixed">Fixed</option>
                  <option value="Closed">Closed</option>
                </FormControl>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>
                Owner
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  name="owner"
                  value={owner}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>
                Effort
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass={NumInput}
                  name="effort"
                  value={effort}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup validationState={invalidFields.due ? 'error' : null}>
              <Col componentClass={ControlLabel} sm={3}>
                Due
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass={DateInput}
                  onValidityChange={this.onValidityChange}
                  name="due"
                  value={due}
                  onChange={this.onChange}
                  key={id}
                />
                <FormControl.Feedback />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>
                Title
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  size={50}
                  name="title"
                  value={title}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>
                Description
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  tag="textarea"
                  rows={4}
                  cols={50}
                  name="description"
                  value={description}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={3} sm={6}>
                <ButtonToolbar>
                  <Button bsStyle="primary" type="submit">
                    Submit
                  </Button>
                  <LinkContainer to="/issues">
                    <Button bsStyle="link">Back</Button>
                  </LinkContainer>
                </ButtonToolbar>
              </Col>
            </FormGroup>
          </Form>
          <FormGroup>
            <Col smOffset={3}>{validationMessage}</Col>
          </FormGroup>
        </Panel.Body>
        <Panel.Footer>
          <Link to={`/edit/${id - 1}`}>Prev</Link>
          {' | '}
          <Link to={`/edit/${id + 1}`}>Next</Link>
        </Panel.Footer>
        <Toast
          showing={toastVisible}
          onDismiss={this.dismissToast}
          bsStyle={toastType}
        >
          {toastMessage}
        </Toast>
      </Panel>
    );
  }
}
