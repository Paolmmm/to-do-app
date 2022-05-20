import * as view from "./view.js";
import * as model from "./model.js";

const themeBtn = document.querySelector(".app__header__theme-btn");
const form = document.querySelector(".app__input");

themeBtn.addEventListener("click", (e) => {
  view.changeTheme(e);
});

form.addEventListener("keypress", (e) => {
  if (e.key !== "Enter") return;

  if (form.checkValidity()) {
    e.preventDefault();
    model.addTask(view.addTask(e.target));
    initDrag();
  }
});

view.taskList.addEventListener("click", (e) => {
  if (e.target.closest("label")) {
    const icon = e.target.closest("label").querySelector("ion-icon");
    const check = e.target.closest("label").previousElementSibling.checked;
    const element = e.target.closest(".app__list__element");

    icon.setAttribute(
      "name",
      !check ? "checkmark-outline" : "radio-button-off-outline"
    );

    element.dataset.completed =
      element.dataset.completed === "false" ? "true" : "false";

    model.changeStatus(element.querySelector("input").id);
  }

  if (e.target.closest("button")) {
    const element = e.target.closest(".app__list__element");
    model.removeTask(view.removeTask(element.dataset.id));
  }
});

function changePositions() {
  [...document.querySelectorAll(".app__list__element")].forEach(
    (el, i, arr) => (el.dataset.position = arr.length - 1 - i)
  );

  return [...document.querySelectorAll(".app__list__element")];
}

function initDrag() {
  const task = document.querySelector(".app__list__element");

  task.addEventListener("dragstart", () => {
    task.classList.add("dragging");
  });

  task.addEventListener("dragend", () => {
    task.classList.remove("dragging");

    model.changePositions(changePositions());
  });
}

view.taskList.addEventListener("dragover", (e) => {
  e.preventDefault();
  const afterElement = getDragAfterElement(view.taskList, e.clientY);
  const draggable = document.querySelector(".dragging");

  if (afterElement == null) {
    view.taskList.appendChild(draggable);
  } else {
    view.taskList.insertBefore(draggable, afterElement);
  }
});

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll("[draggable=true]:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - (box.top + box.height / 2);

      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      } else {
        return closest;
      }
    },
    {
      offset: Number.NEGATIVE_INFINITY,
    }
  ).element;
}

// STATES
const states = document.querySelectorAll(".states");

[...states].forEach((state) => {
  state.addEventListener("click", (e) => {
    if (e.target.closest("button")) {
      states.forEach((el) => {
        [...el.querySelectorAll("button")].forEach((btnRemove) =>
          btnRemove.classList.remove("states--current")
        );

        document
          .querySelectorAll("." + e.target.classList[0])
          .forEach((btnAdd) => btnAdd.classList.add("states--current"));

        view.taskList
          .querySelectorAll(`[data-completed]`)
          .forEach((task) => task.classList.remove("hidden"));
      });
    }

    if (e.target.classList.contains("states__all")) {
      view.taskList
        .querySelectorAll(`[data-completed]`)
        .forEach((task) => task.classList.remove("hidden"));
      view.setTotalTasks();
    }

    if (e.target.classList.contains("states__active")) {
      view.taskList
        .querySelectorAll(`[data-completed="true"]`)
        .forEach((task) => task.classList.add("hidden"));
      view.setTotalTasks(`[data-completed="false"]`);
    }

    if (e.target.classList.contains("states__completed")) {
      view.taskList
        .querySelectorAll(`[data-completed="false"]`)
        .forEach((task) => task.classList.add("hidden"));
      view.setTotalTasks(`[data-completed="true"]`);
    }
  });
});

// CLEAR
const btnClear = document.querySelector(".app__data__clear-btn");

btnClear.addEventListener("click", () => {
  document
    .querySelectorAll(`[data-completed="true"]`)
    .forEach((el) => el.remove());
  view.setTotalTasks();

  model.clearCompletedTasks();
});

function init() {
  model.tasks.forEach((task) => {
    view.renderTasks(task);
    initDrag();
  });
  view.init();
}
init();
