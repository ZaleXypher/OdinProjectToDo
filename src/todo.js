import { compareAsc, compareDesc, isFuture, isPast, isToday} from "date-fns";

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
        temp.id = crypto.randomUUID();
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
        const today = () => sortDate(isToday);
        const past = () => sortDate(isPast);
        const future = () => sortDate(isFuture);

        let sortDate = (func) =>{
            this.visualList = [];
            for(let i = 0; i < this.logicTodo.length; i++){
                for(let o = 0; o < this.logicTodo[i].todo.length; o++){
                    if(func(this.logicTodo[i].todo[o].due)){
                        this.visualList.push(this.logicTodo[i].todo[o]);
                    }   
                }
            }
        }
        return {closest, furthest, today, past, future}
    }

    sortProject(project){
        for(let i = 0; i < this.visualList.length; i++){
            if(project != this.visualList[i].project){
                this.visualList.splice(i, 1);
                i--;
            }
        }
        console.log(this.visualList);
    }

    sortCompletion(status){
        let compStat = null;
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
        for(let i = 0; i < this.visualList.length; i++){
            if(this.visualList[i].completion != compStat && compStat != 2){
                this.visualList.splice(i, 1);
                i--;
            }
        }
    }
}