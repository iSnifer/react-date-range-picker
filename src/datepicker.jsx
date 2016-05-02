import React from 'react';
import DateRange from 'moment-range';
import { Calendar } from 'calendar';
import cn from 'classnames';

import WeekDay from './WeekDay';
import { MONTH_NAMES, WEEK_NAMES, WEEK_NAMES_SHORT } from './locale';

/**
 * Reset time of Date to 00:00:00
 * @param  {Date} date
 * @return {Date}
 */
function resetDate (date) {
    return new Date(date.toString().replace(/\d{2}:\d{2}:\d{2}/, '00:00:00'));
}

let id = 1;
class Datepicker extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            date: null,
            month: null,
            range: null,
            year: null
        };

        this.id = id++;

        this.calendar = new Calendar(props.locale === 'RU' ? 1 : 0);

        this.onClick = this.onClick.bind(this);
        this.changeMonth = this.changeMonth.bind(this);
    }

    // Setting up default state of calendar
    componentWillMount () {
        const TODAY = new Date();

        // If we have defined 'initialDate' prop
        // we will use it also for define month and year.
        // If not it will be TODAY
        const initialDate = this.props.initialDate || TODAY;
        const initialRange =
            this.props.range || new DateRange(resetDate(this.props.minimumDate), resetDate(this.props.maximumDate));
        const state = {
            date: initialDate,
            month: initialDate.getMonth(),
            year: initialDate.getFullYear()
        };

        // Before set range to state we should check -
        // is range contains our initialDate.
        // If not, we will fire Error
        if (initialRange.contains(initialDate)) {
            state.range = initialRange;
        } else {
            throw new Error('Initial Range doesn\'t contains Initial Date');
        }

        this.setState(state);
    }

    componentWillReceiveProps (nextProps) {
        let range;

        if (nextProps.range !== this.props.range) {
            range = nextProps.range
        } else if (nextProps.minimumDate !== this.props.minimumDate ||
                   nextProps.maximumDate !== this.props.maximumDate) {
            range = new DateRange(resetDate(nextProps.minimumDate), resetDate(nextProps.maximumDate));
        }

        if (range) {
            this.setState({range});
        }
    }

    /**
     * Change month handler
     * @param {Number} direction - "1" or "-1"
     */
    changeMonth (direction) {
        const nextMonth = this.state.month + direction;
        const isMonthAvailable = nextMonth >= 0 && nextMonth <= 11;

        let model;
        if (!isMonthAvailable) {
            model = {
                month: direction === 1 ? 0 : 11,
                year: this.state.year + direction
            };
        } else {
            model = {month: this.state.month + direction};
        }

        this.setState(model);
    }

    /**
     * Calendar state setter
     * @param  {Date} date - selected date
     */
    onClick (date) {
        if (date) {
            this.setState({date}, this.props.onClick(date, this.props.name || `date_${this.id}`));
        }
    }

    renderMonth () {

        // Array of weeks, which contains arrays of days
        // [[Date, Date, ...], [Date, Date, ...], ...]
        var month = this.calendar.monthDates(this.state.year, this.state.month);
        return month.map((week, i) => {
            return <tr className="calendar__week" key={i}>{this.renderWeek(week)}</tr>;
        });
    }

    /**
     * Render week
     * @param  {Array} weekDays - array of instanceof Date
     * @return {Array} - array of Components
     */
    renderWeek (weekDays) {
        return weekDays.map((day, i) => {
            var isCurrent = this.state.date.toDateString() === day.toDateString();
            return (
                <WeekDay
                    key={i}
                    date={day}
                    range={this.state.range}
                    current={isCurrent}
                    onClick={this.onClick} />
            );
        });
    }

    renderWeekdayNames () {
        return WEEK_NAMES[this.props.locale].map((weekname, i) => {
            return <th className="calendar__weekday-name" key={i}>{weekname}</th>;
        });
    }

    renderNavigation () {
        return (
            <span className="calendar__arrows">
                <span
                    className="calendar__arrow calendar__arrow_right"
                    onClick={this.changeMonth.bind(this, 1)}>
                    {'>>'}
                </span>
                <span
                    className="calendar__arrow calendar__arrow_left"
                    onClick={this.changeMonth.bind(this, -1)}>
                    {'<<'}
                </span>
            </span>
        );
    }

    render () {
        return (
            <div className="calendar">
                <div className="calendar__head">
                    {!this.props.disableNavigation && !this.props.outsideNavigation ? this.renderNavigation() : ''}
                    <span className="calendar__month-name">
                        {MONTH_NAMES[this.props.locale][this.state.month] + ', ' + this.state.year}
                    </span>
                </div>
                <table className="calendar__month">
                    <thead>
                        <tr className="calendar__week-names">
                            {this.renderWeekdayNames()}
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderMonth()}
                    </tbody>
                </table>
                {!this.props.disableNavigation && this.props.outsideNavigation ? this.renderNavigation() : ''}
            </div>
        );
    }
}

Datepicker.propTypes = {
    onClick: React.PropTypes.func,
    range: React.PropTypes.instanceOf(DateRange),
    disableNavigation: React.PropTypes.bool,
    outsideNavigation: React.PropTypes.bool,
    initialDate: React.PropTypes.instanceOf(Date),
    locale: React.PropTypes.string,
    minimumDate: React.PropTypes.instanceOf(Date),
    maximumDate: React.PropTypes.instanceOf(Date),
    name: React.PropTypes.string,
};

Datepicker.defaultProps = {
    // Handler which will be execute when click on day
    onClick: function () {},

    // Instance of DateRange
    range: null,

    // If true, navigation will be hidden
    disableNavigation: false,

    // If true, navigation will be in root container
    outsideNavigation: false,

    // Available locales: RU, EN, DE, FR, IT, POR, ESP
    locale: 'EN',

    // Minimum available date
    minimumDate: new Date(1970, 0, 1),

    // Maximum available date
    maximumDate: new Date(2100, 0, 1),
};

export default Datepicker;
