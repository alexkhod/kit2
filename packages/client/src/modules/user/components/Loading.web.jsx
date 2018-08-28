import React from 'react';
import PropTypes from 'prop-types';

const Loading = ({ error, timedOut, pastDelay }) => {
  if (error) {
    return <div>Error!</div>;
  }

  if (timedOut) {
    return <div>Taking a long time...</div>;
  }

  if (pastDelay) {
    return <div>Loading...</div>;
  }

  return null;
};

Loading.propTypes = {
  error: PropTypes.bool,
  timedOut: PropTypes.bool,
  pastDelay: PropTypes.bool
};

export default Loading;
