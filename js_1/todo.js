const API_KEY = '8b0ebf32-8047-4bc6-a572-b8d7bab2bcbd';
const API_URL = 'https://js1-todo-api.vercel.app/api/todos';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const list = document.getElementById('todo-list');
    
    fetchTodos();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = input.value.trim();

        if (title === '') return;

        try {
            const res = await fetch(`${API_URL}?apikey=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title })
            });

            const newTodo = await res.json();
            addTodoToDOM(newTodo);
            input.value = '';
        } catch (err) {
            console.error('Error adding todo:', err);
        }
    });

    async function fetchTodos() {
        try {
            const res = await fetch(`${API_URL}?apikey=${API_KEY}`);
            const todos = await res.json();

            list.innerHTML = '';
            todos.forEach(todo => addTodoToDOM(todo));
        } catch (err) {
            console.error('Error fetching todos:', err);
        }
    }

    function addTodoToDOM(todo) {
        const li = document.createElement('li');
        li.textContent = todo.title;

        
        if (todo.completed) {
            li.classList.add('completed');
        }

       
        const completeBtn = document.createElement('button');
        completeBtn.textContent = 'Complete';
        completeBtn.onclick = () => markAsComplete(todo._id, li);

        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteTodo(todo._id, li);

        
        if (todo.completed) {
            deleteBtn.style.display = 'inline-block'; 
        } else {
            deleteBtn.style.display = 'none'; 
        }

        li.appendChild(completeBtn);
        li.appendChild(deleteBtn);
        list.appendChild(li);
    }

    
    async function markAsComplete(id, li) {
        try {
            const res = await fetch(`${API_URL}/${id}?apikey=${API_KEY}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: true })
            });

            if (res.ok) {
                
                li.classList.add('completed');
                const deleteBtn = li.querySelector('button:last-child');
                deleteBtn.style.display = 'inline-block';
            } else {
                console.error('Failed to mark todo as complete');
            }
        } catch (err) {
            console.error('Error updating todo:', err);
        }
    }

    async function deleteTodo(id, li) {
        try {
            const res = await fetch(`${API_URL}/${id}?apikey=${API_KEY}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                li.remove(); 
            } else {
                console.error('Failed to delete todo');
            }
        } catch (err) {
            console.error('Error deleting todo:', err);
        }
    }
});

