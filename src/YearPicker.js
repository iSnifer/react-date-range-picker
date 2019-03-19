import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import DateRange from 'moment-range'

const range = currentYear => {
  const year = parseInt(currentYear, 10)
  let tmpArray = []

  for (let i = year - 5; i <= year + 6; i += 1) {
    tmpArray = tmpArray.concat(i)
  }

  return tmpArray
}

const TODAY_YEAR = new Date().getFullYear()
class YearPicker extends Component {
  constructor(props) {
    super(props)

    this.state = {
      year: parseInt(props.currentYear, 10) || TODAY_YEAR,
    }
  }

  componentWillReceiveProps({ currentYear }) {
    if (parseInt(currentYear, 10) !== this.props.year) {
      this.setState({ year: parseInt(currentYear, 10) })
    }
  }

  onClick = ({ target: { textContent, id } }) => {
    const props = id.split('_')
    if (props[2] === 'true') {
      return false
    }

    this.props.onClick(parseInt(textContent, 10))
  }

  render() {
    return (
      <div className="calendar__years">
        {range(this.state.year).map((item, i) => {
          const range = new DateRange(new Date(item, 0, 1), new Date(item, 11, 31))
          const disabled = !range.overlaps(this.props.range)
          return (
            <div
              className={cn(
                'calendar__year',
                { calendar__year_current: item === this.state.year },
                { calendar__year_disabled: disabled }
              )}
              onClick={this.onClick}
              id={`year_${i}_${disabled}`}
              key={item}>
              {item}
            </div>
          )
        })}
      </div>
    )
  }
}

YearPicker.propTypes = {
  onClick: PropTypes.func.isRequired,
  range: React.PropTypes.instanceOf(DateRange).isRequired,
  currentYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default YearPicker
