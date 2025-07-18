import "./style.css";
import {Project} from "./todo.js";
import projectSymbol from "./images/book-plus.svg";

/*TODO: replace with localStorage */
let projectList = []
function addToList(project){
    projectList.push(project);
    showProjects();

    function showProjects(){
        for(let i = 0; i < projectList.length; i++){
            const list = document.querySelector(".project-list")
            let project = document.createElement("div");
            project.classList.add("project");
            let image = document.createElement("img");
            image.src = projectSymbol;
            project.appendChild(image);
            let text = document.createElement("button");
            text.textContent = projectList[i].projectTitle;
            project.appendChild(text);
            list.appendChild(project);
        }
    }
}

class createList {
    constructor (list){
        this.logicTodo = list;
        this.visualList = [];
    }

    get list(){
        return this.visualList;
    }
    
    resetList(){
        this.visualList = [];
        for(let i = 0; i < this.logicTodo.length; i++){
            for(let o = 0; o < this.logicTodo[i].todo.length; o++){
                this.visualList.push(this.logicTodo[i].todo[o]);
            }
        }
    }

    sortPriority(){
        function high(){
            this.visualList.sort((a, b) => b.priority - a.priority)
        }
        function low(){
            this.visualList.sort((a, b) => a.priority - b.priority)
        }
        return {high, low}
    }
    
    sortDue(){
        function closest(){

        }
        function furthest(){

        }
    }

    sortProject(project){
        this.visualList = [];
        for(let i = 0; i < this.logicTodo; i++){
            if(project == this.logicTodo[i]){
                this.visualList.push(this.logicTodo[i]);
            }
        }
    }
}

function showList(list){
    function showCard(listItem){
        const container = document.querySelector("#todo-list");

        let card = document.createElement("div");
        card.classList.add("card");

        let title = document.createElement("div");
        title.classList.add("title");
        title.textContent = listItem.taskTitle;
        card.appendChild(title);

        let complete = document.createElement("button");
        complete.setAttribute("type", "button");
        complete.classList.add("complete-button");
        complete.textContent = "Incomplete";
        card.appendChild(complete);

        let description = document.createElement("div");
        description.classList.add("description");
        description.textContent = listItem.taskDescription;
        card.appendChild(description);

        let projectName = document.createElement("div");
        projectName.classList.add("project-name");
        projectName.textContent = listItem.project;
        card.appendChild(projectName);

        let date = document.createElement("div");
        date.classList.add("due");
        date.textContent = listItem.due;
        card.appendChild(date);

        let priority = document.createElement("div");
        priority.classList.add("priority")
        switch (listItem.priority){
            case "2":
                priority.textContent = "High";
                priority.classList.add("high");
                break;
            case "1":
                priority.textContent = "Medium";
                priority.classList.add("med");
                break;
            case "0":
                priority.textContent = "Low";
                priority.classList.add("low");
                break;
        }
        card.appendChild(priority);
        
        container.appendChild(card);
    }
    for(let i = 0; i < list.length; i++){
        showCard(list[i])
    }
}

let test = new Project("Testing")
test.addToDo("test", "testing", "Wednesday, 17-12 03:24", "1")
test.addToDo("test2", "testing2", "date2", "2")
test.addToDo("test2", "testing2", "date2", "2")
test.addToDo("test2", "testing2", "date2", "2")
addToList(test);

let todo = new createList(projectList);
todo.resetList();
console.log(todo.list);

showList(todo.list);