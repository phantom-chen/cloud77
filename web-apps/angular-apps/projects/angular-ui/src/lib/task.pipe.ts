import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "taskState" })
export class TaskStatePipe implements PipeTransform {
    public transform(state: number): string {
        if (state === 0) {
            return 'Pending';
        } else if (state === 1) {
            return 'In Progress';
        } else if (state === 2) {
            return 'Completed';
        }
        return 'Unknown';
    }
}
