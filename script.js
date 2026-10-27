// To-Do List Application - DOM manipulation with localStorage persistence
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const filterButtons = document.querySelectorAll(".filter");
const pendingCount = document.getElementById("pending-count");
const completedCount = document.getElementById("completed-count");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask(text) {
  tasks.push({ id: Date.now(), text: text, completed: false });
  save();
  render();
}

function toggleTask(id) {
  tasks = tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t));
  save();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save();
  render();
}

function render() {
  const pending = tasks.filter(t => !t.completed).length;
  const completed = tasks.length - pending;

  filterButtons[0].textContent = `All (${tasks.length})`;
  filterButtons[1].textContent = `Pending (${pending})`;
  filterButtons[2].textContent = `Completed (${completed})`;
  pendingCount.textContent = `${pending} pending`;
  completedCount.textContent = `${completed} completed`;

  const visible = tasks.filter(t =>
    currentFilter === "all" ? true :
    currentFilter === "pending" ? !t.completed : t.completed
  );

  list.innerHTML = "";

  if (visible.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "No tasks here. Add one above!";
    list.appendChild(empty);
    return;
  }

  visible.forEach(task => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("done");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text;

    const completeBtn = document.createElement("button");
    completeBtn.className = "icon-btn complete-btn";
    completeBtn.title = "Mark as completed";
    completeBtn.innerHTML = "&#10003;";
    completeBtn.addEventListener("click", () => toggleTask(task.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "icon-btn delete-btn";
    deleteBtn.title = "Delete task";
    deleteBtn.innerHTML = "&#128465;";
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    li.append(checkbox, span, completeBtn, deleteBtn);
    list.appendChild(li);
  });
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addTask(text);
  input.value = "";
  input.focus();
});

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    render();
  });
});

render();
