// Search input
$("#searchInp").on("keyup", function () {
  searchActiveTable();
});

// Refresh button
$("#refreshBtn").click(function () {
  $("#searchInp").val("");

  if ($("#personnelBtn").hasClass("active")) {
    loadPersonnelTable();
  } else if ($("#departmentsBtn").hasClass("active")) {
    loadDepartmentTable();
  } else if ($("#locationsBtn").hasClass("active")) {
    loadLocationTable();
  }
});

// Filter button
$("#filterBtn").click(function () {
  $("#searchInp").val("");

  const filterModal = new bootstrap.Modal(
    document.getElementById("filterModal")
  );
  filterModal.show();
});

// Add button
$("#addBtn").click(function () {
  handleAddClick();
});

// enable/disable filter button
function updateFilterButtonState() {
  const isPersonnel = $("#personnelBtn").hasClass("active");
  $("#filterBtn").prop("disabled", !isPersonnel);
}

// Tab buttons
$("#personnelBtn").click(function () {
  $("#searchInp").val("");
  loadPersonnelTable();
  updateFilterButtonState();
});

$("#departmentsBtn").click(function () {
  $("#searchInp").val("");
  loadDepartmentTable();
  updateFilterButtonState();
});

$("#locationsBtn").click(function () {
  $("#searchInp").val("");
  loadLocationTable();
  updateFilterButtonState();
});

// Load personnel by default
$(document).ready(function () {
  loadPersonnelTable();
});

// ===== personnel =====

// loads personnel records
function loadPersonnelTable() {
  $.ajax({
    url: "php/getAllPersonnel.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      if (result.status.code === "200") {
        const tbody = document.getElementById("personnelTableBody");
        tbody.innerHTML = "";
        const frag = document.createDocumentFragment();

        result.data.forEach((person) => {
          const row = document.createElement("tr");

          const name = document.createElement("td");
          name.className = "align-middle text-nowrap";
          name.textContent = `${person.lastName}, ${person.firstName}`;
          row.appendChild(name);

          const dept = document.createElement("td");
          dept.className = "align-middle text-nowrap d-none d-md-table-cell";
          dept.textContent = person.department;
          row.appendChild(dept);

          const loc = document.createElement("td");
          loc.className = "align-middle text-nowrap d-none d-md-table-cell";
          loc.textContent = person.location;
          row.appendChild(loc);

          const email = document.createElement("td");
          email.className = "align-middle text-nowrap d-none d-md-table-cell";
          email.textContent = person.email;
          row.appendChild(email);

          const actions = document.createElement("td");
          actions.className = "text-end text-nowrap";
          actions.innerHTML = `
            <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="${person.id}">
              <i class="fa-solid fa-pencil fa-fw"></i>
            </button>
            <button type="button" class="btn btn-primary btn-sm deletePersonnelBtn" data-id="${person.id}" data-name="${person.firstName} ${person.lastName}">
              <i class="fa-solid fa-trash fa-fw"></i>
            </button>
          `;
          row.appendChild(actions);

          frag.appendChild(row);
        });

        tbody.appendChild(frag);
      } else {
        alert("Failed to load personnel data.");
      }
    },
    error: function () {
      alert("Error contacting the server.");
    },
  });
}

// Search bar
function searchActiveTable() {
  const input = $("#searchInp").val().toLowerCase().trim().replace(/\s+/g, " ");
  let anyVisible = false;
  let $rows;

  if ($("#personnelBtn").hasClass("active")) {
    $rows = $("#personnelTableBody tr");
  } else if ($("#departmentsBtn").hasClass("active")) {
    $rows = $("#departmentTableBody tr");
  } else if ($("#locationsBtn").hasClass("active")) {
    $rows = $("#locationTableBody tr");
  }

  $rows.each(function () {
    const rowText = $(this).text().toLowerCase().replace(/\s+/g, " ");
    const rowWords = rowText.split(/[\s,]+/);
    const inputWords = input.split(" ");

    const match = inputWords.every((word) =>
      rowWords.some((rowWord) => rowWord.includes(word))
    );

    $(this).toggle(match);
    if (match) anyVisible = true;
  });

  $("#noMatchesMessage").toggle(!anyVisible);
}

