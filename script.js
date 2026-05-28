const itemInput = document.getElementById('itemInput');
const priceInput = document.getElementById('priceInput');
const categoryInput = document.getElementById('categoryInput');
const priorityInput = document.getElementById('priorityInput');
const addBtn = document.getElementById('addBtn');
const shoppingList = document.getElementById('shoppingList');
const totalItems = document.getElementById('totalItems');
const completedItems = document.getElementById('completedItems');
const totalPrice = document.getElementById('totalPrice');
const progress = document.querySelector('.progress');
const progressText = document.getElementById('progressText');
const searchInput = document.getElementById('searchInput');
const exportBtn = document.getElementById('exportBtn');
const clearBtn = document.getElementById('clearBtn');
const themeToggle = document.getElementById('themeToggle');

let items = JSON.parse(localStorage.getItem('shoppingItems')) || [];

function saveItems() {
    localStorage.setItem('shoppingItems', JSON.stringify(items));
}


function updateStats() {

    totalItems.textContent = items.length;

    const completed = items.filter(item => item.completed).length;
    completedItems.textContent = completed;

    const total = items.reduce((acc, item) => acc + Number(item.price || 0), 0);
    totalPrice.textContent = total.toFixed(2);

    const percent = items.length
        ? Math.round((completed / items.length) * 100)
        : 0;

        progress.style.width = `${percent}%`;
    progressText.textContent = `${percent}%`;
}


function renderItems(filter = '') {

    shoppingList.innerHTML = '';

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(filter.toLowerCase())
    );

    filteredItems.forEach((item, index) => {

        const li = document.createElement('li');
        li.classList.add('item');

        if(item.completed) {
            li.classList.add('completed');
        }

li.innerHTML = `
            <div class="item-left">
                <input type="checkbox" ${item.completed ? 'checked' : ''}>

                <div>
                    <div class="item-name">${item.name}</div>
                    <div class="category">${item.category} • R$ ${item.price}</div>
                </div>

                ${item.priority === 'alta'
                    ? '<span class="priority alta">Prioridade Alta</span>'
                    : ''}
            </div>

            <button class="delete-btn">Excluir</button>
        `;
        const checkbox = li.querySelector('input');
        checkbox.addEventListener('change', () => {
            item.completed = checkbox.checked;
            saveItems();
            renderItems(searchInput.value);
            updateStats();
        });

        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            items.splice(index, 1);
            saveItems();
            renderItems(searchInput.value);
            updateStats();
        });

        shoppingList.appendChild(li);
    });
}

addBtn.addEventListener('click', () => {

    const name = itemInput.value.trim();
    const price = priceInput.value || 0;

    if(!name) {
        alert('Digite um item');
        return;
    }

    items.push({
        name,
        price,
        category: categoryInput.value,
        priority: priorityInput.value,
        completed: false
    });

    saveItems();
    renderItems(searchInput.value);
    updateStats();

    itemInput.value = '';
    priceInput.value = '';
    categoryInput.value = '';
    priorityInput.value = '';
});