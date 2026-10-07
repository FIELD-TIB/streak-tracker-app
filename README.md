const todayDateEl = document.getElementById('todayDate');
const widgetTitleEl = document.getElementById('widgetTitle');
const widgetConditionEl = document.getElementById('widgetCondition');
const widgetTaskEl = document.getElementById('widgetTask');
const streakListEl = document.getElementById('streakList');
const taskListEl = document.getElementById('taskList');
const streakCountBadgeEl = document.getElementById('streakCountBadge');
const markTaskDoneBtn = document.getElementById('markTaskDoneBtn');

const streakForm = document.getElementById('streakForm');
const taskForm = document.getElementById('taskForm');

function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function getTodayTasks() {
  const todayIso = new Date().toISOString().split('T')[0];
  return getTasks().filter((task) => task.dueDate === todayIso && !task.completed);
}

function getNextReminder() {
  const streaks = getStreaks();
  if (!streaks.length) {
    return 'No streak set yet. Add one to begin the daily habit.';
  }

  const first = streaks[0];
  return first.reminder;
}

function getStreakState(streak) {
  if (streak.currentCount >= 7) {
    return {
      label: 'Strong',
      className: 'badge-good',
    };
  }

  if (streak.currentCount >= 3) {
    return {
      label: 'Good',
      className: 'badge-warning',
    };
  }

  return {
    label: 'Needs attention',
    className: 'badge-danger',
  };
}

function renderTodayWidget() {
  const tasks = getTodayTasks();
  const streaks = getStreaks();
  const primaryStreak = streaks[0];

  if (tasks.length) {
    const firstTask = tasks[0];
    widgetTitleEl.textContent = 'Daily reminder is active';
    widgetConditionEl.textContent = firstTask.priority
      ? `Priority: ${firstTask.priority} — follow through before the day ends.`
      : getNextReminder();
    widgetTaskEl.textContent = firstTask.title;
    markTaskDoneBtn.disabled = false;
    markTaskDoneBtn.dataset.taskId = firstTask.id;
    return;
  }

  if (primaryStreak) {
    widgetTitleEl.textContent = `${primaryStreak.name} is on track`;
    widgetConditionEl.textContent = primaryStreak.reminder;
    widgetTaskEl.textContent = primaryStreak.condition;
    markTaskDoneBtn.disabled = true;
    markTaskDoneBtn.dataset.taskId = '';
    return;
  }

  widgetTitleEl.textContent = 'Your streak is active';
  widgetConditionEl.textContent = 'Add a habit and keep the momentum going.';
  widgetTaskEl.textContent = 'No task scheduled yet';
  markTaskDoneBtn.disabled = true;
}

function renderStreaks() {
  const streaks = getStreaks();
  streakCountBadgeEl.textContent = `${streaks.length} active`;

  if (!streaks.length) {
    streakListEl.innerHTML = '<p class="item-note">No streaks added yet. Use the form to create your first daily habit.</p>';
    return;
  }

  streakListEl.innerHTML = streaks
    .map((streak) => {
      const status = getStreakState(streak);
      return `
        <article class="streak-item">
          <div class="item-head">
            <h4>${streak.name}</h4>
            <span class="item-badge ${status.className}">${status.label}</span>
          </div>

          <div class="item-meta">
            <span class="streak-value">${streak.currentCount} days</span>
            <span class="item-note">Condition: ${streak.condition}</span>
          </div>

          <p class="item-note">${streak.reminder}</p>

          <div class="item-actions">
            <button class="check-btn" type="button" data-streak-increment="${streak.id}">+1 day</button>
            <button class="check-btn" type="button" data-streak-delete="${streak.id}">Remove</button>
          </div>
        </article>
      `;
    })
    .join('');
}

