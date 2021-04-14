"use strict";
/*
==============
EMPLOYEE
==============
*/
const confirmBtn = document.getElementById("confirmBtn");
const closeBtn = document.querySelector("[data-bs-dismiss]");
const pinInput = document.getElementById("pinInput");
let actionType;
const bgButtonClickHandler = name => {
  actionType = name;
};
const revealPosition = pos => {
  var crd = pos.coords;

  console.log("Your current position is:");
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);
};
const positionDenied = err => {
  console.warn(`ERROR(${err.code}): ${err.message}`);
};
const report = state => {
  console.log("Permission " + state);
};
const confirmButtonHandler = () => {
  pinInput.value = "";
  confirmBtn.disabled = true;
  navigator.permissions.query({ name: "geolocation" }).then(function (result) {
    if (result.state === "granted") {
      report(result.state, result);
      navigator.geolocation.getCurrentPosition(revealPosition, positionDenied);
      console.log(result);

      closeBtn.click();
    } else if (result.state === "prompt") {
      report(result.state);
      navigator.geolocation.getCurrentPosition(revealPosition, positionDenied);
      closeBtn.click();
    } else if (result.state === "denied") {
      report(result.state);
    }
    result.onchange = function () {
      report(result.state);
    };
  });
};
const pinInputChangeHandler = e => {
  if (e.target.value.length > 0) {
    confirmBtn.disabled = false;
  } else {
    confirmBtn.disabled = true;
  }
};
confirmBtn.addEventListener("click", confirmButtonHandler);
pinInput.addEventListener("input", pinInputChangeHandler);
