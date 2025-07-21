import "./style.css";
import {Project, visualSort} from "./todo.js";
import projectSymbol from "./images/book-variant.svg";
import completed from "./images/book-plus.svg";
import incomplete from "./images/book-minus.svg";
import trash from "./images/trash-can.svg";

function addToList(project){
    projectList.push(project);
    listDisplay().showProjects();
    updateFormList();

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
        delButton.textContent = "Delete";
        delButton.addEventListener("click", deleteCard);
        createdCard.card.appendChild(delButton);

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
        }
    }
    
    function updateList(){
        const todoList = document.querySelector("#todo-list");
        todoList.innerHTML = '';
        for(let i = 0 ; i < cardList.list.length; i++){
            listDisplay().showCard(listDisplay().createCard(cardList.list[i]));
        }
    }

    function showProjects(){
        const list = document.querySelector(".project-list");
        list.replaceChildren();
        console.log(projectList.length);
        for(let i = 0; i < projectList.length; i++){
            let project = document.createElement("div");
            project.classList.add("project");

            let image = document.createElement("img");
            image.src = projectSymbol;

            let text = document.createElement("button");
            text.value = projectList[i].projectTitle;
            text.textContent = projectList[i].projectTitle;

            let delImg = document.createElement("img");
            delImg.src = trash;
            delImg.classList.add("del-img");
            delImg.addEventListener("click", () => {
                list.removeChild(project);
                projectList.splice(projectList.findIndex(() => projectList.projectTitle == text.value), 1);
                localStor().saveList();
            })
            
            project.appendChild(delImg);
            project.appendChild(image);
            project.appendChild(text);
            list.appendChild(project);
        }
    }

 return {createCard, showCard, updateList, showProjects}
}

function processForm(){
    function processProject(){
        const projDialog = document.querySelector("#project-form");
        let projTitle = projDialog.querySelector("#project-title").value;
        let projCreate = new Project(projTitle);
        addToList(projCreate);
        projDialog.reset();
        localStor().saveList(projectList);
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
        localStor().saveList(projectList);
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

    function linkSort(){
        let currView = "show-all"
        let currProj = "show-all";
        let currCompletion = "both";
        let completion = document.querySelector("#show-complete");
        completion.addEventListener("change", () => currCompletion = completion.value);
        let currSort = "low-priority";
        let sort = document.querySelector("#sort");
        sort.addEventListener("change", () => currSort = sort.value);
        const showAll = document.querySelector("#show-all");
        showAll.addEventListener("click", () => {cardList.resetSorting(); listDisplay().updateList(); currProj = "show-all"; currView = "show-all"});

        const today = document.querySelector("#today");
        today.addEventListener("click", () => {cardList.sortDue().today(); listDisplay().updateList(); currView = "today";});

        const upcoming = document.querySelector("#upcoming");
        upcoming.addEventListener("click", () => {cardList.sortDue().future(); listDisplay().updateList(); currView = "upcoming";});

        const past = document.querySelector("#past");
        past.addEventListener("click", () => {cardList.sortDue().past(); listDisplay().updateList(); currView = "past";});

        const projects = document.querySelectorAll(".project>button");
        for(let i = 0; i < projects.length; i++){
            projects[i].addEventListener("click", () => {cardList.resetSorting(); cardList.sortProject(projects[i].value); listDisplay().updateList(); currProj = projects[i].value; currView = "project";})
        }

        const sorter = document.querySelectorAll("#top-bar select");
        for(let i = 0; i < sorter.length; i++){
            sorter[i].addEventListener("change", () => reSort(currView, currProj, currCompletion, currSort))
        }
    }

    function reSort(view, proj, completion, sort){
        switch(view){
            case "show-all":
                cardList.resetSorting(); 
                listDisplay().updateList();
                break;
            case "project":
                switch(proj){
                    case "show-all":
                        break;
                    default:
                        cardList.resetSorting(); 
                        cardList.sortProject(proj);
                        listDisplay().updateList();
                        break;
                }
            case "today":
                cardList.sortDue().today(); 
                listDisplay().updateList();
                break;
            case "upcoming":
                cardList.sortDue().future(); 
                listDisplay().updateList();
                break;
            case "past":
                cardList.sortDue().past(); 
                listDisplay().updateList();
                break;

        }

        switch(completion){
            default:
                cardList.sortCompletion(completion);
                listDisplay().updateList();
                break;
        }

        switch(sort){
            case "low-priority":
                cardList.sortPriority().low();
                listDisplay().updateList();
                break;
            case "high-priority":
                cardList.sortPriority().high();
                listDisplay().updateList();
                break;
            case "closest-due":
                cardList.sortDue().closest();
                listDisplay().updateList();
                break;
            case "furthest-due":
                cardList.sortDue().furthest();
                listDisplay().updateList();
                break;
        }
    }

    linkSort();
    linkDialog();
}

function dummyData(){
    let test = new Project("Testing")
    addToList(test);
    test.addToDo("test", "testing", "2025-07-21", "1")
    test.addToDo("test2", "testing2", "2025-07-20", "2")
    test.addToDo("test3", "testing3", "2025-07-22", "1")
    test.addToDo("test4", "testing4", "2025-07-19", "2")
    test.addToDo("test5", "testing5", "2026-07-26", "0")
    test.addToDo("test6", "testing6", "2025-09-23", "1")
    cardList.resetSorting();
    cardList.sortCompletion("both");
}

function localStor(){
    function saveList(list){
        let data = JSON.stringify(list);
        localStorage.setItem("data", data);
    }

    function retrieveList(){
        let data = localStorage.getItem("data");
        let result = [];
        if(data == "undefined"){
            result = [];
            saveList();
        }
        else result = JSON.parse(data);
        return result;
    }

    return {saveList, retrieveList}
}

function init(){
    window.projectList = localStor().retrieveList();
    if(projectList == null || !projectList.find((item) => item.projectTitle == "Unassigned")){
        if(projectList == null){
            projectList = []
        }
        let unassigned = new Project("Unassigned");
        addToList(unassigned);
    }
    window.cardList = new visualSort(projectList);
    listDisplay().showProjects();
    cardList.resetSorting();
    listDisplay().updateList();
    linkDOM();
}

init();