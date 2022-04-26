'use strict';
//定数の定義
const todoValue = document.getElementById("js-todo-ttl"); //入力欄
const todoRegister = document.getElementById("js-register-btn"); //登録ボタン
const todoAllRemove = document.getElementById("js-allremove-btn");//全削除ボタン
const todoList = document.getElementById("js-todo-list"); //todolist
const doneList = document.getElementById("js-done-list"); //donelist
let listItems = []; //todolist配列  item = { todoValue: todoValue.value, isDone: false, isDeleted: false };
const storage = localStorage;

//DOM構築
const createTodoList = (item) => {
    const todo = document.createTextNode(item.todoValue);
    const litag = document.createElement("li");
    const ptag = document.createElement("p");

    //ul>li>p構造を作る
    ptag.appendChild(todo);
    litag.appendChild(ptag);

    if (item.isDone === false) {
        todoList.appendChild(litag);
    } else if (item.isDone === true) {
        doneList.appendChild(litag);
        litag.classList.add("done-item");
    }

    //ボタンを入れるdiv
    const btn_box = document.createElement("div");
    btn_box.classList.add("btn-box");
    litag.appendChild(btn_box);

    //トグルボタン
    const togglebtn = document.createElement("button");
    if (item.isDone === false) {
        togglebtn.textContent = '完了';
    } else if (item.isDone === true) {
        togglebtn.textContent = '戻す';
    }
    btn_box.appendChild(togglebtn);

    //トグル機能の追加
    togglebtn.addEventListener("click", () => toggleTodo(togglebtn));

    //削除ボタン追加
    const delbtn = document.createElement("button");
    delbtn.textContent = "削除";
    btn_box.appendChild(delbtn);

    //削除機能追加
    delbtn.addEventListener("click", () => deleteTodo(delbtn));
}

//アップデート処理
const updateValue = (btnName, property, value, filter) => {
    const getParent = btnName.closest('div');
    const todoTxt = getParent.previousElementSibling;
    const changeValue = listItems.find(item => item.todoValue == todoTxt.textContent);
    changeValue[property] = value; //ピリオドでプロパティにアクセスするとなぜかエラーになるので[]でアクセス
    if (filter) {
        const newlistItems = listItems.filter(item => item[property] === false);
        listItems = newlistItems;
    }
    storage.store = JSON.stringify(listItems);
}

//登録ボタンイベント
todoRegister.addEventListener('click', () => {
    if (todoValue.value === '') {
        return
    }
    const registeredValue = listItems.find(item => item.todoValue == todoValue.value);
    if (registeredValue === undefined) {
        const item = { todoValue: todoValue.value, isDone: false, isDeleted: false };
        listItems.push(item);
        storage.store = JSON.stringify(listItems);
        createTodoList(item);
        todoValue.value = '';
    } else {
        alert(
            "タスクが重複しています"
        );
    }
});

//全削除ボタン
todoAllRemove.addEventListener("click", () => {
    delete storage.store;
    location.reload();
});

//todo削除機能
const deleteTodo = (delbtn) => {
    const choseTodo = delbtn.closest('li');
    if (choseTodo.classList.contains('done-item')) {
        doneList.removeChild(choseTodo);
    } else {
        todoList.removeChild(choseTodo);
    }
    updateValue(delbtn, "isDeleted", true, true);
};

//トグルボタン機能
const toggleTodo = (togglebtn) => {
    const toggleTodo = togglebtn.closest('li');
    if (togglebtn.textContent === '完了') {
        toggleTodo.classList.add('done-item');
        doneList.appendChild(toggleTodo);
        togglebtn.textContent = "戻す"
        updateValue(togglebtn, "isDone", true, false);
        storage.store = JSON.stringify(listItems);
    } else if (togglebtn.textContent === '戻す') {
        toggleTodo.classList.remove('done-item'); //toggletodoのクラスを空に
        todoList.appendChild(toggleTodo);//doneリストからtodoリストへ再挿入
        togglebtn.textContent = "完了" //完了に戻す
        updateValue(togglebtn, "isDone", false, false);
        storage.store = JSON.stringify(listItems);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const json = storage.store;
    if (json === undefined) { return; }
    listItems = JSON.parse(json);
    for (const item of listItems) { createTodoList(item); }
});