// filters personnel table rows based on selected department OR location
function filterPersonnelTable() {
  const dept = $("#filterDepartment").val().toLowerCase();
  const loc = $("#filterLocation").val().toLowerCase();

  let anyVisible = false;

  $("#personnelTableBody tr").each(function () {
    const rowText = $(this).text().toLowerCase();

    let match = false;
    if (dept && !loc) {
      match = rowText.includes(dept);
    } else if (loc && !dept) {
      match = rowText.includes(loc);
    } else if (!dept && !loc) {
      match = true;
    }

    $(this).toggle(match);
    if (match) anyVisible = true;
  });

  $("#noMatchesMessage").toggle(!anyVisible);
}

// Apply filter when department changes
$("#filterDepartment").on("change", function () {
  if ($(this).val()) {
    $("#filterLocation").val("");
  }
  filterPersonnelTable();
});

// Apply filter when location changes
$("#filterLocation").on("change", function () {
  if ($(this).val()) {
    $("#filterDepartment").val("");
  }
  filterPersonnelTable();
});

// Preserve selected filter values and rebuild dropdowns when filter modal opens
$("#filterModal").on("show.bs.modal", function () {
  const selectedDept = $("#filterDepartment").val();
  const selectedLoc = $("#filterLocation").val();

  populateAllDepartments(() => {
    $("#filterDepartment").val(selectedDept);
  });

  populateAllLocations(() => {
    $("#filterLocation").val(selectedLoc);
  });
});

// ===== handlers =====

function handleAddClick() {
  let modalId = null;

  if ($("#personnelBtn").hasClass("active")) {
    modalId = "addPersonnelModal";
  } else if ($("#departmentsBtn").hasClass("active")) {
    modalId = "addDepartmentModal";
  } else if ($("#locationsBtn").hasClass("active")) {
    modalId = "addLocationModal";
  }

  if (modalId) {
    const modal = new bootstrap.Modal(document.getElementById(modalId), {
      backdrop: false,
    });
    modal.show();
  }
}

// Utility to repopulate all departments
function populateAllDepartments(callback) {
  $.getJSON("php/getAllDepartments.php", function (res) {
    const deptSelect = $("#filterDepartment");

    deptSelect.html('<option value="">All</option>');
    res.data.forEach((dept) => {
      deptSelect.append(
        `<option value="${dept.department}">${dept.department}</option>`
      );
    });
    if (typeof callback === "function") callback();
  });
}

// Utility to repopulate all locations
function populateAllLocations(callback) {
  $.getJSON("php/getAllLocations.php", function (res) {
    const locSelect = $("#filterLocation");

    locSelect.html('<option value="">All</option>');
    res.data.forEach((loc) => {
      locSelect.append(`<option value="${loc.name}">${loc.name}</option>`);
    });
    if (typeof callback === "function") callback();
  });
}

// ===== departments =====

function loadDepartmentTable() {
  $.ajax({
    url: "php/getAllDepartments.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      if (result.status.code == "200") {
        const tbody = document.getElementById("departmentTableBody");
        tbody.innerHTML = "";
        const frag = document.createDocumentFragment();

        result.data.forEach((dept) => {
          const row = document.createElement("tr");

          const name = document.createElement("td");
          name.className = "align-middle text-nowrap";
          name.textContent = dept.department;
          row.appendChild(name);

          const loc = document.createElement("td");
          loc.className = "align-middle text-nowrap d-none d-md-table-cell";
          loc.textContent = dept.location;
          row.appendChild(loc);

          const actions = document.createElement("td");
          actions.className = "align-middle text-end text-nowrap";
          actions.innerHTML = `
            <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id="${dept.id}">
              <i class="fa-solid fa-pencil fa-fw"></i>
            </button>
            <button type="button" class="btn btn-primary btn-sm deleteDepartmentBtn" data-id="${dept.id}">
              <i class="fa-solid fa-trash fa-fw"></i>
            </button>
          `;
          row.appendChild(actions);

          frag.appendChild(row);
        });

        tbody.appendChild(frag);
      } else {
        showToast("Failed to load departments.", "error");
      }
    },
    error: function () {
      showToast("Server error loading departments.", "error");
    },
  });
}

