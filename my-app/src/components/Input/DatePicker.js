import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import { useEffect, useState } from 'react';

import { DateRange } from 'react-date-range';
import PropTypes from 'prop-types';

DatePicker.propTypes = {
  setStartDateValue: PropTypes.func,
  setEndDateValue: PropTypes.func,
  startDateValue: PropTypes.string,
  endDateValue: PropTypes.string,
  endInitDateValue: PropTypes.string,
  startInitDateValue: PropTypes.string,
};

// setStartDateValue={setStartDateValue}
// setEndDateValue={setEndDateValue}
// startDateValue={startDateValue}
// endDateValue={endDateValue}
// endInitDateValue={endInitDateValue}
// startInitDateValue={startInitDateValue}
function DatePicker(props) {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const [hasUpdate, setHasUpdate] = useState(false);

  useEffect(() => {
    if (props.startInitDateValue) {
      setState([
        {
          startDate: props.startInitDateValue,
          endDate: props.endInitDateValue,
          key: 'selection',
        },
      ]);
    }
  }, [props.startInitDateValue, props.endInitDateValue]);

  useEffect(() => {
    if (state.length > 0) {
      props.setStartDateValue(state[0].startDate);
      props.setEndDateValue(state[0].endDate);
    }
  }, [hasUpdate]);

  return (
    <DateRange
      editableDateInputs={true}
      onChange={(item) => {
        setState([item.selection]);
        setHasUpdate(!hasUpdate);
      }}
      moveRangeOnFirstSelection={false}
      ranges={state}
    />
  );
}

export default DatePicker;
