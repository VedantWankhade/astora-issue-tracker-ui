/* eslint "react/prefer-stateless-function": "off" */

import React from 'react';

/**
 * IssueFilter component shows options to filter issues
 */
export default class IssueFilter extends React.Component {
  render() {
    return (
      <div>
        <a href="/#/issues">All Issues</a>
        {' | '}
        <a href="/#/issues?status=New">New Issues</a>
        {' | '}
        <a href="/#/issues?status=Assigned">Assigned Issues</a>
      </div>
    );
  }
}
