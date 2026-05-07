

// HTML elemanlarını seçiyoruz
const input = document.getElementById('todoInput');
const actionBtn = document.getElementById('actionBtn');
const todoList = document.getElementById('todoList');

// Uygulama Durumu (State)
let todos = JSON.parse(localStorage.getItem('todos')) || []; // LocalStorage'dan verileri çek, yoksa boş dizi
let editMode = false; // Düzenleme modunda mıyız?
let editId = null;    // Hangi görevi düzenliyoruz?

// Sayfa ilk açıldığında listeyi ekrana bas
renderTodos();

// EKLE/KAYDET butonuna basıldığında
actionBtn.addEventListener('click', () => {
    const text = input.value.trim(); // Boşlukları temizle
    if (text === "") return; // Boş görev ekleme

    if (editMode) {
        // Düzenleme Modu: Mevcut görevi güncelle
        todos = todos.map(todo => todo.id === editId ? { ...todo, text: text } : todo);
        editMode = false;
        editId = null;
        actionBtn.innerText = "Ekle";
    } else {
        // Ekleme Modu: Yeni görev oluştur
        const newTodo = {
            id: Date.now(), // Benzersiz ID için zaman damgası
            text: text,
            completed: false
        };
        todos.push(newTodo);
    }

    saveAndRender();
    input.value = ""; // Inputu temizle
});

// ENTER tuşu desteği
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') actionBtn.click();
});

// Listeyi ekrana basan fonksiyon
function renderTodos() {
    todoList.innerHTML = ""; // Listeyi temizle
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="${todo.completed ? 'completed' : ''}" onclick="toggleComplete(${todo.id})">${todo.text}</span>
            <div>
                <button class="edit-btn" onclick="startEdit(${todo.id})">Düzenle</button>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">Sil</button>
            </div>
        `;
        todoList.appendChild(li);
    });
}

// Tamamlandı durumunu değiştir
function toggleComplete(id) {
    todos = todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo);
    saveAndRender();
}

// Silme işlemi
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveAndRender();
}

// Düzenleme modunu başlat
function startEdit(id) {
    const todoToEdit = todos.find(todo => todo.id === id);
    input.value = todoToEdit.text; // Metni inputa taşı
    input.focus();
    editMode = true;
    editId = id;
    actionBtn.innerText = "Kaydet"; // Buton yazısını değiştir
}

// Verileri kaydet ve ekranı güncelle
function saveAndRender() {
    localStorage.setItem('todos', JSON.stringify(todos)); // Veriyi LocalStorage'a göm
    renderTodos(); // Listeyi yeniden çiz
}