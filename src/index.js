import "./style.css";
import {Project, visualSort} from "./todo.js";
import projectSymbol from "./images/book-variant.svg";
import completed from "./images/book-plus.svg";
import incomplete from "./images/book-minus.svg";
import trash from "./images/trash-can.svg";

function addToList(project, listProject){
    listProject.push(project);
    listDisplay(project, listProject).showProjects();
    updateFormList();

    function updateFormList(){
        const list = document.querySelector("#task-project");
        list.replaceChildren();
        for(let i = 0; i < listProject.length; i++){
            let project = document.createElement("option");
            project.value = listProject[i].projectTitle;
            project.textContent = listProject[i].projectTitle;
            list.appendChild(project);
        }
    }
}

function listDisplay(listOfCards, listProject){
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
            let projectLocation = listProject.findIndex((item) => item.projectTitle == createdCard.project);
            if(projectLocation != -1){
                let todoLocation = listProject[projectLocation].todo.findIndex((item) => item.id == createdCard.card.dataset.id);
                if(todoLocation != -1){
                    listProject[projectLocation].todo.splice(todoLocation, 1);
                }
                else console.log("id was not found in array")
            }
            else console.log("project was not found in array")
        }
    }
    
    function updateList(){
        const todoList = document.querySelector("#todo-list");
        todoList.innerHTML = '';
        for(let i = 0 ; i < listOfCards.list.length; i++){
            listDisplay(listOfCards, listProject).showCard(listDisplay(listOfCards, listProject).createCard(listOfCards.list[i]));
        }
    }

    function showProjects(){
        const list = document.querySelector(".project-list");
        list.replaceChildren();
        console.log(listProject.length);
        for(let i = 0; i < listProject.length; i++){
            let project = document.createElement("div");
            project.classList.add("project");

            let image = document.createElement("img");
            image.src = projectSymbol;

            let text = document.createElement("button");
            text.value = listProject[i].projectTitle;
            text.textContent = listProject[i].projectTitle;

            let delImg = document.createElement("img");
            delImg.src = trash;
            delImg.classList.add("del-img");
            delImg.addEventListener("click", () => {
                list.removeChild(project);
                listProject.splice(listProject.findIndex(() => listProject.projectTitle == text.value), 1);
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

function processForm(list, listProject){
    const linkedDisplay = listDisplay(list, listProject);

    function processProject(){
        const projDialog = document.querySelector("#project-form");
        let projTitle = projDialog.querySelector("#project-title").value;
        let projCreate = new Project(projTitle);
        addToList(projCreate, listProject);
        projDialog.reset();
        localStor().saveList(listProject);
    }

    function processTask(){
        const taskDialog = document.querySelector("#task-form");
        let taskName = taskDialog.querySelector("#task-title").value;
        let taskDescription = taskDialog.querySelector("#task-description").value;
        let dueBy = taskDialog.querySelector("#task-due").value;
        let priority = taskDialog.querySelector("#task-priority").value;
        let project = taskDialog.querySelector("#task-project").value;

        for(let i = 0; i < listProject.length; i++){
            if(listProject[i].projectTitle == project){
                let task = listProject[i].addToDo(taskName, taskDescription, dueBy, priority);
                linkedDisplay.showCard(linkedDisplay.createCard(task))
                list.resetSorting();
                break;
            }
        }

        taskDialog.reset();
        localStor().saveList(listProject);
    }
    
    return {processProject, processTask}
}

function linkDOM(list, listProject){
    const linkedDisplay = listDisplay(list, listProject);

    function linkDialog(){
        const addTask = document.querySelector("#add-task");
        const taskDialog = document.querySelector("#task");
        const closeTask = taskDialog.querySelector(".close-dialog")
        const submitTask = taskDialog.querySelector(".submit-form")
        addTask.addEventListener("click", () => taskDialog.showModal());
        closeTask.addEventListener("click", () => taskDialog.close());
        submitTask.addEventListener("click", () => processForm(list, listProject).processTask());
    
        const addProject = document.querySelector("#add-project");
        const projDialog = document.querySelector("#project");
        const closeProj = projDialog.querySelector(".close-dialog");
        const submitProj = projDialog.querySelector(".submit-form")
        addProject.addEventListener("click", () => projDialog.showModal());
        closeProj.addEventListener("click", () => projDialog.close());
        submitProj.addEventListener("click", () => processForm(list, listProject).processProject());
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
        showAll.addEventListener("click", () => {list.resetSorting(); linkedDisplay.updateList(); currProj = "show-all"; currView = "show-all"});

        const today = document.querySelector("#today");
        today.addEventListener("click", () => {list.sortDue().today(); linkedDisplay.updateList(); currView = "today";});

        const upcoming = document.querySelector("#upcoming");
        upcoming.addEventListener("click", () => {list.sortDue().future(); linkedDisplay.updateList(); currView = "upcoming";});

        const past = document.querySelector("#past");
        past.addEventListener("click", () => {list.sortDue().past(); linkedDisplay.updateList(); currView = "past";});

        const projects = document.querySelectorAll(".project>button");
        for(let i = 0; i < projects.length; i++){
            projects[i].addEventListener("click", () => {list.resetSorting(); list.sortProject(projects[i].value); listDisplay(list, listProject).updateList(); currProj = projects[i].value; currView = "project";})
        }

        const sorter = document.querySelectorAll("#top-bar select");
        for(let i = 0; i < sorter.length; i++){
            sorter[i].addEventListener("change", () => reSort(currView, currProj, currCompletion, currSort))
        }
    }

    function reSort(view, proj, completion, sort){
        switch(view){
            case "show-all":
                list.resetSorting(); 
                linkedDisplay.updateList();
                break;
            case "project":
                switch(proj){
                    case "show-all":
                        break;
                    default:
                        list.resetSorting(); 
                        list.sortProject(proj);
                        linkedDisplay.updateList();
                        break;
                }
            case "today":
                list.sortDue().today(); 
                linkedDisplay.updateList();
                break;
            case "upcoming":
                list.sortDue().future(); 
                linkedDisplay.updateList();
                break;
            case "past":
                list.sortDue().past(); 
                linkedDisplay.updateList();
                break;

        }

        switch(completion){
            default:
                list.sortCompletion(completion);
                linkedDisplay.updateList();
                break;
        }

        switch(sort){
            case "low-priority":
                list.sortPriority().low();
                linkedDisplay.updateList();
                break;
            case "high-priority":
                list.sortPriority().high();
                linkedDisplay.updateList();
                break;
            case "closest-due":
                list.sortDue().closest();
                linkedDisplay.updateList();
                break;
            case "furthest-due":
                list.sortDue().furthest();
                linkedDisplay.updateList();
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
    const displayCards = listDisplay(cardList, projectList);
    displayCards.showProjects();
    cardList.resetSorting();
    displayCards.updateList();
    linkDOM(cardList, projectList);
}

init();