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

export class visualList {
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