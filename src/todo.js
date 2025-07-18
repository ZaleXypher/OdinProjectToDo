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
        this.todo.push(temp);
    }

    get list() {
        return this.todo;
    }
}