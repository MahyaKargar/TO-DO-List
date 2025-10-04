const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const editModal = document.getElementById("editModal");
const closeModal = document.getElementById("closeModal");
const editInput = document.getElementById("editInput");
const saveEditBtn = document.getElementById("saveEditBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
let currentEditSpan = null;

function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach((li) => {
    const text = li.querySelector(".task-text").textContent;
    const done = li.classList.contains("done");
    tasks.push({ text, done });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function createTaskElement(text, done = false) {
  const li = document.createElement("li");
  const span = document.createElement("span");
  span.classList.add("task-text");
  span.textContent = text;
  li.appendChild(span);

  if (done) li.classList.add("done");

  const btnContainer = document.createElement("div");
  btnContainer.classList.add("task-buttons");

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("done");
  doneBtn.innerHTML = '<i class="fas fa-check-circle"></i>';
  doneBtn.addEventListener("click", () => {
    li.classList.toggle("done");
    saveTasks();
    filterTasks();
  });

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit");
  editBtn.innerHTML = '<i class="fas fa-edit"></i>';
  editBtn.addEventListener("click", () => {
    currentEditSpan = span;
    editInput.value = span.textContent;
    editModal.style.display = "block";
    editInput.focus();
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete");
  deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
  deleteBtn.addEventListener("click", () => {
    li.remove();
    saveTasks();
  });

  btnContainer.append(doneBtn, editBtn, deleteBtn);
  li.appendChild(btnContainer);
  taskList.appendChild(li);
}

addBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (text !== "") {
    createTaskElement(text);
    taskInput.value = "";
    saveTasks();
    filterTasks();
  }
});

const savedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
savedTasks.forEach((task) => createTaskElement(task.text, task.done));

function filterTasks() {
  const searchText = searchInput.value.toLowerCase();
  const status = statusFilter.value;

  document.querySelectorAll("#taskList li").forEach((li) => {
    const text = li.querySelector(".task-text").textContent.toLowerCase();
    const isDone = li.classList.contains("done");

    const matchesText = text.includes(searchText);
    const matchesStatus =
      status === "all" ||
      (status === "done" && isDone) ||
      (status === "notdone" && !isDone);

    li.style.display = matchesText && matchesStatus ? "" : "none";
  });
}

searchInput.addEventListener("input", filterTasks);
statusFilter.addEventListener("change", filterTasks);

closeModal.addEventListener("click", () => {
  editModal.style.display = "none";
  currentEditSpan = null;
});

saveEditBtn.addEventListener("click", () => {
  if (currentEditSpan && editInput.value.trim() !== "") {
    currentEditSpan.textContent = editInput.value.trim();
    saveTasks();
    filterTasks();
    editModal.style.display = "none";
    currentEditSpan = null;
  }
});

cancelEditBtn.addEventListener("click", () => {
  editModal.style.display = "none";
  currentEditSpan = null;
});

window.addEventListener("click", (e) => {
  if (e.target == editModal) {
    editModal.style.display = "none";
    currentEditSpan = null;
  }
});
