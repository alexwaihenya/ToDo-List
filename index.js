const taskInputForm = document.querySelector(".task-input > form");
console.log(taskInputForm);

filters = document.querySelectorAll(".filters span");
clearAll = document.querySelector(".clear-btn");
taskBox = document.querySelector(".task-box");

let editId,
	isEditTask = false,
	todos = JSON.parse(localStorage.getItem("todo-list"));
filters.forEach((btn) => {
	btn.addEventListener("click", () => {
		document.querySelector("span.active").classList.remove("active");
		btn.classList.add("active");
		showTodo(btn.id);
	});
});
function showTodo(filter) {
	let liTag = "";
	if (todos) {
		todos.forEach((todo, id) => {
			let completed = todo.status == "completed" ? "checked" : "";
			if (filter == todo.status || filter == "all") {
				liTag += `<li class="task">
                            <label for="${id}">
                                <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                                <p class="${completed}">${todo.title}</p>
                            </label>
                            <p>${todo.description}</p>
                            <p>${new Date(todo.dueDate).toLocaleDateString()}</p>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="task-menu">
                                    <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </li>`;
			}
		});
	}
	taskBox.innerHTML = liTag || `<span>You don't have any task here</span>`;
	let checkTask = taskBox.querySelectorAll(".task");
	!checkTask.length
		? clearAll.classList.remove("active")
		: clearAll.classList.add("active");
	taskBox.offsetHeight >= 300
		? taskBox.classList.add("overflow")
		: taskBox.classList.remove("overflow");
}
showTodo("all");
function showMenu(selectedTask) {
	let menuDiv = selectedTask.parentElement.lastElementChild;
	menuDiv.classList.add("show");
	document.addEventListener("click", (e) => {
		if (e.target.tagName != "I" || e.target != selectedTask) {
			menuDiv.classList.remove("show");
		}
	});
}
function updateStatus(selectedTask) {
	let taskName = selectedTask.parentElement.lastElementChild;
	if (selectedTask.checked) {
		taskName.classList.add("checked");
		todos[selectedTask.id].status = "completed";
	} else {
		taskName.classList.remove("checked");
		todos[selectedTask.id].status = "pending";
	}
	localStorage.setItem("todo-list", JSON.stringify(todos));
}
function editTask(taskId, textName) {
	editId = taskId;
	console.log(editId);
	isEditTask = true;
	// taskInputForm.value = textName;
	// taskInputForm.focus();
	// taskInputForm.classList.add("active");

	
}
function deleteTask(deleteId, filter) {
	isEditTask = false;
	todos.splice(deleteId, 1);
	localStorage.setItem("todo-list", JSON.stringify(todos));
	showTodo(filter);
}
clearAll.addEventListener("click", () => {
	isEditTask = false;
	todos.splice(0, todos.length);
	localStorage.setItem("todo-list", JSON.stringify(todos));
	showTodo();
});
taskInputForm.addEventListener("submit", (e) => {
	e.preventDefault();

	const userTask = {};
	for (const input of taskInputForm) {
		if (input.tagName === "INPUT") {
			Object.assign(userTask, { [input.id]: input.value.trim() });
		}
	}

	if (!isEditTask) {
		// todos = !todos ? [] : todos;
		todos = todos || [];
		let taskInfo = { ...userTask, status: "pending" };
		todos.push(taskInfo);
	} else {
		isEditTask = false;
		todos[editId].name = userTask;
	}
	taskInputForm.reset();
	localStorage.setItem("todo-list", JSON.stringify(todos));
	showTodo(document.querySelector("span.active").id);
});
