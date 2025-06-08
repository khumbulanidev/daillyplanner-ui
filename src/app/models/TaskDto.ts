export interface TaskDto {
  id: number;
  duration: string;
  name: string;
  comments: string;
  quantity: number;
  done: boolean;
  date: Date;
  dayId: number;
}
