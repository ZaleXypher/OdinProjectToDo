import "./style.css";
import {Project, visualList} from "./todo.js";
import projectSymbol from "./images/book-variant.svg";
import completed from "./images/book-plus.svg";
import incomplete from "./images/book-minus.svg";

/*TODO: replace with localStorage */
let projectList = []
function addToList(project){
    projectList.push(project);
    showProjects();
    updateFormList();

    function showProjects(){
        const list = document.querySelector(".project-list");
        list.replaceChildren();
        for(let i = 0; i < projectList.length; i++){
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

    function updateFormList(){
        const list = document.querySelector("#task-project");
        list.replaceChildren();
        for(let i = 0; i < projectList.length; i++){
            let project = document.createElement("option");
            project.value = projectList[i].projectTitle;
            project.textContent = projectList[i].projectTitle;
            list.appendChild(project);
        }
    }
}

function showList(){
    function createCard(listItem){
        let card = document.createElement("div");
        card.classList.add("card");

        let title = document.createElement("div");
        title.classList.add("title");
        title.textContent = listItem.taskTitle;
        card.appendChild(title);

        let completion = document.createElement("div");
        completion.classList.add("completion-button")
        let complete = document.createElement("button");
        complete.setAttribute("type", "button");
        complete.classList.add("complete-button");
        let completeIcon = document.createElement("img");
        checkCompletion();
        completion.appendChild(completeIcon);
        completion.appendChild(complete);
        completion.addEventListener("click", () => {listItem.completion = !listItem.completion; checkCompletion()})
        card.appendChild(completion);

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

        switch (listItem.priority){
            case "2":
                card.classList.add("high");
                break;
            case "1":
                card.classList.add("med");
                break;
            case "0":
                card.classList.add("low");
                break;
        }
        
        function checkCompletion(){
            if(listItem.completion == 1){
                completeIcon.src = completed
                complete.textContent = "Complete";
            }
            else{
                completeIcon.src = incomplete
                complete.textContent = "Incomplete";
            }
        };
        return card
    }
    function showCard(card){
        const cardsShown = document.querySelector("#todo-list")
        cardsShown.appendChild(card)
    }
    return {createCard, showCard}
}

function processForm(){
    function processProject(){
        const projDialog = document.querySelector("#project-form");
        let projTitle = projDialog.querySelector("#project-title").value;
        let projCreate = new Project(projTitle);
        addToList(projCreate);
        projDialog.reset();
    }

    function processTask(){
        const taskDialog = document.querySelector("#task-form");
        let taskName = taskDialog.querySelector("#task-title").value;
        let taskDescription = taskDialog.querySelector("#task-description").value;
        let dueBy = taskDialog.querySelector("#task-due").value;
        let priority = taskDialog.querySelector("#task-priority").value;
        let project = taskDialog.querySelector("#task-project").value;

        for(let i = 0; i < projectList.length; i++){
            if(projectList[i].projectTitle == project){
                let task = projectList[i].addToDo(taskName, taskDescription, dueBy, priority);
                console.log(task);
                showList().showCard(showList().createCard(task))
                break;
            }
        }

        taskDialog.reset(); 
    }
    
    return {processProject, processTask}
}

function linkDOM(){
    function linkDialog(){
        const addTask = document.querySelector("#add-task");
        const taskDialog = document.querySelector("#task");
        const closeTask = taskDialog.querySelector(".close-dialog")
        const submitTask = taskDialog.querySelector(".submit-form")
        addTask.addEventListener("click", () => taskDialog.showModal());
        closeTask.addEventListener("click", () => taskDialog.close());
        submitTask.addEventListener("click", () => processForm().processTask());
    
        const addProject = document.querySelector("#add-project");
        const projDialog = document.querySelector("#project");
        const closeProj = projDialog.querySelector(".close-dialog");
        const submitProj = projDialog.querySelector(".submit-form")
        addProject.addEventListener("click", () => projDialog.showModal());
        closeProj.addEventListener("click", () => projDialog.close());
        submitProj.addEventListener("click", () => processForm().processProject());
    }

    linkDialog();
}

function dummyData(){
    let test = new Project("Testing")
    addToList(test);

    test.addToDo("test", "testing", "Wednesday, 17-12 03:24", "1")
    test.addToDo("test2", "testing2", "date2", "2")
    test.addToDo("test2", "testing2", "date2", "2")
    test.addToDo("test2", "testing2", "date2", "2")

    let todo = new visualList(projectList);
    todo.resetList();
    for(let i = 0; i < todo.list.length; i++){
        showList().showCard(showList().createCard(todo.list[i]))
    }
}

//dummyData();

let unassigned = new Project("Unassigned");
addToList(unassigned);
linkDOM();