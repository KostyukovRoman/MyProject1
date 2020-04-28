var addButton = document.getElementById('add');
var inputTask = document.getElementById('new-task');
var unfinishedTasks = document.getElementById('unfinished-tasks');
var finishedTasks = document.getElementById('finished-tasks');

function createNewElement(task, finished) { // функция для создания элемента списка (li)
    var listItem = document.createElement('li');
    var checkbox = document.createElement('button');

    if (finished) {
        checkbox.className = "material-icons checkbox";
        checkbox.innerHTML = "<i class='material-icons'>check_box</i>"; // перезаписываем
    } else {
        checkbox.className = "material-icons checkbox";
        checkbox.innerHTML = "<i class='material-icons'>check_box_outline_blank</i>";
    }


    var label = document.createElement('label');
    label.innerText = task; // передаём задачу (таск)
    var input = document.createElement('input'); // создаём поле ввода
    input.type = "text"; // тип вводимых данных
    var editButton = document.createElement('button');
    editButton.className = "material-icons edit";
    editButton.innerHTML = "<i class='material-icons'>edit</i>";
    var deleteButton = document.createElement('button');
    deleteButton.className = "material-icons delete";
    deleteButton.innerHTML = "<i class='material-icons'>delete</i>";

    listItem.appendChild(checkbox); // добавляем все элементы которые находятся выше в наш элемент списка (li)
    listItem.appendChild(label);
    listItem.appendChild(input);
    listItem.appendChild(deleteButton);
    listItem.appendChild(editButton);

    return listItem; // возвращаем список
}

function addTask() { // функция добавления элемента в список дел по нажантию на кнопку "Добавить" или на клавишу "Enter"
    if (inputTask.value) { // если значение в поле ввода (input), тогда создаём
        var listItem = createNewElement(inputTask.value, false); // создаём элемент спиcка и передаём в него значение из поля ввода (inputTask)
        unfinishedTasks.appendChild(listItem); // добавляем элемент в блок с незавершенными делами
        bindTaskEvents(listItem, finishTask)
        inputTask.value = ""; // обнуляем значение строки в которую вводили задачу
    }
    save();
}
addButton.onclick = addTask; // прикрепляем функцию к кнопке
function keyPressAddTask({ keyCode }) {
    if (keyCode === 13) {
        addTask();
    }
}

inputTask.onkeypress = keyPressAddTask;

function deleteTask() { // функция для удаления задачи
    var listItem = this.parentNode; // обращаемся к родителю этой кнопки то есть к (li)
    var ul = listItem.parentNode;
    ul.removeChild(listItem); // удаляем listItem (li) из ul
    save();
}

function editTask() { // функция по нажатию рдактирования 
    
    var editButton = this; // обращаемся к кнопке редактирования задачи
    var listItem = this.parentNode; // получим li через this
    var label = listItem.querySelector('label');
    var input = listItem.querySelector('input[type=text]');

    var containsClass = listItem.classList.contains('editMode'); // помогает понять есть ли класс едит мод на элементе списка или нет

    if (containsClass) { // если класс есть, то заменяем его текстом из инпута
        label.innerText = input.value;
        editButton.className = "material-icons edit";  
        editButton.innerHTML = "<i class='material-icons'>edit</i>";
        save();
    } else { // если не содержит класс радактировать, тогда в инпут передаём значение, которые было в нём изначально 
        input.value = label.innerText;
        editButton.className = "material-icons save";// тут уже поменяли иконку на save
        editButton.innerHTML = "<i class='material-icons'>save</i>";

    }
    listItem.classList.toggle('editMode'); // переключаем по кнопке редактирования с помощью toggle присутствие editMode
}

function finishTask() { // метод срабатывает при нажатии на чекбокс
    var listItem = this.parentNode; // получаем li
    var checkbox = listItem.querySelector('button.checkbox'); // получаем чекбокс
    checkbox.className = "material-icons checkbox";
    checkbox.innerHTML = "<i class='material-icons'>check_box</i>"; // задаём иконку с галочкой
    finishedTasks.appendChild(listItem); // перемещаем этот li в блок с завершенными задачами
    bindTaskEvents(listItem, unfinishTask);// переход в другой блок 
    save();
}

function unfinishTask() { // метод срабатывает при нажатии на чекбокс, когда элемент находился уже в завершенных делах
    var listItem = this.parentNode; // получаем li
    var checkbox = listItem.querySelector('button.checkbox'); // получаем чекбокс
    checkbox.className = "material-icons checkbox";
    checkbox.innerHTML = "<i class='material-icons'>check_box_outline_blank</i>"; // меняем иконку, чтобы без галочки была

    unfinishedTasks.appendChild(listItem);// перемещаем обратно в незавершенные дела
    bindTaskEvents(listItem, finishTask) //переход в другой блок
    save();
}

function bindTaskEvents(listItem, checkboxEvent) { // функция привязывает методы (которые описаны выше) к новому элементу во время создания, в качестве параметра будет принимать listItem (li) и значение чекбокса 
    var checkbox = listItem.querySelector('button.checkbox'); // получаем элемент чекбокс внутри li списка
    var editButton = listItem.querySelector('button.edit'); 
    var deleteButton = listItem.querySelector('button.delete');

    checkbox.onclick = checkboxEvent; // выше получили элементы и теперь здесь вешаем на них обработчики
    editButton.onclick = editTask; // вешаем действия, которые будут воспроизводиться после нажатия на кнопки
    deleteButton.onclick = deleteTask;

}

function save() { // функция сохраняет данные после перезагрузки страницы 

    var unfinishedTasksArr = []; // массив с незавершенными задачами
    for (var i = 0; i < unfinishedTasks.children.length; i++) { // обращаемся к li в незавершенных делах и узнаем длину, то есть их количество
        unfinishedTasksArr.push(unfinishedTasks.children[i].getElementsByTagName('label')[0].innerText); // закидываем все ли с внутренним текстом в блок с незавершенными делами (пушим)
    }

    var finishedTasksArr = []; // массив с завершенными задачами
    for (var i = 0; i < finishedTasks.children.length; i++) { // обращаемся к li в завершенных делах и узнаем длину, то есть их количество
        finishedTasksArr.push(finishedTasks.children[i].getElementsByTagName('label')[0].innerText); // закидываем все ли с внутренним текстом в блок с завершенными делами (пушим)
    }

    localStorage.removeItem('todo'); // чистим поле сначала, а потом уже добавляем
    localStorage.setItem('todo', JSON.stringify({
        unfinishedTasks: unfinishedTasksArr,// передаём массивы на преобразование
        finishedTasks: finishedTasksArr
    }));

}

function load() { // функция загрузки данных из локального маччива
    return JSON.parse(localStorage.getItem('todo')); // возвращает элементы обратно декодированные в объекты из строк
}

var data = load(); // при загрузке страницы мы получаем данные

for (var i = 0; i < data.unfinishedTasks.length; i++) {
    var listItem = createNewElement(data.unfinishedTasks[i], false);// перебираем элементы массива
    unfinishedTasks.appendChild(listItem); // и добавляем их в список ul с незавершенными делами
    bindTaskEvents(listItem, finishTask); // назначаем обработчики
}

for (var i = 0; i < data.finishedTasks.length; i++) {
    var listItem = createNewElement(data.finishedTasks[i], true);// перебираем элементы массива
    finishedTasks.appendChild(listItem);// и добавляем их в список ul с завершенными делами
    bindTaskEvents(listItem, unfinishTask);// назначаем обработчики
}