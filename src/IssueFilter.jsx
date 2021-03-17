/* eslint "react/prefer-stateless-function": "off" */

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * IssueFilter component shows options to filter issues
 */
export default class IssueFilter extends React.Component {
  render() {
    return (
      <div>
        <Link to="/issues">All Issues</Link>
        {' | '}
        <Link to={{ pathname: '/issues', search: '?status=New' }}>
          New Issues
        </Link>
        {' | '}
        <Link to={{ pathname: '/issues', search: '?status=Assigned' }}>
          Assigned Issues
        </Link>
      </div>
    );
  }
}
