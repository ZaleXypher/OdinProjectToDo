import { compareAsc, compareDesc} from "date-fns";

export class Project{
    constructor (title){
        this.projectTitle = title;
        this.todo = [];
    }

    addToDo(title, description, due = new Date, priority){
        let temp = {};
        temp.project = this.projectTitle;
        temp.taskTitle = title;
        temp.taskDescription = description;
        temp.due = due;
        temp.priority = priority;
        temp.completion = 0;
        this.todo.push(temp);
        return temp;
    }

    get list() {
        return this.todo;
    }
}

export class visualSort {
    constructor (list){
        this.logicTodo = list;
        this.visualList = [];
    }

    get list(){
        return this.visualList;
    }
    
    resetSorting(){
        this.visualList = [];
        for(let i = 0; i < this.logicTodo.length; i++){
            for(let o = 0; o < this.logicTodo[i].todo.length; o++){
                this.visualList.push(this.logicTodo[i].todo[o]);
            }
        }
    }

    sortPriority(){
        const high = () => this.visualList.sort((a, b) => b.priority - a.priority)
        const low = () => this.visualList.sort((a, b) => a.priority - b.priority)
        return {high, low}
    }
    
    sortDue(){
        const closest = () => this.visualList.sort((a, b) => compareAsc(a.due, b.due));
        const furthest = () => this.visualList.sort((a, b) => compareDesc(a.due, b.due));
        return {closest, furthest}
    }

    sortProject(project){
        this.visualList = [];
        console.log(this.logicTodo);
        for(let i = 0; i < this.logicTodo.length; i++){
            if(project == this.logicTodo[i].projectTitle){
                for(let o = 0; o < this.logicTodo[i].todo.length; o++){
                    this.visualList.push(this.logicTodo[i].todo[o]);
                }
                break;
            }
        }
    }

    sortCompletion(status){
        this.visualList = [];
        let compStat = 0
        switch(status){
            case "incomplete":
                compStat = 0;
                break;
            case "completed":
                compStat = 1;
                break;
            case "both":
                compStat = 2;
                break;
        }
        for(let i = 0; i < this.logicTodo.length; i++){
            for(let o = 0; o < this.logicTodo[i].todo.length; o++){
                if(this.logicTodo[i].todo[o].completion == compStat || compStat == 2){
                    this.visualList.push(this.logicTodo[i].todo[o]);
                }   
            }
        }
    }
}