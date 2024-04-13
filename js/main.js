const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");

let tasks = [];

checkEmptyList();

form.addEventListener("submit", addTask);
tasksList.addEventListener("click", doneTask);
tasksList.addEventListener("click", deleteTask);

function addTask(event) {
  event.preventDefault();

  //Достаю текст задачи из поля ввода
  const taskText = taskInput.value;
  // Описание задачи в виде объекта
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  // Добавление задачи в массив с задачами
  tasks.push(newTask);

  saveToLocalStorage();

  // Формирую CSS класс
  const cssClass = newTask.done ? "task-title task-title--done" : "task-title";

  //Формирование разметки для новой задачи
  const taskHTML = `<li id="${newTask.id}" class="list-group-item d-flex justify-content-between task-item">
    <span class="${cssClass}">${newTask.text}</span>
    <div class="task-item__buttons">
    <button type="button" data-action="done" class="btn-action">
        <img src="./img/tick.svg" alt="Done" width="18" height="18">
    </button>
    <button type="button" data-action="delete" class="btn-action">
        <img src="./img/cross.svg" alt="Done" width="18" height="18">
    </button>
    </div>
    </li>`;

  tasksList.insertAdjacentHTML("beforeend", taskHTML);

  taskInput.value = "";

  taskInput.focus();

  checkEmptyList();
}

function deleteTask(event) {
  // Проверяем, если клик был НЕ по кнопке "Удалить задачу"

  if (event.target.dataset.action === "delete") {
    const parentNode = event.target.closest("li");

    // Определяем ID задачи
    const id = Number(parentNode.id);

    tasks = tasks.filter((task) => task.id !== id);

    saveToLocalStorage();

    // Удаляем задачу из разметки
    parentNode.remove();

    checkEmptyList();
  }
}

function doneTask(event) {
  if (event.target.dataset.action === "done") {
    const parentNode = event.target.closest(".list-group-item");

    const id = Number(parentNode.id);

    const task = tasks.find(function (task) {
      if (task.id === id) {
        return true;
      }
    });

    task.done = !task.done;

    saveToLocalStorage();

    console.log(task);

    const taskTitle = parentNode.querySelector(".task-title");

    taskTitle.classList.toggle("task-title--done");

    checkEmptyList();
  }
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
    <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3" />
    <div class="empty-list__title">Список дел пуст</div>
  </li>`;
    tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
  }

  if (tasks.length > 0) {
    const emptyListEl = document.querySelector("#emptyList");
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
