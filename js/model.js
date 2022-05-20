export let tasks = [];

export function addTask(info) {
  tasks.push(info);
  saveState();
}

export function removeTask(id) {
  tasks.splice(
    tasks.findIndex((task) => task.id == id),
    1
  );
  saveState();
}

export function changeStatus(id) {
  const task = tasks.find((task) => task.id == id);
  task.completed = task.completed === false ? true : false;
  saveState();
}

export function changePositions(list) {
  list.forEach((el) => {
    const currentID = el.querySelector(`input[type="checkbox"]`).id;

    const currentTask = tasks.find((task) => task.id == currentID);

    currentTask.position = el.dataset.position;
  });

  saveState();
}

export function clearCompletedTasks() {
  tasks = tasks.filter((el) => el.completed === false);
  saveState();
}

function saveState() {
  tasks.sort((a, b) => a.position - b.position);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function init() {
  const storage = localStorage.getItem("tasks");
  if (storage) {
    tasks = JSON.parse(storage);
    tasks.sort((a, b) => a.position - b.position);
  }
}
init();
