// DOM Elements
const taskInput = document.querySelector('#taskInput');
const taskList = document.querySelector('#taskList');
const addTaskForm = document.querySelector('#addTaskForm');
const clearAllButton = document.querySelector('#clearAll');
const viewAllButton = document.querySelector('#viewAll');
const viewCompletedButton = document.querySelector('#viewCompleted');
const viewPendingButton = document.querySelector('#viewPending');

// Retrieve tasks from localStorage
function getTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
}

// Save tasks to localStorage
function saveTasksToLocalStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks based on filter
function renderTasks(filter = 'all') {
    taskList.innerHTML = ''; // Clear current list
    const tasks = getTasksFromLocalStorage();

    tasks
        .filter(task => {
            if (filter === 'completed') return task.completed;
            if (filter === 'pending') return !task.completed;
            return true; 
        })
        .forEach(task => renderTask(task));
}

// Render a single task
function renderTask(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.id = `task-${task.id}`;

    li.innerHTML = `
        <span>${task.text}</span>
        <div>
            <button onclick="toggleTaskCompletion(${task.id})">${task.completed ? 'Undo' : 'Complete'}</button>
            <button onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `;

    taskList.appendChild(li);
}

// Add a new task
addTaskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const tasks = getTasksFromLocalStorage();
    const newTask = { id: Date.now(), text: taskInput.value, completed: false };

    tasks.push(newTask);
    saveTasksToLocalStorage(tasks);
    renderTasks(); // Refresh list

    taskInput.value = ''; // Clear input field
});

// Toggle task completion
function toggleTaskCompletion(taskId) {
    const tasks = getTasksFromLocalStorage();
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasksToLocalStorage(tasks);
        renderTasks(); // Refresh list
    }
}

// Delete a task
function deleteTask(taskId) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasksToLocalStorage(tasks);

    renderTasks(); // Refresh list
}

// Clear all tasks
clearAllButton.addEventListener('click', () => {
    localStorage.removeItem('tasks');
    renderTasks(); // Refresh list
});

// Filter tasks
viewAllButton.addEventListener('click', () => renderTasks('all'));
viewCompletedButton.addEventListener('click', () => renderTasks('completed'));
viewPendingButton.addEventListener('click', () => renderTasks('pending'));

// Load tasks on page load
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
});