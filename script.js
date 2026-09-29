// Maras-Set-Kanban — main script

// ===== Data model =====
// Each task: { id, title, description, column, priority, dueDate }
// column: "todo" | "doing" | "done"
// priority (MoSCoW): "must" | "should" | "could" | "wont"
// dueDate: "YYYY-MM-DD"

let tasks = [
  {
    id: 1,
    title: "Build the task form",
    description: "",
    column: "todo",
    priority: "should",
    dueDate: "2026-10-05"
  },
  {
    id: 2,
    title: "Drag and drop (part 1)",
    description: "",
    column: "todo",
    priority: "must",
    dueDate: "2026-10-06"
  },
  {
    id: 3,
    title: "Style the cards",
    description: "",
    column: "doing",
    priority: "could",
    dueDate: "2026-09-24"
  },
  {
    id: 4,
    title: "Project planning",
    description: "",
    column: "done",
    priority: "must",
    dueDate: "2026-09-21"
  }
];

const PRIORITY_LABELS = {
  must: "Must",
  should: "Should",
  could: "Could",
  wont: "Won't"
};

// ===== Helpers =====

function formatDate(isoDate) {
  const date = new Date(isoDate + "T00:00:00");
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month} (${weekday})`;
}

function createTaskCard(task) {
  const card = document.createElement("article");
  card.className = "task-card";
  card.draggable = true;
  card.dataset.id = task.id;

  const title = document.createElement("h3");
  title.className = "task-title";
  title.textContent = task.title;
  card.appendChild(title);

  if (task.description) {
    const description = document.createElement("p");
    description.className = "task-description";
    description.textContent = task.description;
    card.appendChild(description);
  }

  const footer = document.createElement("div");
  footer.className = "task-footer";

  const badge = document.createElement("span");
  badge.className = `badge badge-${task.priority}`;
  badge.textContent = PRIORITY_LABELS[task.priority];
  footer.appendChild(badge);

  const date = document.createElement("span");
  date.className = "task-date";
  date.textContent = formatDate(task.dueDate);
  footer.appendChild(date);

  card.appendChild(footer);
  return card;
}

// ===== Render =====

function renderBoard() {
  const columns = ["todo", "doing", "done"];

  columns.forEach((columnName) => {
    const columnEl = document.querySelector(`.column[data-column="${columnName}"]`);
    const listEl = columnEl.querySelector(".task-list");
    const counterEl = columnEl.querySelector(".counter");

    const columnTasks = tasks.filter((task) => task.column === columnName);

    listEl.innerHTML = "";
    columnTasks.forEach((task) => listEl.appendChild(createTaskCard(task)));
    counterEl.textContent = columnTasks.length;
  });
}

renderBoard();

// ===== Cursor light effect for glass panels =====
document.addEventListener("mousemove", (event) => {
  document.documentElement.style.setProperty("--mx", `${event.clientX}px`);
  document.documentElement.style.setProperty("--my", `${event.clientY}px`);
});

// ===== New task form: Day 6 =====

const newTaskBtn = document.querySelector(".new-task-btn");
const taskFormDialog = document.querySelector(".task-form-dialog");
const taskForm = document.querySelector(".task-form");
const cancelBtn = document.querySelector(".task-form-cancel");
const titleInput = document.querySelector("#task-title-input");
const priorityInput = document.querySelector("#task-priority-input");
const dateInput = document.querySelector("#task-date-input");

newTaskBtn.addEventListener("click", () => {
  taskForm.reset();

  const btnRect = newTaskBtn.getBoundingClientRect();
  taskFormDialog.style.position = "fixed";
  taskFormDialog.style.top = `${btnRect.bottom + 12}px`;
  taskFormDialog.style.left = `${btnRect.right - 320}px`;

  taskFormDialog.showModal();
});

function closeDialogAnimated() {
  taskFormDialog.classList.add("closing");

  taskFormDialog.addEventListener("transitionend", () => {
    taskFormDialog.classList.remove("closing");
    taskFormDialog.close();
  }, { once: true });
}

cancelBtn.addEventListener("click", () => {
  closeDialogAnimated();
});

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const newTask = {
    id: Date.now(),
    title: titleInput.value,
    description: "",
    column: "todo",
    priority: priorityInput.value,
    dueDate: dateInput.value
  };

  tasks.push(newTask);
  renderBoard();
  closeDialogAnimated();
});