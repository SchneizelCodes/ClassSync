const page = document.body.dataset.page;
const navLinks = Array.from(document.querySelectorAll(".student-nav .nav-item"));
let toastContainer = document.querySelector(".toast-container");
let modalOverlay = document.querySelector(".modal-overlay");

navLinks.forEach((link) => {
  if (link.dataset.target === page) {
    link.classList.add("active");
  }
});

const ensureToast = () => {
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }
};

const showToast = (message, tone = "info") => {
  ensureToast();
  const toast = document.createElement("div");
  toast.className = `toast ${tone === "success" ? "success" : tone === "error" ? "error" : ""}`;
  toast.textContent = message;
  toastContainer.innerHTML = "";
  toastContainer.appendChild(toast);
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toastContainer.innerHTML = "";
  }, 2400);
};

const ensureModal = () => {
  if (!modalOverlay) {
    modalOverlay = document.createElement("div");
    modalOverlay.className = "modal-overlay";
    modalOverlay.innerHTML = `
      <div class="modal-card">
        <h3 id="modal-title"></h3>
        <p id="modal-body"></p>
        <div class="modal-actions">
          <button type="button" id="modal-close">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(modalOverlay);
    modalOverlay.addEventListener("click", (event) => {
      if (event.target === modalOverlay) {
        closeModal();
      }
    });
    modalOverlay.querySelector("#modal-close").addEventListener("click", closeModal);
  }
};

const openModal = (title, body) => {
  ensureModal();
  modalOverlay.querySelector("#modal-title").textContent = title;
  modalOverlay.querySelector("#modal-body").textContent = body;
  modalOverlay.classList.add("active");
};

const closeModal = () => {
  if (modalOverlay) {
    modalOverlay.classList.remove("active");
  }
};

const setRowStatus = (row, status) => {
  const buttons = Array.from(row.querySelectorAll(".status-btn"));
  buttons.forEach((btn) => {
    btn.classList.remove("active");
  });
  const target = row.querySelector(`.status-btn.${status}`);
  if (target) {
    target.classList.add("active");
  }
};

document.addEventListener("click", (event) => {
  const statusBtn = event.target.closest(".status-btn");
  if (statusBtn) {
    const row = statusBtn.closest(".table-row");
    if (!row) return;
    const status = statusBtn.classList.contains("present")
      ? "present"
      : statusBtn.classList.contains("late")
      ? "late"
      : "absent";
    setRowStatus(row, status);
  }

  const actionBtn = event.target.closest("[data-action]");
  if (!actionBtn) return;

  const action = actionBtn.dataset.action;
  switch (action) {
    case "record-attendance":
      window.location.href = "student-attendance.html";
      break;
    case "view-history":
      window.location.href = "student-reports.html";
      break;
    case "filter-schedule":
    case "filter-attendance":
    case "filter-reports":
      openModal("Filter", "Filter options are mocked in this static layout.");
      break;
    case "all-present":
      document.querySelectorAll(".table-row").forEach((row) => setRowStatus(row, "present"));
      showToast("All students marked Present.", "success");
      break;
    case "all-late":
      document.querySelectorAll(".table-row").forEach((row) => setRowStatus(row, "late"));
      showToast("All students marked Late.", "success");
      break;
    case "all-absent":
      document.querySelectorAll(".table-row").forEach((row) => setRowStatus(row, "absent"));
      showToast("All students marked Absent.", "success");
      break;
    case "cancel-attendance":
      openModal("Attendance Cancelled", "No changes were saved (mock).");
      break;
    case "save-attendance":
      showToast("Attendance saved.", "success");
      break;
    case "view-report":
      openModal("Report Viewer", "Opening detailed report (mock).");
      break;
    case "chip-toggle":
      actionBtn.classList.toggle("active");
      break;
    case "logout":
      showToast("Logged out (mock).", "success");
      break;
    case "settings":
      openModal("Settings", "Settings panel is not implemented yet.");
      break;
    case "login-pill":
    case "sign-in":
      showToast("Signed in (mock).", "success");
      window.location.href = "student-dashboard.html";
      break;
    case "forgot-password":
      openModal("Password Reset", "Password reset flow is mocked.");
      break;
    default:
      break;
  }
});
