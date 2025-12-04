import * as signalR from "@microsoft/signalr";
import { Subject } from "rxjs";

export interface ChartData {
    data: number[],
    label: string,
    backgroundColor: string
}

export class HubService {
    private connection: signalR.HubConnection | undefined;

    charts$: Subject<ChartData[]> = new Subject();
    chartStatus$: Subject<string> = new Subject();
    broadcastCharts$: Subject<ChartData[]> = new Subject();
    globalMessage$: Subject<string> = new Subject();

    public connect(): void {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("/hubs/chat", { accessTokenFactory: () => "" })
            // .configureLogging(signalR.LogLevel.Trace)
            .build();

        this.connection.start()
        .then(() => {
            this.connection?.on('global-message', (message: string) => {
                this.globalMessage$.next(message);
            });

            this.connection?.on('live-chart-status', (message: string) => {
                this.chartStatus$.next(message);
            });

            this.connection?.on('live-chart-data', (data: ChartData[]) => {
                this.charts$.next(data);
            });

            // broadcast-chart-data
            this.connection?.on('broadcast-chart-data', (data: ChartData[]) => {
                this.broadcastCharts$.next(data);
            });
        });
    }

    public broadcastCharts(data: ChartData[]): void {
        this.connection?.invoke("chartData2all", data);
    }

    public broadcastMessage(user: string, message: string): void {
        this.connection?.invoke("SendMessage", user, message);
    }
}