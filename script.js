document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const taskInput = document.getElementById('new-task');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const tasksLeft = document.getElementById('tasks-left');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const prioritySelect = document.getElementById('task-priority');
    
    // Task array
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Initialize the app
    function init() {
        renderTasks();
        updateTaskCounter();
        setActiveFilter('all');
    }
    
    // Render tasks based on current filter
    function renderTasks(filter = 'all') {
        taskList.innerHTML = '';
        
        let filteredTasks = [];
        if (filter === 'all') {
            filteredTasks = tasks;
        } else if (filter === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (filter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }
        
        if (filteredTasks.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = filter === 'all' ? 'No tasks yet. Add one above!' : 
                                      filter === 'active' ? 'No active tasks!' : 'No completed tasks!';
            emptyMessage.classList.add('empty-message');
            taskList.appendChild(emptyMessage);
        } else {
            filteredTasks.forEach((task, index) => {
                const taskItem = createTaskElement(task, index);
                taskList.appendChild(taskItem);
            });
        }
    }
    
    // Create a task element
    function createTaskElement(task, index) {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item', task.priority || 'medium');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('task-checkbox');
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTaskComplete(index));
        
        const taskText = document.createElement('span');
        taskText.classList.add('task-text');
        if (task.completed) {
            taskText.classList.add('completed');
        }
        taskText.textContent = task.text;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTask(index);
        });
        
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskText);
        taskItem.appendChild(deleteBtn);
        
        return taskItem;
    }
    
    // Add a new task
    function addTask() {
        const text = taskInput.value.trim();
        if (text) {
            tasks.push({
                text,
                completed: false,
                priority: prioritySelect.value
            });
            saveTasks();
            taskInput.value = '';
            renderTasks(getCurrentFilter());
            updateTaskCounter();
        }
    }
    
    // Toggle task completion status
    function toggleTaskComplete(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks(getCurrentFilter());
        updateTaskCounter();
    }
    
    // Delete a task
    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks(getCurrentFilter());
        updateTaskCounter();
    }
    
    // Clear all completed tasks
    function clearCompletedTasks() {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks(getCurrentFilter());
        updateTaskCounter();
    }
    
    // Update task counter
    function updateTaskCounter() {
        const activeTasks = tasks.filter(task => !task.completed).length;
        tasksLeft.textContent = `${activeTasks} ${activeTasks === 1 ? 'task' : 'tasks'} left`;
    }
    
    // Set active filter
    function setActiveFilter(filter) {
        filterBtns.forEach(btn => {
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    // Get current filter
    function getCurrentFilter() {
        const activeBtn = document.querySelector('.filter-btn.active');
        return activeBtn ? activeBtn.dataset.filter : 'all';
    }
    
    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Event Listeners
    addTaskBtn.addEventListener('click', addTask);
    
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            setActiveFilter(filter);
            renderTasks(filter);
        });
    });
    
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    
    // Initialize the app
    init();
});