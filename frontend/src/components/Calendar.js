import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import './Calendar.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date().getDate();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const totalCells = firstDayOfMonth + daysInMonth;
  const totalRows = Math.ceil(totalCells / 7);

  const calendarArray = Array.from({ length: totalRows * 7 }, (_, i) => {
    const day = i - firstDayOfMonth + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
  };

  return (
    <Container className="calendar-container">
      <div className="calendar-header">
        <h2>{currentDate.toLocaleString('default', { month: 'long' })} {year}</h2>
      </div>
      <div className="calendar-nav-buttons">
        <button onClick={previousMonth} className="nav-button">Previous Month</button>
        <button onClick={goToCurrentMonth} className="nav-button current-month-button">Current Month</button>
        <button onClick={nextMonth} className="nav-button">Next Month</button>
      </div>
      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="calendar-header">{day}</div>
        ))}
        {calendarArray.map((day, index) => (
          <div key={index} className={`calendar-day ${day === today && month === currentMonth && year === currentYear ? 'current-day' : ''}`}>
            {day ? (
              <>
                <div className="day-number">{day}</div>
                <Link to={`/journal/${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`} className="journal-link">
                  Journal
                </Link>
              </>
            ) : (
              <div className="empty-day"></div>
            )}
          </div>
        ))}
      </div>
    </Container>
  );
};

export default Calendar;
