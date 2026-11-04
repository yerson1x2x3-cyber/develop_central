function showPage(pageId) {
    document.querySelectorAll('.page-section').forEach(el => el.classList.add('d-none'));
    const selectedPage = document.getElementById('page-' + pageId);
    if (selectedPage) selectedPage.classList.remove('d-none');
    
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    const activeNav = document.getElementById('nav-' + pageId);
    if (activeNav) activeNav.classList.add('active');
}

let tasks = [
    { id: 1, title: 'Definir el Manifiesto Ágil del equipo', category: 'Scrum', status: 'todo' },
    { id: 2, title: 'Configurar GitHub Project (Tablero Kanban)', category: 'Kanban', status: 'progress' },
    { id: 3, title: 'Ejecutar pruebas unitarias (XP / QA)', category: 'XP', status: 'done' }
];

function renderTasks() {
    const colTodo = document.getElementById('col-todo');
    const colProgress = document.getElementById('col-progress');
    const colDone = document.getElementById('col-done');

    if (!colTodo || !colProgress || !colDone) return;

    colTodo.innerHTML = '';
    colProgress.innerHTML = '';
    colDone.innerHTML = '';

    tasks.forEach(task => {
        const badgeClass = task.category === 'Scrum' ? 'badge-scrum' : (task.category === 'Kanban' ? 'badge-kanban' : 'badge-xp');
        
        const cardHtml = `
            <div class="kanban-card border">
                <span class="badge ${badgeClass} mb-2">${task.category}</span>
                <p class="fw-semibold mb-2">${task.title}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        ${task.status !== 'todo' ? `<button onclick="moveTask(${task.id}, 'prev')" class="btn btn-sm btn-outline-secondary py-0 px-2 me-1"><i class="bi bi-chevron-left"></i></button>` : ''}
                        ${task.status !== 'done' ? `<button onclick="moveTask(${task.id}, 'next')" class="btn btn-sm btn-outline-secondary py-0 px-2"><i class="bi bi-chevron-right"></i></button>` : ''}
                    </div>
                    <button onclick="deleteTask(${task.id})" class="btn btn-sm btn-link text-danger p-0"><i class="bi bi-trash"></i></button>
                </div>
            </div>
        `;

        if (task.status === 'todo') colTodo.innerHTML += cardHtml;
        else if (task.status === 'progress') colProgress.innerHTML += cardHtml;
        else if (task.status === 'done') colDone.innerHTML += cardHtml;
    });
}

function moveTask(id, direction) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const statuses = ['todo', 'progress', 'done'];
    let currentIndex = statuses.indexOf(task.status);
    
    if (direction === 'next' && currentIndex < 2) {
        task.status = statuses[currentIndex + 1];
    } else if (direction === 'prev' && currentIndex > 0) {
        task.status = statuses[currentIndex - 1];
    }
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
}

document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    if (taskForm) {
        taskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const title = document.getElementById('taskTitle').value;
            const category = document.getElementById('taskCategory').value;
            
            const newTask = {
                id: Date.now(),
                title: title,
                category: category,
                status: 'todo'
            };

            tasks.push(newTask);
            renderTasks();

            const modalElement = document.getElementById('newTaskModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) modal.hide();
            taskForm.reset();
        });
    }

    renderTasks();
});