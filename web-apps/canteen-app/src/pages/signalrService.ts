import * as signalR from '@microsoft/signalr';

class SignalRService {
    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl('https://your-api-url/chathub') // 替换为你的 SignalR Hub URL
            .build();
    }

    connection: signalR.HubConnection;

    startConnection = async () => {
        try {
            await this.connection.start();
            console.log('SignalR Connected.');
        } catch (err) {
            console.log(err);
            setTimeout(() => this.startConnection(), 5000);
        }
    };

    onReceiveMessage = (callback: (payload: { user: string, message: string }) => void) => {
        this.connection.on('ReceiveMessage', callback);
    };

    sendMessage = async (user: string, message: string) => {
        try {
            await this.connection.invoke('SendMessage', user, message);
        } catch (err) {
            console.error(err);
        }
    };
}

export default new SignalRService();