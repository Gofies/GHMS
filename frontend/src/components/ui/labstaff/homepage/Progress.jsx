import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export const Progress = ({ value, className }) => {
  return (
    <div className={classNames('relative h-4 w-full bg-gray-300 rounded-full overflow-hidden', className)}>
      <div
        style={{ width: `${value}%` }}
        className="h-full bg-blue-500"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
    </div>
  )
}

Progress.propTypes = {
  value: PropTypes.number.isRequired,
  className: PropTypes.string,
}

Progress.defaultProps = {
  className: '',
}
