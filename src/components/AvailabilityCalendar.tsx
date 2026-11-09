'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BookedDate } from '@/types';
import { isDateAvailable } from '@/lib/utils';

interface AvailabilityCalendarProps {
  bookedDates: BookedDate[];
  selectedDates: { start: Date | null; end: Date | null };
  onDateSelect: (dates: { start: Date | null; end: Date | null }) => void;
}

export default function AvailabilityCalendar({
  bookedDates,
  selectedDates,
  onDateSelect,
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    // Check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (clickedDate < today) return;

    // Check if date is available
    if (!isDateAvailable(bookedDates, clickedDate)) return;

    if (!selectedDates.start || (selectedDates.start && selectedDates.end)) {
      // Start new selection
      onDateSelect({ start: clickedDate, end: null });
    } else if (clickedDate < selectedDates.start) {
      // If clicked date is before start, make it the new start
      onDateSelect({ start: clickedDate, end: selectedDates.start });
    } else {
      // Set as end date
      onDateSelect({ start: selectedDates.start, end: clickedDate });
    }
  };

  const isDateBooked = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return !isDateAvailable(bookedDates, date);
  };

  const isDateSelected = (day: number) => {
    if (!selectedDates.start) return false;

    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateTime = date.getTime();

    if (selectedDates.start && !selectedDates.end) {
      return dateTime === selectedDates.start.getTime();
    }

    if (selectedDates.start && selectedDates.end) {
      return (
        dateTime >= selectedDates.start.getTime() &&
        dateTime <= selectedDates.end.getTime()
      );
    }

    return false;
  };

  const isDateInPast = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const monthNames = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-deep-navy" />
        </button>

        <h3 className="font-semibold text-deep-navy">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>

        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 text-deep-navy" />
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-deep-navy/60 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before start of month */}
        {Array.from({ length: startingDayOfWeek }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}

        {/* Days of month */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const booked = isDateBooked(day);
          const selected = isDateSelected(day);
          const past = isDateInPast(day);
          const disabled = booked || past;

          return (
            <button
              key={day}
              onClick={() => !disabled && handleDateClick(day)}
              disabled={disabled}
              className={`
                aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all
                ${selected ? 'bg-rose-gold text-white' : ''}
                ${!selected && !disabled ? 'hover:bg-rose-gold/10 text-deep-navy' : ''}
                ${booked ? 'bg-red-100 text-red-400 line-through cursor-not-allowed' : ''}
                ${past && !booked ? 'text-gray-300 cursor-not-allowed' : ''}
                ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-4 mt-4 pt-4 border-t border-gray-200 text-xs">
        <div className="flex items-center space-x-1.5">
          <div className="w-4 h-4 bg-rose-gold rounded" />
          <span className="text-deep-navy/70">Dipilih</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-4 h-4 bg-red-100 rounded" />
          <span className="text-deep-navy/70">Tidak Tersedia</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-4 h-4 border border-gray-300 rounded" />
          <span className="text-deep-navy/70">Tersedia</span>
        </div>
      </div>

      {/* Selected Range Info */}
      {selectedDates.start && selectedDates.end && (
        <div className="mt-4 p-3 bg-emerald-green/10 border border-emerald-green/30 rounded-lg">
          <p className="text-sm text-emerald-green font-medium text-center">
            {selectedDates.start.toLocaleDateString('id-ID')} -{' '}
            {selectedDates.end.toLocaleDateString('id-ID')}
          </p>
        </div>
      )}
    </div>
  );
}
