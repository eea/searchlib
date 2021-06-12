import { DateTime } from 'luxon';

const FormatDateTime = (props) => {
  const { value, format = 'DATE_SHORT' } = props;

  const dt = DateTime.fromISO(value);

  return dt.toLocaleString(DateTime[format]);
};

export default FormatDateTime;
