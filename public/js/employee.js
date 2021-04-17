"use strict";
/*
==============
EMPLOYEE
==============
*/
const confirmBtn = document.getElementById("confirmBtn");
const closeBtn = document.querySelector("[data-bs-dismiss]");
const pinInput = document.getElementById("pinInput");
const nameInput = document.getElementById("nameInput");
const table = document.querySelector(".table");

let hasLocalStorageEmployee = sessionStorage.getItem("employee");

const formateDateAndTime = time => {
  return time ? moment(time).format("MM-DD-YYYY HH:mm A") : "-";
};
const checkAndUpdateEmployee = data => {
  const tbody = table.querySelector("tbody");
  tbody.innerHTML = `<tr>
        <td>${data.name}</td>
        <td>${data.pin}</td>
        <td>${formateDateAndTime(data.clockInTime)}</td>
        <td>${formateDateAndTime(data.clockOutTime)}</td>
        <td>${formateDateAndTime(data.breakStartTime)}</td>
        <td>${formateDateAndTime(data.breakEndTime)}</td>
  </tr>`;
};
if (hasLocalStorageEmployee) {
  hasLocalStorageEmployee = JSON.parse(hasLocalStorageEmployee);
  table.classList.remove("d-none");
  checkAndUpdateEmployee(hasLocalStorageEmployee);
}

let actionType;
const bgButtonClickHandler = name => {
  actionType = name;
  hasLocalStorageEmployee = sessionStorage.getItem("employee");
  if (hasLocalStorageEmployee) {
    hasLocalStorageEmployee = JSON.parse(hasLocalStorageEmployee);
    confirmBtn.disabled = false;
    pinInput.value = hasLocalStorageEmployee.pin;
    nameInput.value = hasLocalStorageEmployee.name;
  }
};
const revealPosition = pos => {
  const crd = pos.coords;
  const body = {
    name: nameInput.value,
    [actionType]: Date.now(),
    pin: pinInput.value,
    location: {
      lat: crd.latitude,
      lng: crd.longitude,
    },
  };
  confirmBtn.textContent = "wait...";
  confirmBtn.disabled = true;
  nameInput.value = "";
  pinInput.value = "";
  let apiUrl = "/api/employee/create";
  let method = "POST";
  hasLocalStorageEmployee = sessionStorage.getItem("employee");
  if (actionType !== "clockInTime" || hasLocalStorageEmployee) {
    if (hasLocalStorageEmployee) {
      hasLocalStorageEmployee = JSON.parse(hasLocalStorageEmployee);
      apiUrl = `/api/employee/update/${hasLocalStorageEmployee._id}`;
      method = "PATCH";
    } else {
      confirmBtn.textContent = "Confirm";
      confirmBtn.disabled = true;
      return alert("You have start shift fist");
    }
  }
  fetch(apiUrl, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then(res => res.json())
    .then(res => {
      confirmBtn.textContent = "Confirm";
      confirmBtn.disabled = true;
      sessionStorage.setItem("employee", JSON.stringify(res.data));
      checkAndUpdateEmployee(res.data);
      console.log(res);
      closeBtn.click();
    })
    .catch(err => {
      closeBtn.click();
      confirmBtn.textContent = "Confirm";
      confirmBtn.disabled = true;
      console.log(err);
    });
  // console.log("Your current position is:");
  // console.log(`Latitude : ${crd.latitude}`);
  // console.log(`Longitude: ${crd.longitude}`);
  // console.log(`More or less ${crd.accuracy} meters.`);
};
const positionDenied = err => {
  alert("you should allow location");
  console.warn(`ERROR(${err.code}): ${err.message}`);
};
const report = state => {
  console.log("Permission " + state);
};
const confirmButtonHandler = () => {
  if (!nameInput.value.trim()) {
    return alert("name in required");
  }

  navigator.permissions.query({ name: "geolocation" }).then(function (result) {
    if (result.state === "granted") {
      navigator.geolocation.getCurrentPosition(revealPosition, positionDenied);
    } else if (result.state === "prompt") {
      navigator.geolocation.getCurrentPosition(revealPosition, positionDenied);
    } else if (result.state === "denied") {
      confirmBtn.disabled = true;
      alert("you should allow location");
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
