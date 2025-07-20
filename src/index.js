import "./style.css";
import {Project, visualSort} from "./todo.js";
import projectSymbol from "./images/book-variant.svg";
import completed from "./images/book-plus.svg";
import incomplete from "./images/book-minus.svg";

//TODO: replace with localStorage
//TODO: work on date sort
//TODO: delete enetry button
let projectList = []
let cardList = new visualSort(projectList);
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
            text.value = projectList[i].projectTitle;
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

function listDisplay(){
    function createCard(listItem){
        let card = document.createElement("div");
        card.classList.add("card");
        card.dataset.id = listItem.id;

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
        let project = projectName.textContent;
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
        return {card, project}
    }

    function showCard(createdCard){
        const cardsShown = document.querySelector("#todo-list");
        cardsShown.appendChild(createdCard.card);
        const delButton = document.createElement("button");
        delButton.classList.add("del");
        delButton.addEventListener("click", deleteCard);
        createdCard.card.appendChild(delButton)

        function deleteCard(){
            cardsShown.removeChild(createdCard.card);
            let projectLocation = projectList.findIndex((item) => item.projectTitle == createdCard.project);
            if(projectLocation != -1){
                let todoLocation = projectList[projectLocation].todo.findIndex((item) => item.id == createdCard.card.dataset.id);
                if(todoLocation != -1){
                    projectList[projectLocation].todo.splice(todoLocation, 1);
                }
                else console.log("id was not found in array")
            }
            else console.log("project was not found in array")
            console.log(projectList);
        }
    }
    
    function updateList(){
        for(let i = 0 ; i < cardList.list.length; i++){
            listDisplay().showCard(listDisplay().createCard(cardList.list[i]));
        }
    }
    return {createCard, showCard, updateList}
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
                listDisplay().showCard(listDisplay().createCard(task))
                cardList.resetSorting();
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

    let unassigned = new Project("Unassigned");
    addToList(unassigned);

    test.addToDo("test", "testing", "2025-07-22", "1")
    test.addToDo("test2", "testing2", "2025-07-23", "2")
    test.addToDo("test3", "testing3", "2025-07-24", "1")
    test.addToDo("test4", "testing4", "2025-07-25", "2")
    test.addToDo("test5", "testing5", "2026-07-26", "0")
    test.addToDo("test6", "testing6", "2025-09-23", "1")
    
    unassigned.addToDo("test", "testing", "2025-07-22", "1")
    unassigned.addToDo("test2", "testing2", "2025-07-23", "2")
    unassigned.addToDo("test3", "testing3", "2025-07-24", "1")
    unassigned.addToDo("test4", "testing4", "2025-07-25", "2")
    unassigned.addToDo("test5", "testing5", "2026-07-26", "0")
    unassigned.addToDo("test6", "testing6", "2025-09-23", "1")

    cardList.resetSorting();
    cardList.sortCompletion("both");
    listDisplay().updateList();
}

dummyData();


linkDOM();