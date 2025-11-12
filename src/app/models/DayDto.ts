import { Task } from "./task";
import { TaskDto } from "./TaskDto";

export interface DayDto{
    id : number;
    date : Date;
    tasks?: Task[];
}