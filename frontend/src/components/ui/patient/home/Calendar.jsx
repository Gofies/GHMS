import Calendar from 'react-calendar';
import '../../../../../node_modules/react-calendar/dist/Calendar.css';
export function Calendars({ selected, onSelect, appointmentDates }) {
  const isAppointmentDate = (date) =>
    appointmentDates.some(
      (appointmentDate) =>
        appointmentDate.getDate() === date.getDate() &&
        appointmentDate.getMonth() === date.getMonth() &&
        appointmentDate.getFullYear() === date.getFullYear()
    );

  return (
    <Calendar
      value={selected}
      onChange={onSelect}
      tileClassName={({ date }) =>
        isAppointmentDate(date) ? 'appointment-date' : ''
      }
      prev2Label={null}
      next2Label={null}
      showNeighboringMonth={false}
      className="rounded-md border"
    />
  );
}
