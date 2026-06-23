import { TaskDto } from "../models/TaskDto";

export interface DailyTaskDto{
    startDate : Date,
    endDate : Date,
    tasks : TaskDto[]
}