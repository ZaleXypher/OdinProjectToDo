import "./style.css";
import {Project} from "./todo.js";

let test = new Project("Testing")
test.addToDo("test", "testing", "date", "Low")
test.addToDo("test2", "testing2", "date2", "Low")
console.log(test.list)