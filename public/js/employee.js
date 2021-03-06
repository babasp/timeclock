"use strict";
/*
==============
EMPLOYEE
==============
*/
const API_KEY = "66df9346682848d7b78ae830a4191514"; //my
// const API_KEY = "d9e53816d07345139c58d0ea733e3870"; // out
const confirmBtn = document.getElementById("confirmBtn");
const closeBtn = document.querySelector("[data-bs-dismiss]");
const siteNameInput = document.getElementById("siteNameInput");
const nameInput = document.getElementById("nameInput");
const PIN = document.getElementById("PIN");
const table = document.querySelector(".table");
const siteHeading = document.querySelector(".site-heading");

let hasLocalStorageEmployee = localStorage.getItem("employee");

const formateDateAndTime = time => {
  return time ? moment(time).format("MM-DD-YYYY HH:mm A") : "-";
};
const checkAndUpdateEmployee = data => {
  table.classList.remove("d-none");
  siteHeading.classList.remove("d-none");
  siteHeading.querySelector("div h3").textContent = "Site: " + data.site;
  const tbody = table.querySelector("tbody");

  tbody.innerHTML = `<tr>
        <td>${data.employeeName}</td>
        <td>${data.employeePin}</td>
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
  hasLocalStorageEmployee = localStorage.getItem("employee");
  if (hasLocalStorageEmployee) {
    hasLocalStorageEmployee = JSON.parse(hasLocalStorageEmployee);
    confirmBtn.disabled = false;
    PIN.value = hasLocalStorageEmployee.employeePin;
    nameInput.value = hasLocalStorageEmployee.employeeName;
    siteNameInput.value = hasLocalStorageEmployee.site;
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

  // hasLocalStorageEmployee = localStorage.getItem("employee");
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
        localStorage.setItem("employee", JSON.stringify(res.data));
        checkAndUpdateEmployee(res.data);
        console.log(res.data);
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
function confirmButtonHandler(e) {
  // e.preventDefault();
  hasLocalStorageEmployee = localStorage.getItem("employee");
  if (!nameInput.value.trim()) {
    return alert("name in required");
  } else if (!PIN.value.trim()) {
    return alert("PIN is required!");
  } else if (!siteNameInput.value.trim()) {
    return alert("site name is required");
  }
  confirmBtn.textContent = "wait...";
  confirmBtn.disabled = true;
  fetch(
    `https://api.bigdatacloud.net/data/ip-geolocation-with-confidence?key=${API_KEY}`
  )
    .then(res => res.json())
    .then(res => {
      const body = {
        name: nameInput.value,
        [actionType]: new Date().toUTCString(),
        id: hasLocalStorageEmployee
          ? JSON.parse(hasLocalStorageEmployee)._id
          : null,
        pin: PIN.value.toLowerCase(),
        siteName: siteNameInput.value,
        location: {
          lat: res.location.latitude,
          lng: res.location.longitude,
        },
      };

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
            localStorage.setItem("employee", JSON.stringify(res.data));
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
    })
    .catch(err => {
      confirmBtn.textContent = "Confirm";
      confirmBtn.disabled = true;
      console.log(err);
    });
  // navigator.permissions.query({ name: "geolocation" }).then(function (result) {
  //   if (result.state === "granted") {
  //     navigator.geolocation.getCurrentPosition(revealPosition, positionDenied);
  //   } else if (result.state === "prompt") {
  //     navigator.geolocation.getCurrentPosition(revealPosition, positionDenied);
  //   } else if (result.state === "denied") {
  //     alert("you should allow location");
  //   }
  //   result.onchange = function () {
  //     report(result.state);
  //   };
  // });
}
const siteNameInputChangeHandler = e => {
  if (e.target.value.length > 0) {
    confirmBtn.disabled = false;
  } else {
    confirmBtn.disabled = true;
  }
};
// confirmBtn.addEventListener("click", confirmButtonHandler);
// confirmBtn.addEventListener("touchstart", confirmButtonHandler);
siteNameInput.addEventListener("input", siteNameInputChangeHandler);
