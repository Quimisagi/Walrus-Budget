import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const MonthYearPicker = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const handleChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };

  const showDatePicker = () => {
    setShow(true);
  };

  const formatDate = (date) => {
    const month = date.getMonth() + 1; // getMonth() is 0-indexed
    const year = date.getFullYear();
    return `${month < 10 ? '0' : ''}${month}-${year}`;
  };

  return (
    <View>
      <TouchableOpacity onPress={showDatePicker}>
        <Text>{formatDate(date)}</Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={date}
          mode="date" // Using date mode, but we'll ignore the day part
          display="spinner"
          onChange={handleChange}
          minimumDate={new Date(1900, 0, 1)} // Optional: restrict years
          maximumDate={new Date()} // Optional: set current date as max
          style={{ width: 320 }}
        />
      )}
    </View>
  );
};

export default MonthYearPicker;

