"use strict";
const validateEmail = email => {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};
/*
==============
ADMIN
==============
*/
//DATE RANGE SELEC
function dateSelected(start, end, label) {
  console.log(location.pathname);
  location.assign(`${location.pathname}?start=${start._d}&end=${end._d}`);
}

$('input[name="daterange"]').daterangepicker(
  {
    opens: "center",
  },
  dateSelected
);

// update credentials
const email = document.getElementById("email");
const currPass = document.getElementById("currPass");
const newPass = document.getElementById("newPass");
const confirmPassword = document.getElementById("confirmPassword");
const profileForm = document.getElementById("profileForm");
const updateBtn = document.getElementById("updateBtn");
const siteOpt = document.getElementById("siteOptions");
const employeeOpt = document.getElementById("employeeOpt");

function profileUpdateHandler(e) {
  e.preventDefault();
  if (!email.value.trim()) {
    return alert("email is required");
  } else if (!validateEmail(email.value)) {
    return alert("Invalid email address!");
  } else if (!currPass.value.trim()) {
    return alert("Current password is required");
  } else if (!newPass.value.trim()) {
    return alert("New Password is required");
  } else if (newPass.value.trim().length < 8) {
    return alert("New Password must be 8 or more character");
  } else if (newPass.value !== confirmPassword.value) {
    return alert("password are not match!");
  }
  updateBtn.disabled = true;
  updateBtn.value = "Updating...";
  const body = {
    email: email.value,
    currentPass: currPass.value,
    newPass: newPass.value,
  };
  fetch("/admin/api/update-credentials", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify(body),
  })
    .then(res => res.json())
    .then(res => {
      updateBtn.disabled = false;
      updateBtn.value = "Update";
      if (res.success) {
        alert("profile updated");
      } else if (!res.success) {
        alert(res.message);
      }
    })
    .catch(err => {
      updateBtn.disabled = false;
      updateBtn.value = "Update";
      console.log(err);
    });
}

if (profileForm) {
  profileForm.addEventListener("submit", profileUpdateHandler);
}

function siteChangeHandler(e) {
  location.assign(e.target.value);
}

if (siteOpt) {
  siteOpt.addEventListener("change", siteChangeHandler);
}
function employeeChangeHandler(e) {
  location.assign(e.target.value);
}
if (employeeOpt) {
  employeeOpt.addEventListener("change", employeeChangeHandler);
}
