import { HttpClient } from "@angular/common/http";

export interface UserTask {
  userId: number;
  id: number;
  title: string;
  completed: number;
  code?: string;
}

export class TaskService {

  constructor(private client: HttpClient, private mock: boolean) { }

  getTasks(userId: number): void {

  }

  deleteTask(task: UserTask) {

  }
}
