// HTML DOM handler
const todoDOM = (function () {
	// append a row to project
	function createTodoRow(todo) {
		const div = document.createElement("div");
		div.setAttribute("class", "todo");
		div.textContent = todo.title.concat(" : ", todo.dueDate);
		const del = document.createElement("button");
		del.textContent = "X";
		del.addEventListener("click", (event) => {
			todoHandler.deleteTodo(event.currentTarget.id.substr(7));
		});
		div.appendChild(del);
		const show = document.createElement("button");
		show.textContent = "V";
		show.addEventListener("click", (event) => {
			div.querySelector("div", class_="desc").style.display = "";
		});
		div.appendChild(show);
		
		const desc = document.createElement("div");
		desc.className = "desc";
		desc.style.display = "none";
		desc.textContent = "Priority: ".concat(todo.priority.toString(), " | ", todo.desc);
		div.appendChild(desc);
		// console.log("TODO", div.children);
		return div;
	}
	function loadProjects(projects) {
		// delete all project divs
		// https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
		const node = document.body;
		while (node.lastChild.className === "project flex-container") {
			node.removeChild(node.lastChild);
		}

		// also fix the project menu
		const menu = document.getElementById("project");
		menu.innerHTML = "";

		projects.forEach((p, i) => {
			const projectNode = document.createElement("div");
			projectNode.className = "project flex-container";
			projectNode.id = "project".concat(i.toString());
			if (p.name === "") {
				p.name = "Project";
			}
			const name = document.createElement("h1");
			name.textContent = p.name;
			projectNode.appendChild(name);
			p.todos.forEach((t, j) => {
				projectNode.append(createTodoRow(t));
				projectNode.lastChild.id = projectNode.id.concat("_", j.toString());
			});
			document.body.appendChild(projectNode);

			let menuItem = document.createElement("option");
			menuItem.value = i;
			menuItem.textContent = p.name;
			menu.appendChild(menuItem);
		});
	}

	return { createTodoRow, loadProjects };
})();

// 'todos' are objects that are dynamically created, either using factories or constructors/classes
// add properties to todo-items (title, description, dueDate, priority,, notes, checklist)
// todo list should have projects or separate lists of todos

// constructor factories
function createTodo(name, description, date, prio) {
	const title = name;
	const desc = description;
	const dueDate = date;
	const priority = prio;
	return { title, desc, dueDate, priority };
}
function createProject(projName, todoList = []) {
	const name = projName;
	const todos = todoList;
	
	function addTodo(todo) {
		todos.push(todo);
	}
	return { name, todos, addTodo };

}

const todoHandler = (function () {
	const projects = [];
	projects.push(createProject("Project"));
	todoDOM.loadProjects(projects);

	// get info from form section
	function submitForm() {
		// console.log("Submit");
		let data = document.getElementById("form").querySelectorAll("input");
		// console.log("Data", data);
		let entry = document.getElementById("project").value;
		console.log(entry)
		if (entry === "" || entry >= projects.length) {
			entry = 0;
		}
		projects[entry].addTodo(createTodo(
			data[0].value,
			data[1].value,
			data[2].value,
			data[3].value,
		));
		// projects.forEach((x) => {
		// 	console.log("Projects", x);
		// });
		todoDOM.loadProjects(projects);
	}
	// create a new project
	function addNewProject() {
		let newName = document.getElementById("new-project").value;
		projects.push(createProject(newName));
		todoDOM.loadProjects(projects);
	}
	// delete a todo
	function deleteTodo(idNum) {
		const locationP = +idNum.substring(0, idNum.indexOf("_"));
		const locationT = +idNum.substring(idNum.indexOf("_")+1);
		projects[locationP].todos.splice(locationT, 1);
		todoDOM.loadProjects(projects);
	}
	function importData() {
		console.log("importData()");
		let curr = 0;
		if (localStorage.length > 0) {
			projects.length = 0;
			while (localStorage.getItem(curr++)) {
				const currObj = JSON.parse(localStorage.getItem(curr - 1));
				projects.push(createProject(currObj["name"], currObj["todos"]));
				console.log(projects[projects.length-1]);
			}
		}
		todoDOM.loadProjects(projects);
	}

	importData();

	return { projects, submitForm, addNewProject, deleteTodo, importData };
})();

document.getElementById("submit").addEventListener("click", todoHandler.submitForm);
document.getElementById("new-proj-submit").addEventListener("click", todoHandler.addNewProject);


// localStorage
document.getElementById("export").addEventListener("click", (event) => {
	todoHandler.projects.forEach((p, i) => {
		localStorage.setItem(i, JSON.stringify(p));
	});
	console.log(localStorage);
});
document.getElementById("clear").addEventListener("click", () => {
	localStorage.clear();
});