// ===== locations =====

function loadLocationTable() {
  $.ajax({
    url: "php/getAllLocations.php",
    type: "GET",
    dataType: "json",
    success: function (res) {
      if (res.status.code == 200) {
        const tbody = document.getElementById("locationTableBody");
        tbody.innerHTML = "";
        const frag = document.createDocumentFragment();

        res.data.forEach((loc) => {
          const row = document.createElement("tr");

          const name = document.createElement("td");
          name.className = "align-middle text-nowrap";
          name.textContent = loc.name;
          row.appendChild(name);

          const actions = document.createElement("td");
          actions.className = "align-middle text-end text-nowrap";
          actions.innerHTML = `
            <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id="${loc.id}">
              <i class="fa-solid fa-pencil fa-fw"></i>
            </button>
            <button type="button" class="btn btn-primary btn-sm deleteLocationBtn" data-id="${loc.id}">
              <i class="fa-solid fa-trash fa-fw"></i>
            </button>
          `;
          row.appendChild(actions);

          frag.appendChild(row);
        });

        tbody.appendChild(frag);
      } else {
        showToast("Failed to load locations.", "error");
      }
    },
    error: function () {
      showToast("Server error loading locations.", "error");
    },
  });
}

// ===== toast =====

function showToast(message, type = "success") {
  const toastContainer = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  const bgClass = type === "error" ? "bg-danger" : "bg-success";

  toast.className = `toast align-items-center text-white ${bgClass} border-0 show`;
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");

  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ${message}
      </div>
      <button 
        type="button" 
        class="btn-close btn-close-white me-2 m-auto" 
        data-bs-dismiss="toast" 
        aria-label="Close">
      </button>
    </div>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove("show");
    toast.addEventListener("transitionend", () => toast.remove());
  }, 2000);
}

// ===== location Modal =====

// Create Location Modal
$("#addLocationModal").on("show.bs.modal", function () {
  $("#addLocationForm")[0].reset();
});

// Add Location Modal (reset form on close)
$("#addLocationModal").on("hidden.bs.modal", function () {
  $("#addLocationForm")[0].reset();
});

// Add Location Form Submission
$("#addLocationForm").on("submit", function (e) {
  e.preventDefault();

  const payload = {
    name: $("#addLocationName").val(),
  };

  $.ajax({
    url: "php/insertLocation.php",
    type: "POST",
    dataType: "json",
    data: payload,
    success: function (res) {
      if (res.status.code === "200") {
        $("#addLocationModal").modal("hide");
        loadLocationTable();
        $("#addLocationForm")[0].reset();
        showToast("Location added successfully");
      } else if (res.status.code === "409") {
        showToast("This location already exists.", "error");
      } else {
        showToast("Failed to add location.", "error");
      }
    },
    error: function () {
      showToast("Server error during location add.", "error");
    },
  });
});

// Edit Location Modal
$("#editLocationModal").on("show.bs.modal", function (e) {
  const id = $(e.relatedTarget).data("id");

  $.ajax({
    url: "php/getLocationByID.php",
    type: "POST",
    dataType: "json",
    data: { id },
    success: function (res) {
      if (res.status.code === "200") {
        const location = res.data[0];
        $("#editLocationID").val(location.id);
        $("#editLocationName").val(location.name);
      } else {
        showToast("Failed to retrieve location data.", "error");
      }
    },
    error: function () {
      showToast("Server error while fetching location.", "error");
    },
  });
});

// Edit Location Modal (reset form on close)
$("#editLocationModal").on("hidden.bs.modal", function () {
  $("#editLocationForm")[0].reset();
});

