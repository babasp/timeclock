"use strict";
/*
==============
EMPLOYEE
==============
*/
const confirmBtn = document.getElementById("confirmBtn");
const closeBtn = document.querySelector("[data-bs-dismiss]");
const siteNameInput = document.getElementById("siteNameInput");
const nameInput = document.getElementById("nameInput");
const PIN = document.getElementById("PIN");
const table = document.querySelector(".table");
const siteHeading = document.querySelector(".site-heading");

let hasLocalStorageEmployee = sessionStorage.getItem("employee");

const formateDateAndTime = time => {
  return time ? moment(time).format("MM-DD-YYYY HH:mm A") : "-";
};
const checkAndUpdateEmployee = data => {
  table.classList.remove("d-none");
  siteHeading.classList.remove("d-none");
  siteHeading.querySelector("div h3").textContent = "Site: " + data.siteName;
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

  checkAndUpdateEmployee(hasLocalStorageEmployee);
}

let actionType;
const bgButtonClickHandler = name => {
  actionType = name;
  hasLocalStorageEmployee = sessionStorage.getItem("employee");
  if (hasLocalStorageEmployee) {
    hasLocalStorageEmployee = JSON.parse(hasLocalStorageEmployee);
    confirmBtn.disabled = false;
    PIN.value = hasLocalStorageEmployee.pin;
    nameInput.value = hasLocalStorageEmployee.name;
    siteNameInput.value = hasLocalStorageEmployee.siteName;
  }
};
const revealPosition = pos => {
  const crd = pos.coords;
  // console.log(crd);
  const body = {
    name: nameInput.value,
    [actionType]: Date.now(),
    pin: PIN.value.toLowerCase(),
    siteName: siteNameInput.value,
    location: {
      lat: crd.latitude,
      lng: crd.longitude,
    },
  };
  confirmBtn.textContent = "wait...";
  confirmBtn.disabled = true;

  // hasLocalStorageEmployee = sessionStorage.getItem("employee");
  // if (actionType !== "clockInTime" || hasLocalStorageEmployee) {
  //   if (hasLocalStorageEmployee) {
  //     hasLocalStorageEmployee = JSON.parse(hasLocalStorageEmployee);
  //     apiUrl = `/api/employee/update/${hasLocalStorageEmployee._id}`;
  //     method = "PATCH";
  //   } else {
  //     confirmBtn.textContent = "Confirm";
  //     confirmBtn.disabled = true;
  //     return alert("You have start shift fist");
  //   }
  // }
  fetch("/api/employee/update", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then(res => res.json())
    .then(res => {
      confirmBtn.textContent = "Confirm";
      confirmBtn.disabled = false;
      if (res.success) {
        confirmBtn.disabled = true;
        nameInput.value = "";
        siteNameInput.value = "";
        PIN.value = "";
        sessionStorage.setItem("employee", JSON.stringify(res.data));
        checkAndUpdateEmployee(res.data);
        closeBtn.click();
      } else {
        alert(res.message);
      }
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
  confirmBtn.textContent = "Confirm";
  confirmBtn.disabled = false;
  console.warn(`ERROR(${err.code}): ${err.message}`);
};
const report = state => {
  console.log("Permission " + state);
};
const confirmButtonHandler = () => {
  if (!nameInput.value.trim()) {
    return alert("name in required");
  } else if (!PIN.value.trim()) {
    return alert("PIN is required!");
  } else if (!siteNameInput.value.trim()) {
    return alert("site name is required");
  }

  navigator.permissions.query({ name: "geolocation" }).then(function (result) {
    if (result.state === "granted") {
      navigator.geolocation.getCurrentPosition(revealPosition, positionDenied);
    } else if (result.state === "prompt") {
      navigator.geolocation.getCurrentPosition(revealPosition, positionDenied);
    } else if (result.state === "denied") {
      alert("you should allow location");
    }
    result.onchange = function () {
      report(result.state);
    };
  });
};
const siteNameInputChangeHandler = e => {
  if (e.target.value.length > 0) {
    confirmBtn.disabled = false;
  } else {
    confirmBtn.disabled = true;
  }
};
confirmBtn.addEventListener("click", confirmButtonHandler);
siteNameInput.addEventListener("input", siteNameInputChangeHandler);
