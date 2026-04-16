(function () {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  function qs(selector, root = document) {
    return root.querySelector(selector);
  }

  function qsa(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function setText(selector, value) {
    const node = qs(selector);
    if (node) {
      node.textContent = value;
    }
  }

  function formatDate(date, options) {
    return date.toLocaleDateString(undefined, options || {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function formatTime(date) {
    return date.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  function openModal(modal) {
    if (!modal) {
      return;
    }
    modal.classList.add('show');
  }

  function closeModal(modal) {
    if (!modal) {
      return;
    }
    modal.classList.remove('show');
  }

  function ensureToastArea() {
    let area = qs('[data-toast-area]');
    if (!area) {
      area = document.createElement('div');
      area.className = 'toast-area';
      area.setAttribute('data-toast-area', 'true');
      area.innerHTML = '<div class="toast" data-toast><strong></strong><p></p></div>';
      document.body.appendChild(area);
    }
    return area;
  }

  let toastTimer = null;
  function toast(message, tone, title) {
    const area = ensureToastArea();
    const box = qs('[data-toast]', area);
    if (!box) {
      return;
    }

    box.className = 'toast show ' + (tone || 'info');
    qs('strong', box).textContent = title || (tone === 'success' ? 'Success' : tone === 'error' ? 'Action blocked' : 'Notice');
    qs('p', box).textContent = message;
    area.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      box.className = 'toast';
      area.classList.remove('show');
    }, 2600);
  }

  function attachModalEvents() {
    qsa('[data-modal-close]').forEach(function (button) {
      button.addEventListener('click', function () {
        const target = button.getAttribute('data-modal-close');
        closeModal(qs(target));
      });
    });

    qsa('[data-modal-open]').forEach(function (button) {
      button.addEventListener('click', function () {
        const target = button.getAttribute('data-modal-open');
        openModal(qs(target));
      });
    });

    qsa('[data-backdrop]').forEach(function (backdrop) {
      backdrop.addEventListener('click', function (event) {
        if (event.target === backdrop) {
          closeModal(backdrop);
        }
      });
    });
  }

  function setInlineDate(selector, value) {
    const node = qs(selector);
    if (node) {
      node.textContent = value;
    }
  }

  function initUserLogin() {
    setInlineDate('[data-today]', 'Today is ' + formatDate(new Date()));

    const form = qs('[data-user-login-form]');
    if (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = qs('[name="email"]', form).value.trim();
        const password = qs('[name="password"]', form).value;

        if (!email || !password) {
          toast('Please enter your email and password.', 'error', 'Login failed');
          return;
        }

        if (!emailPattern.test(email)) {
          toast('Please enter a valid email address.', 'error', 'Login failed');
          return;
        }

        if (!passwordPattern.test(password)) {
          toast('Password must be at least 8 characters and include uppercase, lowercase, and a number.', 'error', 'Login failed');
          return;
        }

        window.localStorage.setItem('classsync.currentUser', email);
        window.location.href = 'UserDashboard.html';
      });
    }

    qsa('[data-user-forgot]').forEach(function (button) {
      button.addEventListener('click', function () {
        toast('Password reset instructions can be wired to your backend endpoint.', 'info', 'Forgot password');
      });
    });
  }

  function initAdminLogin() {
    setInlineDate('[data-today]', 'Today is ' + formatDate(new Date()));

    const views = qsa('[data-auth-panel]');
    function showAuthView(id) {
      views.forEach(function (panel) {
        panel.classList.toggle('active', panel.id === id);
      });
    }

    qsa('[data-switch-view]').forEach(function (button) {
      button.addEventListener('click', function () {
        showAuthView(button.getAttribute('data-switch-view'));
      });
    });

    const pinForm = qs('[data-pin-form]');
    if (pinForm) {
      pinForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const pin = qs('[name="pin"]', pinForm).value.trim();

        if (!/^\d{6}$/.test(pin)) {
          toast('Please enter a valid 6-digit PIN.', 'error', 'PIN required');
          return;
        }

        showAuthView('admin-login-panel');
      });
    }

    const loginForm = qs('[data-admin-login-form]');
    if (loginForm) {
      loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const email = qs('[name="email"]', loginForm).value.trim();
        const password = qs('[name="password"]', loginForm).value;

        if (!email || !password) {
          toast('Please enter your email and password.', 'error', 'Login failed');
          return;
        }

        if (!emailPattern.test(email)) {
          toast('Please enter a valid email address.', 'error', 'Login failed');
          return;
        }

        if (!passwordPattern.test(password)) {
          toast('Password must be at least 8 characters and include uppercase, lowercase, and a number.', 'error', 'Login failed');
          return;
        }

        window.localStorage.setItem('classsync.adminUser', email);
        window.location.href = 'AdminDashboard.html';
      });
    }

    const forgotForm = qs('[data-forgot-form]');
    if (forgotForm) {
      forgotForm.addEventListener('submit', function (event) {
        event.preventDefault();
        showAuthView('admin-reset-panel');
      });
    }

    const resetForm = qs('[data-reset-form]');
    if (resetForm) {
      resetForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const nextPassword = qs('[name="newPassword"]', resetForm).value;
        const confirmPassword = qs('[name="confirmPassword"]', resetForm).value;

        if (!nextPassword || !confirmPassword) {
          toast('Please complete both password fields.', 'error', 'Reset failed');
          return;
        }

        if (!passwordPattern.test(nextPassword)) {
          toast('Password must be at least 8 characters and include uppercase, lowercase, and a number.', 'error', 'Reset failed');
          return;
        }

        if (nextPassword !== confirmPassword) {
          toast('Passwords do not match.', 'error', 'Reset failed');
          return;
        }

        toast('Password updated. You can now log in with the new credentials.', 'success', 'Password updated');
        showAuthView('admin-login-panel');
      });
    }
  }

  function parseCycleValues(button) {
    try {
      return JSON.parse(button.getAttribute('data-cycle-values') || '[]');
    } catch (_error) {
      return [];
    }
  }

  function initUserDashboard() {
    const page = document.body;
    const now = new Date();

    setInlineDate('[data-today-long]', formatDate(now, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));

    const timeNode = qs('[data-live-time]');
    if (timeNode) {
      const tick = function () {
        timeNode.textContent = formatTime(new Date());
      };
      tick();
      window.setInterval(tick, 1000);
    }

    qsa('[data-logout]').forEach(function (button) {
      button.addEventListener('click', function () {
        window.location.href = 'UserLogin.html';
      });
    });

    qsa('[data-open-modal-message]').forEach(function (button) {
      button.addEventListener('click', function () {
        toast(button.getAttribute('data-open-modal-message'), 'info', 'Notice');
      });
    });
  }

  function initAdminDashboard() {
    setInlineDate('[data-admin-date]', formatDate(new Date(), {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));

    function setActiveView(view) {
      qsa('[data-admin-view]').forEach(function (button) {
        button.classList.toggle('active', button.getAttribute('data-admin-view') === view);
      });
      qsa('[data-admin-panel]').forEach(function (panel) {
        panel.classList.toggle('active', panel.getAttribute('data-admin-panel') === view);
      });
    }

    qsa('[data-admin-view]').forEach(function (button) {
      button.addEventListener('click', function () {
        setActiveView(button.getAttribute('data-admin-view'));
      });
    });

    setActiveView('overview');

    const adminSearch = qs('[data-admin-search]');
    if (adminSearch) {
      adminSearch.addEventListener('input', function () {
        const value = adminSearch.value.trim().toLowerCase();
        qsa('[data-admin-row]').forEach(function (row) {
          row.hidden = !row.textContent.toLowerCase().includes(value);
        });
      });
    }

    qsa('[data-admin-edit]').forEach(function (button) {
      button.addEventListener('click', function () {
        const row = button.closest('tr');
        if (!row) {
          return;
        }
        const form = qs('[data-admin-form]');
        if (!form) {
          return;
        }

        form.reset();
        qs('[name="fullName"]', form).value = row.getAttribute('data-full-name') || '';
        qs('[name="email"]', form).value = row.getAttribute('data-email') || '';
        qs('[name="section"]', form).value = row.getAttribute('data-section') || '';
        qs('[name="status"]', form).value = row.getAttribute('data-status') || 'Active';
        qs('[name="mode"]', form).value = 'edit';
        qs('[data-admin-submit-label]').textContent = 'Save Changes';
        openModal(qs('[data-admin-form-modal]'));
      });
    });

    qsa('[data-admin-delete]').forEach(function (button) {
      button.addEventListener('click', function () {
        const row = button.closest('tr');
        if (!row) {
          return;
        }
        if (window.confirm('Delete this instructor record?')) {
          row.remove();
          toast('Instructor removed from the list.', 'success', 'Deleted');
        }
      });
    });

    const addButton = qs('[data-open-admin-form]');
    if (addButton) {
      addButton.addEventListener('click', function () {
        const form = qs('[data-admin-form]');
        if (form) {
          form.reset();
          qs('[name="mode"]', form).value = 'create';
          qs('[data-admin-submit-label]').textContent = 'Save Instructor';
        }
        openModal(qs('[data-admin-form-modal]'));
      });
    }

    const adminForm = qs('[data-admin-form]');
    if (adminForm) {
      adminForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const mode = qs('[name="mode"]', adminForm).value;
        const fullName = qs('[name="fullName"]', adminForm).value.trim();
        const email = qs('[name="email"]', adminForm).value.trim();
        const section = qs('[name="section"]', adminForm).value.trim();
        const status = qs('[name="status"]', adminForm).value;

        if (!fullName || !email || !section) {
          toast('Please complete the instructor details.', 'error', 'Not saved');
          return;
        }

        if (!emailPattern.test(email)) {
          toast('Please enter a valid email address.', 'error', 'Not saved');
          return;
        }

        const tbody = qs('[data-admin-body]');
        const selectedRow = qsa('[data-admin-row]').find(function (row) {
          return row.querySelector('[data-admin-edit]') && row.querySelector('[data-admin-edit]').closest('tr') === row;
        });

        if (mode === 'edit' && selectedRow) {
          selectedRow.setAttribute('data-full-name', fullName);
          selectedRow.setAttribute('data-email', email);
          selectedRow.setAttribute('data-section', section);
          selectedRow.setAttribute('data-status', status);
          const cells = qsa('td', selectedRow);
          if (cells[1]) cells[1].textContent = fullName;
          if (cells[2]) cells[2].textContent = email;
          if (cells[3]) cells[3].textContent = section;
          if (cells[4]) cells[4].innerHTML = '<span class="status-pill"><span class="dot ' + (status === 'Active' ? 'success' : 'warning') + '"></span>' + status + '</span>';
          closeModal(qs('[data-admin-form-modal]'));
          toast('Instructor updated successfully.', 'success', 'Saved');
          return;
        }

        const row = document.createElement('tr');
        row.setAttribute('data-admin-row', 'true');
        row.setAttribute('data-full-name', fullName);
        row.setAttribute('data-email', email);
        row.setAttribute('data-section', section);
        row.setAttribute('data-status', status);
        row.innerHTML = [
          '<td class="checkbox-col"><span class="mini-check"></span></td>',
          '<td>' + fullName + '</td>',
          '<td>' + email + '</td>',
          '<td>' + section + '</td>',
          '<td><span class="status-pill"><span class="dot ' + (status === 'Active' ? 'success' : 'warning') + '"></span>' + status + '</span></td>',
          '<td><div class="table-actions"><button class="btn small secondary" type="button" data-admin-edit>Edit</button><button class="btn small dark" type="button" data-admin-delete>Delete</button></div></td>'
        ].join('');
        tbody.prepend(row);
        attachAdminRowActions(row);
        closeModal(qs('[data-admin-form-modal]'));
        toast('Instructor added to the list.', 'success', 'Saved');
      });
    }

    function attachAdminRowActions(row) {
      const editButton = qs('[data-admin-edit]', row);
      const deleteButton = qs('[data-admin-delete]', row);
      if (editButton) {
        editButton.addEventListener('click', function () {
          const form = qs('[data-admin-form]');
          if (!form) {
            return;
          }
          form.reset();
          qs('[name="fullName"]', form).value = row.getAttribute('data-full-name') || '';
          qs('[name="email"]', form).value = row.getAttribute('data-email') || '';
          qs('[name="section"]', form).value = row.getAttribute('data-section') || '';
          qs('[name="status"]', form).value = row.getAttribute('data-status') || 'Active';
          qs('[name="mode"]', form).value = 'edit';
          qs('[data-admin-submit-label]').textContent = 'Save Changes';
          openModal(qs('[data-admin-form-modal]'));
        });
      }
      if (deleteButton) {
        deleteButton.addEventListener('click', function () {
          if (window.confirm('Delete this instructor record?')) {
            row.remove();
            toast('Instructor removed from the list.', 'success', 'Deleted');
          }
        });
      }
    }

    qsa('[data-admin-row]').forEach(attachAdminRowActions);

    const profileForm = qs('[data-profile-form]');
    if (profileForm) {
      profileForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const displayName = qs('[name="displayName"]', profileForm).value.trim();
        const email = qs('[name="profileEmail"]', profileForm).value.trim();
        if (!displayName || !email) {
          toast('Please complete the profile form.', 'error', 'Not saved');
          return;
        }
        qs('[data-admin-name]').textContent = displayName;
        toast('Admin profile saved successfully.', 'success', 'Saved');
      });
    }

    qsa('[data-admin-logout]').forEach(function (button) {
      button.addEventListener('click', function () {
        window.location.href = 'AdminLogin.html';
      });
    });

    qsa('[data-admin-settings]').forEach(function (button) {
      button.addEventListener('click', function () {
        toast('Settings can later connect to your backend preferences page.', 'info', 'Settings');
      });
    });
  }

  function initUserSchedules() {
    const scheduleSearch = qs('[data-schedule-search]');
    if (scheduleSearch) {
      scheduleSearch.addEventListener('input', filterSchedules);
    }

    qsa('[data-day-filter]').forEach(function (button) {
      button.addEventListener('click', function () {
        qsa('[data-day-filter]').forEach(function (item) {
          item.classList.toggle('active', item === button);
        });
        filterSchedules();
      });
    });

    function filterSchedules() {
      const activeDayButton = qs('[data-day-filter].active');
      const activeDay = activeDayButton ? activeDayButton.getAttribute('data-day-filter') : 'All Days';
      const searchValue = (scheduleSearch && scheduleSearch.value || '').trim().toLowerCase();

      qsa('[data-schedule-row]').forEach(function (row) {
        const dayText = (row.getAttribute('data-days') || '').toLowerCase();
        const text = row.textContent.toLowerCase();
        const dayMatch = activeDay === 'All Days' || dayText.includes(activeDay.toLowerCase());
        const searchMatch = !searchValue || text.includes(searchValue);
        row.hidden = !(dayMatch && searchMatch);
      });
    }

    filterSchedules();

    qsa('[data-logout]').forEach(function (button) {
      button.addEventListener('click', function () {
        window.location.href = 'UserLogin.html';
      });
    });

    qsa('[data-open-user-settings]').forEach(function (button) {
      button.addEventListener('click', function () {
        toast('Profile settings are ready for backend wiring.', 'info', 'User profile');
      });
    });
  }

  function initUserAttendance() {
    const now = new Date();
    setInlineDate('[data-admin-date]', formatDate(now, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));

    const timeNode = qs('[data-live-time]');
    if (timeNode) {
      const tick = function () {
        timeNode.textContent = formatTime(new Date());
      };
      tick();
      window.setInterval(tick, 1000);
    }

    const attendanceForm = qs('[data-attendance-form]');
    if (attendanceForm) {
      attendanceForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const selection = qs('[name="section"]', attendanceForm).value;
        window.localStorage.setItem('classsync.lastSection', selection);
        toast('Section saved for attendance.', 'success', 'Saved');
      });
    }

    const startButton = qs('[data-start-attendance]');
    if (startButton) {
      startButton.addEventListener('click', function () {
        startButton.textContent = 'Attendance Running';
        startButton.disabled = true;
        toast('Attendance session started for the selected section.', 'success', 'Attendance started');
      });
    }

    qsa('[data-set-section]').forEach(function (button) {
      button.addEventListener('click', function () {
        const select = qs('[name="section"]');
        if (select) {
          select.value = button.getAttribute('data-set-section');
          toast('Section changed to ' + select.options[select.selectedIndex].text + '.', 'info', 'Section selected');
        }
      });
    });

    qsa('[data-logout]').forEach(function (button) {
      button.addEventListener('click', function () {
        window.location.href = 'UserLogin.html';
      });
    });

    qsa('[data-open-user-settings]').forEach(function (button) {
      button.addEventListener('click', function () {
        toast('Profile settings are ready for backend wiring.', 'info', 'User profile');
      });
    });
  }

  function initUserReports() {
    const reportSearch = qs('[data-report-search]');
    
    function filterReports() {
      const subjectFilter = qs('[data-cycle-filter="subject"]');
      const monthFilter = qs('[data-cycle-filter="month"]');
      const sectionFilter = qs('[data-cycle-filter="section"]');
      const searchValue = (reportSearch && reportSearch.value || '').trim().toLowerCase();

      qsa('[data-report-row]').forEach(function (row) {
        const subject = (row.getAttribute('data-subject') || '').toLowerCase();
        const month = (row.getAttribute('data-month') || '').toLowerCase();
        const section = (row.getAttribute('data-section') || '').toLowerCase();
        const text = row.textContent.toLowerCase();

        const subjectValue = subjectFilter && subjectFilter.getAttribute('data-cycle-current') || 'All Subjects';
        const monthValue = monthFilter && monthFilter.getAttribute('data-cycle-current') || 'All Months';
        const sectionValue = sectionFilter && sectionFilter.getAttribute('data-cycle-current') || 'All Sections';

        const subjectMatch = subjectValue === 'All Subjects' || subject === subjectValue.toLowerCase();
        const monthMatch = monthValue === 'All Months' || month === monthValue.toLowerCase();
        const sectionMatch = sectionValue === 'All Sections' || section === sectionValue.toLowerCase();
        const searchMatch = !searchValue || text.includes(searchValue);

        row.hidden = !(subjectMatch && monthMatch && sectionMatch && searchMatch);
      });
    }

    qsa('[data-cycle-filter]').forEach(function (button) {
      const values = parseCycleValues(button);
      button.addEventListener('click', function () {
        if (!values.length) {
          return;
        }

        const current = button.getAttribute('data-cycle-current') || values[0];
        const index = values.indexOf(current);
        const nextValue = values[(index + 1) % values.length];
        button.setAttribute('data-cycle-current', nextValue);
        button.textContent = nextValue;
        filterReports();
      });
    });

    if (reportSearch) {
      reportSearch.addEventListener('input', filterReports);
    }

    qsa('[data-view-record]').forEach(function (button) {
      button.addEventListener('click', function () {
        const row = button.closest('tr');
        if (!row) {
          return;
        }
        const detailLines = [];
        qsa('td', row).forEach(function (cell) {
          const value = cell.textContent.trim();
          if (value) {
            detailLines.push(value.replace(/\s+/g, ' '));
          }
        });
        qs('[data-record-details]').textContent = detailLines.join('\n');
        openModal(qs('[data-record-modal]'));
      });
    });

    const newRecordButton = qs('[data-open-record-form]');
    if (newRecordButton) {
      newRecordButton.addEventListener('click', function () {
        qs('[data-record-form]').reset();
        openModal(qs('[data-record-form-modal]'));
      });
    }

    const recordForm = qs('[data-record-form]');
    if (recordForm) {
      recordForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const date = qs('[name="recordDate"]', recordForm).value;
        const subject = qs('[name="recordSubject"]', recordForm).value.trim();
        const section = qs('[name="recordSection"]', recordForm).value.trim();
        const timeIn = qs('[name="timeIn"]', recordForm).value.trim();
        const status = qs('[name="status"]', recordForm).value;
        const present = qs('[name="present"]', recordForm).value.trim();
        const absent = qs('[name="absent"]', recordForm).value.trim();
        const late = qs('[name="late"]', recordForm).value.trim();

        if (!date || !subject || !section || !timeIn) {
          toast('Please complete the required fields before saving.', 'error', 'Record not saved');
          return;
        }

        const tbody = qs('[data-report-body]');
        const row = document.createElement('tr');
        const dateLabel = formatDate(new Date(date), {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        const statusTone = status.toLowerCase().includes('late') ? 'warning' : 'success';

        row.setAttribute('data-report-row', 'true');
        row.setAttribute('data-subject', subject);
        row.setAttribute('data-month', new Date(date).toLocaleString(undefined, { month: 'long' }));
        row.setAttribute('data-section', section);
        row.innerHTML = [
          '<td>' + dateLabel + '</td>',
          '<td><strong>' + subject + '</strong></td>',
          '<td><span class="chip active" style="display:inline-flex; min-height:26px; border-radius:999px;">' + section + '</span></td>',
          '<td>' + timeIn + '</td>',
          '<td><span class="status-pill"><span class="dot ' + statusTone + '"></span>' + status + '</span></td>',
          '<td>' + (present || '0') + '</td>',
          '<td>' + (absent || '0') + '</td>',
          '<td>' + (late || '0') + '</td>',
          '<td><div class="table-actions"><button class="btn small warning" type="button" data-view-record>VIEW</button></div></td>'
        ].join('');

        tbody.prepend(row);
        row.querySelector('[data-view-record]').addEventListener('click', function () {
          const detailLines = [];
          qsa('td', row).forEach(function (cell) {
            const value = cell.textContent.trim();
            if (value) {
              detailLines.push(value.replace(/\s+/g, ' '));
            }
          });
          qs('[data-record-details]').textContent = detailLines.join('\n');
          openModal(qs('[data-record-modal]'));
        });

        closeModal(qs('[data-record-form-modal]'));
        toast('Attendance record added successfully.', 'success', 'Record saved');
        filterReports();
      });
    }

    filterReports();

    qsa('[data-logout]').forEach(function (button) {
      button.addEventListener('click', function () {
        window.location.href = 'UserLogin.html';
      });
    });

    qsa('[data-open-user-settings]').forEach(function (button) {
      button.addEventListener('click', function () {
        toast('Profile settings are ready for backend wiring.', 'info', 'User profile');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    attachModalEvents();

    const page = document.body.getAttribute('data-page');
    if (page === 'user-login') {
      initUserLogin();
    } else if (page === 'admin-login') {
      initAdminLogin();
    } else if (page === 'user-dashboard') {
      initUserDashboard();
    } else if (page === 'user-schedules') {
      initUserSchedules();
    } else if (page === 'user-attendance') {
      initUserAttendance();
    } else if (page === 'user-reports') {
      initUserReports();
    } else if (page === 'admin-dashboard') {
      initAdminDashboard();
    }
  });
})();
