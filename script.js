// Maras-Set-Kanban — main script

// ===== Data model =====
// Each task: { id, title, description, column, priority, dueDate }
// column: "todo" | "doing" | "done"
// priority (MoSCoW): "must" | "should" | "could" | "wont"
// dueDate: "YYYY-MM-DD"

const STORAGE_KEY = "maras-set-kanban-tasks";

// Today plus/minus a number of days, as "YYYY-MM-DD" in the visitor's local time
function dateFromToday(offsetDays) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Example tasks for a first visit. Dates are relative to the day the page is opened.
function createDefaultTasks() {
  return [
    {
      id: 1,
      title: "Build the task form",
      description: "",
      column: "todo",
      priority: "should",
      dueDate: dateFromToday(3)
    },
    {
      id: 2,
      title: "Drag and drop (part 1)",
      description: "",
      column: "todo",
      priority: "must",
      dueDate: dateFromToday(1)
    },
    {
      id: 3,
      title: "Style the cards",
      description: "",
      column: "doing",
      priority: "could",
      dueDate: dateFromToday(-2)
    },
    {
      id: 4,
      title: "Project planning",
      description: "",
      column: "done",
      priority: "must",
      dueDate: dateFromToday(-5)
    }
  ];
}

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : createDefaultTasks();
  } catch {
    return createDefaultTasks();
  }
}

// A full or blocked storage must never break the board
function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {}
}

let tasks = loadTasks();

let activeFilter = "all";

// Ids of cards that should play the enter animation on the next render
const animateIds = new Set();
let isFirstRender = true;

// Id of the task being edited, or null when the form creates a new task
let editingTaskId = null;

const PRIORITY_LABELS = {
  must: "Must",
  should: "Should",
  could: "Could",
  wont: "Won't"
};

// ===== DOM references =====

const newTaskBtn = document.querySelector(".new-task-btn");
const taskFormDialog = document.querySelector(".task-form-dialog");
const taskForm = document.querySelector(".task-form");
const cancelBtn = document.querySelector(".task-form-cancel");
const titleInput = document.querySelector("#task-title-input");
const priorityInput = document.querySelector("#task-priority-input");
const dateInput = document.querySelector("#task-date-input");
const dialogTitle = document.querySelector(".task-form h2");
const taskFormSubmitBtn = document.querySelector(".task-form-submit");

// ===== Helpers =====