// Edit Location Form Submission
$("#editLocationForm").on("submit", function (e) {
  e.preventDefault();

  const payload = {
    id: $("#editLocationID").val(),
    name: $("#editLocationName").val(),
  };

  $.ajax({
    url: "php/updateLocation.php",
    type: "POST",
    dataType: "json",
    data: payload,
    success: function (res) {
      if (res.status.code === "200") {
        $("#editLocationModal").modal("hide");
        loadLocationTable();
        showToast("Location updated successfully");
      } else {
        showToast("Failed to update location.", "error");
      }
    },
    error: function () {
      showToast("Server error while updating location.", "error");
    },
  });
});

// Delete Location Modal
// Intercept delete location button click
$(document).on("click", ".deleteLocationBtn", function () {
  const id = $(this).data("id");

  $.ajax({
    url: "php/getLocationByID.php",
    type: "POST",
    dataType: "json",
    data: { id },
    success: function (res) {
      const location = res.data[0];

      if (location.departmentCount > 0) {
        // Show blocker modal with injected message
        $("#cannotDeleteLocationMessage").html(
          `You cannot remove the location <strong>${location.name}</strong> because it is assigned to <strong>${location.departmentCount}</strong> departments.`
        );
        const blocker = new bootstrap.Modal("#cannotDeleteLocationModal", {
          backdrop: false,
        });
        blocker.show();
      } else {
        // Show confirmation modal
        $("#deleteLocationID").val(location.id);
        $("#deleteLocationName").text(location.name);
        const confirm = new bootstrap.Modal("#deleteLocationModal", {
          backdrop: false,
        });
        confirm.show();
      }
    },
    error: function () {
      showToast("Error fetching location data.", "error");
    },
  });
});

// Reset form when modal is closed
$("#deleteLocationModal").on("hidden.bs.modal", function () {
  $("#deleteLocationID").val("");
  $("#deleteLocationName").text("");
});

// Delete location form
$(document).on("submit", "#deleteLocationForm", function (e) {
  e.preventDefault(); // prevent full-page reload

  const id = $("#deleteLocationID").val();

  $.ajax({
    url: "php/deleteLocation.php",
    type: "POST",
    dataType: "json",
    data: { id },
    success: function (res) {
      if (res.status.code == 200) {
        showToast("Location deleted successfully.", "success");
        $("#deleteLocationModal").modal("hide");
        loadLocationTable(); // refresh table
      } else {
        showToast("Failed to delete location.", "error");
      }
    },
    error: function () {
      showToast("Server error deleting location.", "error");
    },
  });
});

// ===== department Modal =====

// Add Department Modal
$("#addDepartmentModal").on("show.bs.modal", function () {
  $.getJSON("php/getAllLocations.php", function (res) {
    const locationSelect = $("#addLocationSelect");
    locationSelect.find("option:not(:first)").remove();

    res.data.forEach((loc) => {
      locationSelect.append(`<option value="${loc.id}">${loc.name}</option>`);
    });
  });
});

// Add Department Modal (reset form on close)
$("#addDepartmentModal").on("hidden.bs.modal", function () {
  $("#addDepartmentForm")[0].reset();
});

// Add Department Form Submission
$("#addDepartmentForm").on("submit", function (e) {
  e.preventDefault();

  const payload = {
    name: $("#addDepartmentName").val(),
    locationID: $("#addLocationSelect").val(),
  };

  $.ajax({
    url: "php/insertDepartment.php",
    type: "POST",
    dataType: "json",
    data: payload,
    success: function (res) {
      if (res.status.code === "200") {
        $("#addDepartmentModal").modal("hide");
        loadDepartmentTable();
        $("#addDepartmentForm")[0].reset();
        showToast("Department added successfully");
      } else if (res.status.code === "409") {
        showToast("Department already exists in this location", "error");
      } else {
        showToast("Failed to add department", "error");
      }
    },
    error: function () {
      showToast("Server error adding department", "error");
    },
  });
});

