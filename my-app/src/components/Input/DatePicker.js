import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import { DateRange } from 'react-date-range';
import { useState, useEffect } from 'react';

// setStartDateValue={setStartDateValue}
// setEndDateValue={setEndDateValue}
// startDateValue={startDateValue}
// endDateValue={endDateValue}
// endInitDateValue={endInitDateValue}
// startInitDateValue={startInitDateValue}
function DatePicker(props) {
  const [state, setState] = useState([
    {
      startDate: props.startDateValue,
      endDate: props.endDateValue,
      key: 'selection',
    },
  ]);
  const [hasUpdate, setHasUpdate] = useState(false);

  useEffect(() => {
    setState([
      {
        startDate: props.startInitDateValue,
        endDate: props.endInitDateValue,
        key: 'selection',
      },
    ]);
  }, [props.startInitDateValue, props.endInitDateValue]);

  useEffect(() => {
    console.log(state.length);
    if (state.length > 0) {
      console.log('here', state);
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