function formatDate(isoDate) {
  if (!isoDate) return "No date";
  const date = new Date(isoDate + "T00:00:00");
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month} (${weekday})`;
}

function isOverdue(task) {
  if (task.column === "done" || !task.dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(task.dueDate + "T00:00:00");
  return due < today;
}

function createTaskCard(task, position) {
  const card = document.createElement("article");
  card.className = "task-card";
  card.draggable = true;
  card.dataset.id = task.id;

  if (isOverdue(task)) {
    card.classList.add("overdue");
  }

  const number = document.createElement("span");
  number.className = "task-number";
  number.textContent = `${position}`;
  card.appendChild(number);

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "task-delete-btn";
  deleteBtn.textContent = "×";
  deleteBtn.setAttribute("aria-label", "Delete task");

  deleteBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    card.classList.add("card-leaving");
    setTimeout(() => {
      tasks = tasks.filter((t) => t.id !== task.id);
      renderBoard();
    }, 200);
  });

  card.appendChild(deleteBtn);

  // Clicking the card opens the form pre-filled for editing
  card.addEventListener("click", () => {
    editingTaskId = task.id;
    titleInput.value = task.title;
    priorityInput.value = task.priority;
    dateInput.value = task.dueDate;
    dialogTitle.textContent = "Edit Task";
    taskFormSubmitBtn.textContent = "Save Changes";

    const cardRect = card.getBoundingClientRect();
    placeDialog(cardRect.right + 16, cardRect.top);
  });

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

  card.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", task.id);
    card.classList.add("dragging");
  });

  card.addEventListener("dragend", () => {
    card.classList.remove("dragging");
  });

  // Reordering: dropping one card on top of another
  card.addEventListener("dragover", (event) => {
    event.preventDefault();
    event.stopPropagation();
    card.classList.add("drag-over-card");
  });

  card.addEventListener("dragleave", () => {
    card.classList.remove("drag-over-card");
  });

  card.addEventListener("drop", (event) => {
    event.preventDefault();
    event.stopPropagation();
    card.classList.remove("drag-over-card");

    const draggedId = Number(event.dataTransfer.getData("text/plain"));
    if (draggedId === task.id) return;

    const draggedIndex = tasks.findIndex((t) => t.id === draggedId);
    if (draggedIndex === -1) return;
    const [draggedTask] = tasks.splice(draggedIndex, 1);

    const rect = card.getBoundingClientRect();
    const dropAfter = event.clientY > rect.top + rect.height / 2;

    const targetIndex = tasks.findIndex((t) => t.id === task.id);
    const insertAt = dropAfter ? targetIndex + 1 : targetIndex;

    draggedTask.column = task.column;
    tasks.splice(insertAt, 0, draggedTask);
    animateIds.add(draggedTask.id);

    renderBoard();
  });

  return card;
}

// ===== Render =====

function renderBoard() {
  const columns = ["todo", "doing", "done"];

  columns.forEach((columnName) => {
    const columnEl = document.querySelector(`.column[data-column="${columnName}"]`);
    const listEl = columnEl.querySelector(".task-list");
    const counterEl = columnEl.querySelector(".counter");

    const columnTasks = tasks.filter(
      (task) => task.column === columnName && (activeFilter === "all" || task.priority === activeFilter)
    );

    listEl.innerHTML = "";
    columnTasks.forEach((task, index) => {
      const card = createTaskCard(task, index + 1);
      if (animateIds.has(task.id)) card.classList.add("card-enter");
      listEl.appendChild(card);
    });

    if (!isFirstRender && Number(counterEl.textContent) !== columnTasks.length) {
      counterEl.classList.remove("bump");
      void counterEl.offsetWidth; // restart the animation
      counterEl.classList.add("bump");
    }
    counterEl.textContent = columnTasks.length;
  });

  animateIds.clear();
  isFirstRender = false;

  saveTasks();
}

renderBoard();

// ===== Cursor light effect for glass panels =====

document.addEventListener("mousemove", (event) => {
  document.documentElement.style.setProperty("--mx", `${event.clientX}px`);
  document.documentElement.style.setProperty("--my", `${event.clientY}px`);
});

// ===== Task form (create and edit) =====

// Opens the dialog at (left, top), then pushes it back inside the viewport
function placeDialog(left, top) {
  taskFormDialog.style.position = "fixed";
  taskFormDialog.style.left = `${left}px`;
  taskFormDialog.style.top = `${top}px`;
  taskFormDialog.showModal();

  const margin = 16;
  const maxLeft = window.innerWidth - taskFormDialog.offsetWidth - margin;
  const maxTop = window.innerHeight - taskFormDialog.offsetHeight - margin;
  taskFormDialog.style.left = `${Math.max(margin, Math.min(left, maxLeft))}px`;
  taskFormDialog.style.top = `${Math.max(margin, Math.min(top, maxTop))}px`;
}

newTaskBtn.addEventListener("click", () => {
  editingTaskId = null;
  taskForm.reset();
  dateInput.value = dateFromToday(0);
  dialogTitle.textContent = "New Task";
  taskFormSubmitBtn.textContent = "Add Task";

  const btnRect = newTaskBtn.getBoundingClientRect();
  placeDialog(btnRect.right - 320, btnRect.bottom + 12);
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

  const title = titleInput.value.trim();
  if (!title) return;

  if (editingTaskId !== null) {
    const task = tasks.find((t) => t.id === editingTaskId);
    if (task) {
      task.title = title;
      task.priority = priorityInput.value;
      task.dueDate = dateInput.value;
    }
  } else {
    const newTask = {
      id: Date.now(),
      title: title,
      description: "",
      column: "todo",
      priority: priorityInput.value,
      dueDate: dateInput.value
    };
    tasks.push(newTask);
    animateIds.add(newTask.id);
  }

  renderBoard();
  closeDialogAnimated();
});

// ===== Drag and drop between columns =====

document.querySelectorAll(".column").forEach((column) => {
  column.addEventListener("dragover", (event) => {
    event.preventDefault();
    column.classList.add("drag-over");
  });

  column.addEventListener("dragleave", () => {
    column.classList.remove("drag-over");
  });

  column.addEventListener("drop", (event) => {
    event.preventDefault();
    column.classList.remove("drag-over");

    const taskId = Number(event.dataTransfer.getData("text/plain"));
    const targetColumn = column.dataset.column;

    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return;

    const [task] = tasks.splice(taskIndex, 1);
    task.column = targetColumn;
    tasks.push(task);
    animateIds.add(task.id);

    renderBoard();
  });
});

// ===== Filters =====

// Smoothly resizes each column from its old height to the new one
function animateColumnHeights(oldHeights) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.querySelectorAll(".column").forEach((column) => {
    const oldHeight = oldHeights.get(column);
    const newHeight = column.getBoundingClientRect().height;
    if (Math.abs(oldHeight - newHeight) < 1) return;

    column.style.overflow = "hidden";
    const animation = column.animate(
      [{ height: `${oldHeight}px` }, { height: `${newHeight}px` }],
      { duration: 350, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }
    );
    animation.onfinish = animation.oncancel = () => {
      column.style.overflow = "";
    };
  });
}

let isFilterAnimating = false;

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const newFilter = btn.dataset.filter;
    if (isFilterAnimating || newFilter === activeFilter) return;
    isFilterAnimating = true;

    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const oldHeights = new Map();
    document.querySelectorAll(".column").forEach((column) => {
      oldHeights.set(column, column.getBoundingClientRect().height);
    });

    // Cards on screen now; the ones that don't match the new filter fade out
    const visibleIds = new Set();
    document.querySelectorAll(".task-card").forEach((card) => {
      const id = Number(card.dataset.id);
      const task = tasks.find((t) => t.id === id);
      visibleIds.add(id);
      if (task && newFilter !== "all" && task.priority !== newFilter) {
        card.classList.add("card-leaving");
      }
    });

    // After the fade out: re-render, animate only the cards that were hidden before
    setTimeout(() => {
      activeFilter = newFilter;
      tasks.forEach((t) => {
        if (!visibleIds.has(t.id)) animateIds.add(t.id);
      });
      renderBoard();
      animateColumnHeights(oldHeights);
      isFilterAnimating = false;
    }, 200);
  });
});

// ===== Theme (light / dark) =====
// Follows the system appearance until the user picks one with the toggle.

const THEME_KEY = "maras-set-kanban-theme";
const themeToggleBtn = document.querySelector(".theme-toggle");
const systemDarkQuery = window.matchMedia("(prefers-color-scheme: dark)");

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggleBtn.textContent = "Dark mode";
  themeToggleBtn.setAttribute("aria-pressed", String(theme === "dark"));
}

// Switches theme with a soft crossfade. The page stays live the whole time,
// so the glass blur never disappears. "Reduce motion" switches instantly.
let themeFadeTimer;

function applyThemeAnimated(theme) {
  const root = document.documentElement;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    applyTheme(theme);
    return;
  }

  root.classList.add("theme-fade");
  applyTheme(theme);
  clearTimeout(themeFadeTimer);
  themeFadeTimer = setTimeout(() => root.classList.remove("theme-fade"), 450);
}

themeToggleBtn.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyThemeAnimated(next);
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {}
});

systemDarkQuery.addEventListener("change", (event) => {
  let hasSavedChoice = false;
  try {
    hasSavedChoice = localStorage.getItem(THEME_KEY) !== null;
  } catch {}
  if (!hasSavedChoice) applyTheme(event.matches ? "dark" : "light");
});

applyTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");

// ===== Wallpaper =====
// Images come from wallpapers.js, presets are CSS gradients in style.css.
// Uploads are saved as a JPEG data URL.
// The inline script in index.html applies the saved choice before the first paint.

const WALLPAPER_KEY = "maras-set-kanban-wallpaper";
const WALLPAPER_PRESETS = ["sunset", "forest", "graphite"];
const WALLPAPER_MAX_SIDE = 1920;
const DEFAULT_WALLPAPER_ID = "golden-gate"; // also the fallback in style.css

// File path as a URL: spaces, accents and other characters are encoded, the name is kept
function wallpaperUrl(file) {
  return file.split("/").map(encodeURIComponent).join("/");
}

// One thumbnail per image, before the gradient presets
document.querySelector(".wallpaper-options").prepend(...WALLPAPERS.map((wallpaper) => {
  const option = document.createElement("button");
  option.type = "button";
  option.className = "wallpaper-option";
  option.dataset.wallpaper = wallpaper.id;
  option.setAttribute("aria-pressed", "false");

  const swatch = document.createElement("span");
  swatch.className = "wallpaper-swatch";
  swatch.style.backgroundImage = `url("${wallpaperUrl(wallpaper.file)}")`;
  option.append(swatch, wallpaper.name);
  return option;
}));

const wallpaperToggleBtn = document.querySelector(".wallpaper-toggle");
const wallpaperDialog = document.querySelector(".wallpaper-dialog");
const wallpaperOptions = document.querySelectorAll(".wallpaper-option");
const customWallpaperOption = document.querySelector('.wallpaper-option[data-wallpaper="custom"]');
const wallpaperFileInput = document.querySelector(".wallpaper-file-input");
const wallpaperUploadBtn = document.querySelector(".wallpaper-upload-btn");
const wallpaperResetBtn = document.querySelector(".wallpaper-reset-btn");
const wallpaperCloseBtn = document.querySelector(".wallpaper-close-btn");
const wallpaperError = document.querySelector(".wallpaper-error");

function findWallpaper(id) {
  return WALLPAPERS.find((wallpaper) => wallpaper.id === id);
}

// An image id, a preset name or "custom"
function currentWallpaper() {
  const name = document.documentElement.dataset.wallpaper;
  const isKnown = name === "custom" || WALLPAPER_PRESETS.includes(name) || findWallpaper(name);
  return isKnown ? name : DEFAULT_WALLPAPER_ID;
}

// Marks the selected thumbnail. "Your image" only shows while an upload is in use.
function updateWallpaperOptions() {
  const current = currentWallpaper();
  customWallpaperOption.hidden = current !== "custom";
  wallpaperOptions.forEach((option) => {
    option.setAttribute("aria-pressed", String(option.dataset.wallpaper === current));
  });
}

// value: an image id, a preset name or an image data URL
function applyWallpaper(value) {
  const root = document.documentElement;
  const image = findWallpaper(value);
  root.style.removeProperty("--wallpaper");
  if (value.startsWith("data:image/")) {
    root.style.setProperty("--wallpaper-custom", `url("${value}")`);
    root.dataset.wallpaper = "custom";
  } else {
    root.style.removeProperty("--wallpaper-custom");
    if (image && value !== DEFAULT_WALLPAPER_ID) {
      root.style.setProperty("--wallpaper", `url("${wallpaperUrl(image.file)}")`);
      root.dataset.wallpaper = value;
    } else if (WALLPAPER_PRESETS.includes(value)) {
      root.dataset.wallpaper = value;
    } else {
      delete root.dataset.wallpaper;
    }
  }
  updateWallpaperOptions();
}

// Returns false when the browser refuses to store it (e.g. quota exceeded)
function saveWallpaper(value) {
  try {
    if (value === DEFAULT_WALLPAPER_ID) {
      localStorage.removeItem(WALLPAPER_KEY);
    } else {
      localStorage.setItem(WALLPAPER_KEY, value);
    }
    return true;
  } catch {
    return false;
  }
}

function showWallpaperError(message) {
  wallpaperError.textContent = message;
  wallpaperError.hidden = false;
}

function hideWallpaperError() {
  wallpaperError.hidden = true;
  wallpaperError.textContent = "";
}

// Last wallpaper clicked, so a slow image never replaces a newer choice
let pendingWallpaper = null;

function useDefaultWallpaper() {
  saveWallpaper(DEFAULT_WALLPAPER_ID);
  applyWallpaper(DEFAULT_WALLPAPER_ID);
}

function selectWallpaper(value) {
  hideWallpaperError();
  pendingWallpaper = value;
  const image = findWallpaper(value);
  if (!image || value === DEFAULT_WALLPAPER_ID) {
    saveWallpaper(value);
    applyWallpaper(value);
    return;
  }

  // Load the image first: a missing file falls back to the default, not an empty background
  const test = new Image();
  test.onload = () => {
    if (pendingWallpaper !== value) return;
    saveWallpaper(value);
    applyWallpaper(value);
  };
  test.onerror = () => {
    if (pendingWallpaper !== value) return;
    useDefaultWallpaper();
    showWallpaperError("Could not load that wallpaper, so the default is back.");
  };
  test.src = wallpaperUrl(image.file);
}

// Reads an image file and scales it down so the longest side fits WALLPAPER_MAX_SIDE
function resizeImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const image = new Image();
      image.onerror = reject;
      image.onload = () => {
        const { naturalWidth: width, naturalHeight: height } = image;
        if (!width || !height) {
          reject(new Error("Image has no size"));
          return;
        }

        const scale = Math.min(1, WALLPAPER_MAX_SIDE / Math.max(width, height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(width * scale);
        canvas.height = Math.round(height * scale);

        const context = canvas.getContext("2d");
        context.fillStyle = "#000000"; // transparent areas become black, not white
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// Opens the panel under the button, then pushes it back inside the viewport
function openWallpaperDialog() {
  hideWallpaperError();
  updateWallpaperOptions();

  const btnRect = wallpaperToggleBtn.getBoundingClientRect();
  wallpaperDialog.style.position = "fixed";
  wallpaperDialog.showModal();

  const margin = 16;
  const left = btnRect.right - wallpaperDialog.offsetWidth;
  const top = btnRect.bottom + 12;
  const maxLeft = window.innerWidth - wallpaperDialog.offsetWidth - margin;
  const maxTop = window.innerHeight - wallpaperDialog.offsetHeight - margin;
  wallpaperDialog.style.left = `${Math.max(margin, Math.min(left, maxLeft))}px`;
  wallpaperDialog.style.top = `${Math.max(margin, Math.min(top, maxTop))}px`;

  wallpaperToggleBtn.setAttribute("aria-expanded", "true");
  wallpaperDialog.querySelector('.wallpaper-option[aria-pressed="true"]')?.focus();
}

function closeWallpaperDialog() {
  if (!wallpaperDialog.open || wallpaperDialog.classList.contains("closing")) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    wallpaperDialog.close();
    return;
  }

  wallpaperDialog.classList.add("closing");
  wallpaperDialog.addEventListener("transitionend", () => {
    wallpaperDialog.close();
  }, { once: true });
}

wallpaperToggleBtn.addEventListener("click", openWallpaperDialog);
wallpaperCloseBtn.addEventListener("click", closeWallpaperDialog);

// Esc: close with the same animation as the Done button
wallpaperDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeWallpaperDialog();
});

// Clicking the backdrop (outside the panel) also closes it
wallpaperDialog.addEventListener("click", (event) => {
  if (event.target !== wallpaperDialog) return;
  const rect = wallpaperDialog.getBoundingClientRect();
  const inside = event.clientX >= rect.left && event.clientX <= rect.right &&
    event.clientY >= rect.top && event.clientY <= rect.bottom;
  if (!inside) closeWallpaperDialog();
});

wallpaperDialog.addEventListener("close", () => {
  wallpaperDialog.classList.remove("closing");
  wallpaperToggleBtn.setAttribute("aria-expanded", "false");
});

wallpaperOptions.forEach((option) => {
  option.addEventListener("click", () => {
    if (option.dataset.wallpaper === "custom") return;
    selectWallpaper(option.dataset.wallpaper);
  });
});

wallpaperResetBtn.addEventListener("click", () => {
  selectWallpaper(DEFAULT_WALLPAPER_ID);
});

wallpaperUploadBtn.addEventListener("click", () => {
  wallpaperFileInput.click();
});

wallpaperFileInput.addEventListener("change", () => {
  const file = wallpaperFileInput.files[0];
  wallpaperFileInput.value = ""; // lets the same file be picked again
  if (!file) return;

  hideWallpaperError();
  if (!file.type.startsWith("image/")) {
    showWallpaperError("That file is not an image. Choose a JPEG, PNG or WebP file.");
    return;
  }

  wallpaperUploadBtn.disabled = true;
  resizeImage(file)
    .then((dataUrl) => {
      if (!saveWallpaper(dataUrl)) {
        showWallpaperError("This image is too large to save. Try a smaller one.");
        return;
      }
      pendingWallpaper = null;
      applyWallpaper(dataUrl);
    })
    .catch(() => {
      showWallpaperError("Could not read that image. Try another file.");
    })
    .finally(() => {
      wallpaperUploadBtn.disabled = false;
    });
});

updateWallpaperOptions();

// The saved image may have been removed from the folder: fall back to the default
const savedImage = findWallpaper(currentWallpaper());
if (savedImage && savedImage.id !== DEFAULT_WALLPAPER_ID) {
  const test = new Image();
  test.onerror = () => {
    if (currentWallpaper() === savedImage.id) useDefaultWallpaper();
  };
  test.src = wallpaperUrl(savedImage.file);
}