// Edit Department Modal
$("#editDepartmentModal").on("show.bs.modal", function (e) {
  const deptId = $(e.relatedTarget).data("id");

  $.ajax({
    url: "php/getDepartmentByID.php",
    type: "POST",
    dataType: "json",
    data: { id: deptId },
    success: function (res) {
      if (res.status.code === "200") {
        const dept = res.data[0];
        $("#editDepartmentID").val(dept.id);
        $("#editDepartmentName").val(dept.name);

        $.getJSON("php/getAllLocations.php", function (locRes) {
          const select = $("#editDepartmentLocation");
          select.find("option:not(:first)").remove();

          locRes.data.forEach((loc) => {
            select.append(`<option value="${loc.id}">${loc.name}</option>`);
          });
          select.val(dept.locationID);
        });
      } else {
        showToast("Failed to load department data", "error");
      }
    },
    error: function () {
      showToast("Server error loading department", "error");
    },
  });
});

// Edit Department Modal (reset form on close)
$("#editDepartmentModal").on("hidden.bs.modal", function () {
  $("#editDepartmentForm")[0].reset();
});

// Edit Department Form Submission
$("#editDepartmentForm").on("submit", function (e) {
  e.preventDefault();

  const payload = {
    id: $("#editDepartmentID").val(),
    name: $("#editDepartmentName").val(),
    locationID: $("#editDepartmentLocation").val(),
  };

  $.ajax({
    url: "php/updateDepartment.php",
    type: "POST",
    dataType: "json",
    data: payload,
    success: function (res) {
      if (res.status.code === "200") {
        $("#editDepartmentModal").modal("hide");
        loadDepartmentTable();
        showToast("Department updated successfully");
      } else {
        showToast("Failed to update department", "error");
      }
    },
    error: function () {
      showToast("Server error updating department", "error");
    },
  });
});

// Delete Department Modal
$(document).on("click", ".deleteDepartmentBtn", function () {
  const id = $(this).data("id");

  $.post("php/getDepartmentByID.php", { id }, function (res) {
    const department = res?.data?.[0];

    if (!department) {
      showToast("Department not found.", "error");
      return;
    }

    if (department.personnelCount > 0) {
      $("#cannotDeleteDepartmentMessage").html(
        `You cannot remove the department <strong>${department.name}</strong> because it is assigned to <strong>${department.personnelCount}</strong> personnel.`
      );
      new bootstrap.Modal("#cannotDeleteDepartmentModal").show();
    } else {
      $("#deleteDepartmentID").val(department.id);
      $("#deleteDepartmentName").text(department.name);
      new bootstrap.Modal("#deleteDepartmentModal").show();
    }
  }).fail(function () {
    showToast("Error fetching department data.", "error");
  });
});

// Delete department form
$("#deleteDepartmentForm").on("submit", function (e) {
  e.preventDefault();

  const id = $("#deleteDepartmentID").val();

  $.post("php/deleteDepartment.php", { id }, function () {
    bootstrap.Modal.getInstance(
      document.getElementById("deleteDepartmentModal")
    ).hide();

    showToast("Department deleted successfully.", "success");
    loadDepartmentTable();
  }).fail(function () {
    showToast("Failed to delete department.", "error");
  });
});

// Reset form when modal is closed
$("#deleteDepartmentModal").on("hidden.bs.modal", function () {
  $("#deleteDepartmentID").val("");
  $("#deleteDepartmentName").text("");
});

// ===== personnel Modal =====

// Add Personnel Modal
$("#addPersonnelModal").on("show.bs.modal", function () {
  $("#searchInp").val("");
  $.getJSON("php/getAllDepartments.php", function (res) {
    const deptSelect = $("#addDepartment");
    deptSelect.find("option:not(:first)").remove();

    res.data.forEach((d) => {
      deptSelect.append(`<option value="${d.id}">${d.department}</option>`);
    });
  });
});

// Add Personnel Modal (reset form on close)
$("#addPersonnelModal").on("hidden.bs.modal", function () {
  $("#addPersonnelForm")[0].reset();
});

// Add Personnel Form Submission
$("#addPersonnelForm").on("submit", function (e) {
  e.preventDefault();

  const payload = {
    firstName: $("#addFirstName").val(),
    lastName: $("#addLastName").val(),
    jobTitle: $("#addJobTitle").val(),
    email: $("#addEmail").val(),
    departmentID: $("#addDepartment").val(),
  };

  $.ajax({
    url: "php/insertPersonnel.php",
    type: "POST",
    dataType: "json",
    data: payload,
    success: function (res) {
      if (res.status.code === "200") {
        $("#addPersonnelModal").modal("hide");
        loadPersonnelTable();
        $("#addPersonnelForm")[0].reset();
        showToast("Personnel added successfully");
      } else if (res.status.code === "409") {
        showToast("Email address already exists", "error");
      } else {
        showToast("Failed to add personnel", "error");
      }
    },
    error: function () {
      showToast("Server error adding personnel", "error");
    },
  });
});