function renderTasks() {
  const tasks = getTasks();

  if (!tasks.length) {
    taskListEl.innerHTML = '<p class="item-note">No tasks for today yet.</p>';
    return;
  }

  taskListEl.innerHTML = tasks
    .map((task) => {
      const isChecked = task.completed ? 'checked' : '';
      const priorityClass =
        task.priority === 'High'
          ? 'badge-danger'
          : task.priority === 'Medium'
            ? 'badge-warning'
            : 'badge-good';

      return `
        <article class="task-item ${isChecked}">
          <div class="item-head">
            <h4 class="task-title">${task.title}</h4>
            <span class="item-badge ${priorityClass}">${task.priority}</span>
          </div>

          <div class="item-meta">
            <span class="item-note">Due: ${formatDate(task.dueDate)}</span>
            <span class="item-note">${task.completed ? 'Completed' : 'Open'}</span>
          </div>

          <div class="item-actions">
            <button class="check-btn" type="button" data-task-toggle="${task.id}">
              ${task.completed ? 'Undo' : 'Done'}
            </button>
            <button class="check-btn" type="button" data-task-remove="${task.id}">Delete</button>
          </div>
        </article>
      `;
    })
    .join('');
}

function renderApp() {
  const dateValue = new Date();
  todayDateEl.textContent = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(dateValue);

  renderTodayWidget();
  renderStreaks();
  renderTasks();
}

function addStreakHandler(event) {
  event.preventDefault();

  const name = document.getElementById('streakName').value.trim();
  const condition = document.getElementById('streakCondition').value.trim();
  const reminder = document.getElementById('streakReminder').value.trim();
  const currentCount = Number(document.getElementById('streakCount').value);

  if (!name || !condition || !reminder) {
    return;
  }

  addStreak({
    name,
    condition,
    reminder,
    currentCount: Number.isFinite(currentCount) ? currentCount : 0,
  });

  streakForm.reset();
  renderApp();
}

function addTaskHandler(event) {
  event.preventDefault();

  const title = document.getElementById('taskTitle').value.trim();
  const dueDate = document.getElementById('taskDueDate').value;
  const priority = document.getElementById('taskPriority').value;

  if (!title || !dueDate) {
    return;
  }

  addTask({
    title,
    dueDate,
    priority,
  });

  taskForm.reset();
  document.getElementById('taskDueDate').value = new Date().toISOString().split('T')[0];
  renderApp();
}

function handleTaskButtons(event) {
  const taskToggleId = event.target.dataset.taskToggle;
  const taskRemoveId = event.target.dataset.taskRemove;

  if (taskToggleId) {
    toggleTask(taskToggleId);
    renderApp();
    return;
  }

  if (taskRemoveId) {
    removeTask(taskRemoveId);
    renderApp();
  }
}

function handleStreakButtons(event) {
  const streakDeleteId = event.target.dataset.streakDelete;
  const streakIncrementId = event.target.dataset.streakIncrement;

  if (streakDeleteId) {
    const next = getStreaks().filter((streak) => streak.id !== streakDeleteId);
    saveStreaks(next);
    renderApp();
    return;
  }

  if (streakIncrementId) {
    const next = getStreaks().map((streak) => {
      if (streak.id === streakIncrementId) {
        return { ...streak, currentCount: streak.currentCount + 1 };
      }
      return streak;
    });

    saveStreaks(next);
    renderApp();
  }
}

function handleMarkTaskDone() {
  const taskId = markTaskDoneBtn.dataset.taskId;
  if (!taskId) {
    return;
  }

  toggleTask(taskId);
  renderApp();
}

streakForm.addEventListener('submit', addStreakHandler);
taskForm.addEventListener('submit', addTaskHandler);
document.addEventListener('click', (event) => {
  handleTaskButtons(event);
  handleStreakButtons(event);

  if (event.target === markTaskDoneBtn || event.target.closest('#markTaskDoneBtn')) {
    handleMarkTaskDone();
  }
});

// Set a default due date for the task form when the app loads.
document.getElementById('taskDueDate').value = new Date().toISOString().split('T')[0];
renderApp();
