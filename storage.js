const STORAGE_KEYS = {
  streaks: 'streak-tracker-streaks',
  tasks: 'streak-tracker-tasks',
};

function getStoredData(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.warn('Storage read failed:', error);
    return fallback;
  }
}

function saveStoredData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Storage write failed:', error);
  }
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

const defaultStreaks = [
  {
    id: 'streak-water',
    name: 'Drink Water',
    condition: 'Drink 2 liters of water',
    reminder: 'Drink a glass of water now and keep your streak alive.',
    currentCount: 7,
  },
  {
    id: 'streak-workout',
    name: 'Workout',
    condition: 'Complete a 20 minute workout',
    reminder: 'Do your daily training session before 8 PM.',
    currentCount: 4,
  },
];

const today = new Date();
const todayIso = today.toISOString().split('T')[0];

const defaultTasks = [
  {
    id: 'task-walk',
    title: 'Morning walk',
    dueDate: todayIso,
    priority: 'High',
    completed: false,
  },
  {
    id: 'task-plan',
    title: 'Plan the day',
    dueDate: todayIso,
    priority: 'Medium',
    completed: true,
  },
];

function getStreaks() {
  return getStoredData(STORAGE_KEYS.streaks, defaultStreaks);
}

function saveStreaks(streaks) {
  saveStoredData(STORAGE_KEYS.streaks, streaks);
}

function getTasks() {
  return getStoredData(STORAGE_KEYS.tasks, defaultTasks);
}

function saveTasks(tasks) {
  saveStoredData(STORAGE_KEYS.tasks, tasks);
}

function addStreak(streak) {
  const list = getStreaks();
  list.push({
    ...streak,
    id: createId('streak'),
  });
  saveStreaks(list);
}

function addTask(task) {
  const list = getTasks();
  list.push({
    ...task,
    id: createId('task'),
    completed: false,
  });
  saveTasks(list);
}

function toggleTask(taskId) {
  const list = getTasks().map((task) => {
    if (task.id === taskId) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  saveTasks(list);
}

function removeTask(taskId) {
  const list = getTasks().filter((task) => task.id !== taskId);
  saveTasks(list);
}
