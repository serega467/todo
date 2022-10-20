// Находим элементы на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

//Создадим массив, который будет хранить в себе все задачи
let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach ( (task) => renderTask(task));
}



checkEmptyList();

// Добавление задачи
form.addEventListener('submit', addTask);

//Удаление задачи -- логику которой, мы опишем ниже
tasksList.addEventListener('click', deleteTask);

// Отмечаем задачу завершенной
tasksList.addEventListener('click', doneTask)


// function declaration позволяет вызывать функции до того, как они были объявлены (ф-ия
// была объявлена на 10-ой строке кода, а вызвали мы её ранее, на 7-ой строке кода!)
function addTask (event) {
     // Отменяем отправку формы
     event.preventDefault();

     // Достаем текст задачи из поля ввода
     const taskText = taskInput.value
    // Описываем задачу в виде объекта
     const newTask = {
        id: Date.now(),   // Будет сформировано текущее время в миллисекундах, чтобы создать только одну задачу
        text: taskText,
        done: false      // На старте, когда мы создаем задачу, она еще не выполнена 
     };

     // Добавляем задачу в конец массива с задачами
     tasks.push(newTask);
     
     // Сохраняем список задач в хранилище браузера LocalStorage
     saveToLocalStorage();

     // Рендерим задачу на странице
     renderTask(newTask);
 
 // Ощищаем поле ввода и возвращаем на него фокус
 taskInput.value = "";
 taskInput.focus();

}

function deleteTask(event) {
    // Проверяем что клик был по кнопке "удалить задачу"
    if (event.target.dataset.action !== 'delete') return;
        
        const parenNode = event.target.closest('.list-group-item');
        //console.log(parenNode); // Проверяем через консоль, удаление задач

        // Определяем ID задачи
        const id = Number(parenNode.id);
        
        // Находим индекс задачи в массиве
        const index = tasks.findIndex ((task) => task.id === id);

        // Удаляем задачу из массива с задачами
        tasks.splice(index, 1);

        // Сохраняем список задач в хранилище браузера LocalStorage
     saveToLocalStorage();

        // Удаляем задачу из разметки
        parenNode.remove(); 

        checkEmptyList();
}

function doneTask (event) {
    // Проверяем что клик был по кнопке "задача выполнена"
    if (event.target.dataset.action === "done") {
       const parentNode = event.target.closest('.list-group-item');

       //Определяем ID задачи
        const id = Number (parentNode.id);
        const task = tasks.find ( (task) => task.id === id)

        task.done = !task.done

        // Сохраняем список задач в хранилище браузера LocalStorage
     saveToLocalStorage();

       const taskTitle = parentNode.querySelector('.task-title');
       taskTitle.classList.toggle('task-title--done');
       
    }
}

/* Правильные способ хранения данных в localStorage: заключается в следующем:
нам необходимо создать массив со всеми задачами, хранить в localStorage только данные по задачам
т.е. только название задачи и какие либо другие данные: такие как статус задачи и получая эти 
данные рендерить их на странице (отображать их). */

function checkEmptyList() {
    if (tasks.lenght === 0) {
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
        <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
        <div class="empty-list__title">Список дел пуст</div>
    </li>`;
    tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }

    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyList ? emptyListEl.remove() : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
    const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

    // Формируем разметку для новой задачи
    const taskHTML = ` 
    <li id = "${task.id}" class="list-group-item d-flex justify-content-between task-item">
    <span class="${cssClass}">${task.text}</span>
    <div class="task-item__buttons">
        <button type="button" data-action="done" class="btn-action">
            <img src="./img/tick.svg" alt="Done" width="18" height="18">
        </button>
        <button type="button" data-action="delete" class="btn-action">
            <img src="./img/cross.svg" alt="Done" width="18" height="18">
        </button>
    </div>
</li>`;

// Добавляем задачу на страницу
tasksList.insertAdjacentHTML('beforeend', taskHTML);
}