// Edit Personnel Modal
$("#editPersonnelModal").on("show.bs.modal", function (e) {
  $("#searchInp").val("");
  const id = $(e.relatedTarget).data("id");

  $.ajax({
    url: "php/getPersonnelByID.php",
    type: "POST",
    dataType: "json",
    data: { id },
    success: function (res) {
      if (res.status.code === "200") {
        const person = res.data.personnel[0];

        $("#editPersonnelEmployeeID").val(person.id);
        $("#editPersonnelFirstName").val(person.firstName);
        $("#editPersonnelLastName").val(person.lastName);
        $("#editPersonnelJobTitle").val(person.jobTitle);
        $("#editPersonnelEmailAddress").val(person.email);

        const deptSelect = $("#editPersonnelDepartment").empty();

        res.data.department.forEach((dept) => {
          deptSelect.append(
            $("<option>", {
              value: dept.id,
              text: dept.name,
            })
          );
        });

        if (person && deptSelect.length) {
          deptSelect.val(person.departmentID);
        }
      } else {
        showToast("Failed to load personnel data", "error");
      }
    },
    error: function () {
      showToast("Server error loading personnel", "error");
    },
  });
});

// Edit Personnel Modal (reset form on close)
$("#editPersonnelModal").on("hidden.bs.modal", function () {
  $("#editPersonnelForm")[0].reset();
});

// Edit Personnel Form Submission
$("#editPersonnelForm").on("submit", function (e) {
  e.preventDefault();

  const payload = {
    id: $("#editPersonnelEmployeeID").val(),
    firstName: $("#editPersonnelFirstName").val(),
    lastName: $("#editPersonnelLastName").val(),
    jobTitle: $("#editPersonnelJobTitle").val(),
    email: $("#editPersonnelEmailAddress").val(),
    departmentID: $("#editPersonnelDepartment").val(),
  };

  $.ajax({
    url: "php/updatePersonnel.php",
    type: "POST",
    dataType: "json",
    data: payload,
    success: function (res) {
      if (res.status.code === "200") {
        $("#editPersonnelModal").modal("hide");
        loadPersonnelTable();
        showToast("Personnel updated successfully");
      } else {
        showToast("Failed to update personnel", "error");
      }
    },
    error: function () {
      showToast("Server error updating personnel", "error");
    },
  });
});

// Delete Personnel Modal
$(document).on("click", ".deletePersonnelBtn", function () {
  const id = $(this).data("id");
  const fullName = $(this).data("name"); // e.g., "Carlos Buitrago"

  $("#deletePersonnelID").val(id);
  $("#deletePersonnelName").text(fullName);

  const modalEl = document.getElementById("deletePersonnelModal");
  const modal = new bootstrap.Modal(modalEl, { backdrop: false });
  modal.show();
});

// Reset form when modal is closed
$("#deletePersonnelModal").on("hidden.bs.modal", function () {
  $("#deletePersonnelID").val("");
  $("#deletePersonnelName").text("");
});

// Handle form submission for personnel deletion
$("#deletePersonnelForm").on("submit", function (e) {
  e.preventDefault();

  const id = $("#deletePersonnelID").val();

  $.ajax({
    url: "php/deletePersonnel.php",
    type: "POST",
    dataType: "json",
    data: { id },
    success: function (res) {
      if (res.status.code === "200") {
        const modalEl = document.getElementById("deletePersonnelModal");
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();

        loadPersonnelTable();
        showToast("Personnel deleted successfully");
      } else {
        showToast("Failed to delete personnel", "error");
      }
    },
    error: function () {
      showToast("Server error during personnel deletion", "error");
    },
  });
});
