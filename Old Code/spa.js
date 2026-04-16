const navButtons = Array.from(document.querySelectorAll(".nav-btn"));
const views = Array.from(document.querySelectorAll(".view"));
const toast = document.getElementById("toast");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
const modalCancel = document.getElementById("modal-cancel");

const setActiveView = (viewName) => {
  views.forEach((view) => {
    const isActive = view.dataset.view === viewName;
    view.classList.toggle("hidden", !isActive);
  });

  navButtons.forEach((btn) => {
    const isActive = btn.dataset.view === viewName;
    btn.classList.toggle("nav-active", isActive);
    btn.setAttribute("aria-current", isActive ? "page" : "false");
  });

  if (viewName) {
    window.location.hash = viewName;
  }
};

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    setActiveView(btn.dataset.view);
  });
});

const hashView = window.location.hash.replace("#", "");
if (hashView) {
  setActiveView(hashView);
}

const showToast = (message, tone = "info") => {
  if (!toast) return;
  const toneClass =
    tone === "success"
      ? "bg-emerald-600"
      : tone === "error"
      ? "bg-rose-600"
      : "bg-slate-900";
  toast.innerHTML = `<div class="${toneClass} text-white px-4 py-3 rounded-xl shadow-lg text-sm">${message}</div>`;
  toast.classList.remove("hidden");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.add("hidden");
  }, 2600);
};

const openModal = (title, body) => {
  if (!modal) return;
  modalTitle.textContent = title;
  modalBody.textContent = body;
  modal.classList.remove("hidden");
  modal.classList.add("flex");
};

const closeModal = () => {
  if (!modal) return;
  modal.classList.add("hidden");
  modal.classList.remove("flex");
};

if (modalCancel) {
  modalCancel.addEventListener("click", closeModal);
}

document.querySelectorAll("[data-toggle-group]").forEach((group) => {
  group.addEventListener("click", (event) => {
    const button = event.target.closest(".toggle-btn");
    if (!button) return;
    const row = button.closest("tr");
    if (!row) return;
    row.querySelectorAll(".toggle-btn").forEach((btn) => {
      btn.classList.remove("ring-2", "ring-slate-400");
    });
    button.classList.add("ring-2", "ring-slate-400");
  });
});

const actionHandlers = {
  "view-allocation": () => {
    setActiveView("scheduling");
    showToast("Jumped to Scheduling Interface.", "success");
  },
  "add-instructor": () => {
    const name = document.getElementById("inst-name")?.value.trim();
    const dept = document.getElementById("inst-dept")?.value.trim();
    const email = document.getElementById("inst-email")?.value.trim();
    if (!name || !dept || !email) {
      showToast("Fill in name, department, and email first.", "error");
      return;
    }
    openModal("Instructor Added", `${name} (${dept}) has been added (mock).`);
  },
  "update-instructor": () => {
    openModal("Profile Updated", "Instructor profile updated (mock).");
  },
  "remove-instructor": () => {
    openModal("Instructor Removed", "Instructor removed from roster (mock).");
  },
  "add-class": () => {
    openModal("Class Added", "Schedule entry created (mock).");
  },
  "resolve-conflicts": () => {
    openModal("Conflict Resolver", "2 schedule conflicts flagged for review (mock).");
  },
  "save-attendance": () => {
    showToast("Attendance draft saved.", "success");
  },
  "submit-attendance": async () => {
    const session = document.getElementById("att-session")?.value ?? "";
    const date = document.getElementById("att-date")?.value ?? "";
    const instructor = document.getElementById("att-instructor")?.value ?? "";
    const rows = Array.from(document.querySelectorAll("[data-toggle-group] tr"));
    const records = rows.map((row) => {
      const student = row.querySelector("td")?.textContent.trim() ?? "";
      const id = row.querySelectorAll("td")[1]?.textContent.trim() ?? "";
      const active = row.querySelector(".toggle-btn.ring-2");
      const status = active ? active.textContent.trim() : "Present";
      return { student, id, status };
    });

    const payload = { session, date, instructor, records };

    try {
      const response = await fetch("api/index.php?action=log-attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Network error");
      const data = await response.json();
      showToast(data.message || "Attendance submitted.", "success");
    } catch (err) {
      showToast("Attendance submitted (offline mock).", "success");
    }
  },
  "generate-pdf": () => {
    openModal("Report Generated", "Schedule PDF generated (mock).");
  },
  "view-history": () => {
    openModal("Attendance History", "Showing last 4 weeks (mock).");
  },
  "export-reports": () => {
    showToast("Reports exported.", "success");
  },
};

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const action = button.dataset.action;
  const handler = actionHandlers[action];
  if (handler) {
    handler();
  }
});
