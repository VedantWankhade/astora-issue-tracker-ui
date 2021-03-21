import React from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';

const IssueRow = withRouter(
  ({ issue, location: { search }, closeIssue, index, deleteIssue }) => {
    const selectLocation = { pathname: `/issues/${issue.id}`, search };
    // console.log(JSON.stringify(search));
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
        <td>
          <Link to={`/edit/${issue.id}`}>Edit</Link>
          {' | '}
          <NavLink to={selectLocation}>Select</NavLink>
          {' | '}
          <button
            type="button"
            onClick={() => {
              closeIssue(index);
            }}
          >
            Close
          </button>
          {' | '}
          <button
            type="button"
            onClick={() => {
              deleteIssue(index);
            }}
          >
            Delete
          </button>
        </td>
      </tr>
    );
  }
);

export default function IssueTable({ issues, closeIssue, deleteIssue }) {
  // issues list passed as props from IssueList, convert into IssueRow
  const issueRows = issues.map((issue, index) => {
    return (
      <IssueRow
        key={issue.id}
        issue={issue}
        closeIssue={closeIssue}
        index={index}
        deleteIssue={deleteIssue}
      />
    );
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
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {/*  array of IssueRow */}
        {issueRows}
      </tbody>
    </table>
  );
}
