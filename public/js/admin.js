"use strict";
/*
==============
EMPLOYEE
==============
*/
const bgButtonClickHandler = name => {
  console.log(name);
};

/*
==============
ADMIN
==============
*/
//DATE RANGE SELEC
const dateSelected = (start, end, label) => {
  console.log(
    "A new date selection was made: " +
      start.format("YYYY-MM-DD") +
      " to " +
      end.format("YYYY-MM-DD")
  );
};

$('input[name="daterange"]').daterangepicker(
  {
    opens: "left",
  },
  dateSelected
);
