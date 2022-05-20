export const taskList = document.querySelector(".app__list");
const totalTasksEl = document
  .querySelector(".app__data__items")
  .querySelector("span");

export function renderTasks(task) {
  const html = `
      <li class="app__list__element" draggable="true" data-position="${
        task.position
      }" data-completed="${task.completed}">
        <input type="checkbox" name="${task.id}" id="${task.id}" />

        <label for="${task.id}"><ion-icon name="${
    task.completed === true ? "checkmark-outline" : "radio-button-off-outline"
  }">
          </ion-icon>${task.text}</label>
        <button class="app__list__element__close-btn">
          <ion-icon name="close-outline"></ion-icon>
        </button>
      </li>`;

  taskList.insertAdjacentHTML("afterbegin", html);

  [...document.querySelectorAll(`input[type="checkbox"]`)].find(
    (box) => box.id == task.id
  ).checked = task.completed === true ? true : false;
}

export function addTask(task) {
  const text = task.value;
  const id = calcTotalTasks();
  task.value = "";

  const html = `
      <li class="app__list__element" draggable="true" data-position="${id}" data-completed="false">
        <input type="checkbox" name="${id}" id="${id}" />

        <label for="${id}"><ion-icon name="radio-button-off-outline">
          </ion-icon>${text}</label>
        <button class="app__list__element__close-btn">
          <ion-icon name="close-outline"></ion-icon>
        </button>
      </li>`;

  taskList.insertAdjacentHTML("afterbegin", html);
  calcTotalTasks();

  return { id, text, position: id, completed: false };
}

export function removeTask(id) {
  [...document.querySelectorAll(".app__list__element")]
    .find((el) => el.dataset.id == id)
    .remove();

  return id;
}

export function changeTheme(e) {
  const name = e.target.name;
  if (name === "moon-sharp") {
    e.target.name = "sunny";
  } else {
    e.target.name = "moon-sharp";
  }
  document.body.classList.toggle("dark");
}

export function calcTotalTasks() {
  return taskList.querySelectorAll(".app__list__element").length;
}

export function setTotalTasks(element = ".app__list__element") {
  totalTasksEl.innerText = taskList.querySelectorAll(element).length;
}

export function init() {
  setTotalTasks();
}
