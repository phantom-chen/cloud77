import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EventQueryResult, Profile, UserAccount, UserPost, UserRole, UserTask } from "@phantom-chen/cloud77";
import { GatewayService, getTokens } from "@shared/utils";
import { Observable, Subject } from "rxjs";

@Injectable()
export class AccountService {

    constructor(private http: HttpClient) {
        console.log('DashboardService initialized');
        this.gateway = new GatewayService(this.http);
    }

    gateway: GatewayService;

    getDashboardData() {
        // Simulate fetching dashboard data
        return {
            files: ['file1.txt', 'file2.txt', 'file3.txt'],
            recentActivities: ['Logged in', 'Uploaded file1.txt', 'Deleted file2.txt']
        };
    }

    getAccountInfo(): Observable<UserAccount> {
        const email = sessionStorage.getItem('user_email') || '';
        return this.http.get<UserAccount>(`/api/user/accounts/${email}`);
    }

    getHistory(): Observable<EventQueryResult> {
        const email = sessionStorage.getItem('user_email') || '';
        return this.http.get<EventQueryResult>(`/api/super/events/${email}`);
    };

    updateProfile(profile: Profile) {
        const email = sessionStorage.getItem('user_email') || '';
        return this.http.put(`/api/user/accounts/${email}/profile`, profile).subscribe(res => console.log(res));
    }

    getTasks(): Observable<any> {
        return this.http.get('/api/user/tasks');
    }

    createTask(task: UserTask): Observable<any> {
        return this.http.post('/api/user/tasks', task);
    }

    createPost(post: UserPost): Observable<any> {
        return this.http.post('/api/user/posts', post);
    }

    updateTask(task: UserTask): Observable<any> {
        return this.http.put('/api/user/tasks', task);
    }

    deleteTask(id: string): Observable<any> {
        return this.http.delete(`/api/user/tasks/${id}`);
    }

    getPosts(): Observable<any> {
        return this.http.get('/api/user/posts');
    }

    getPostContent(id: string): Observable<any> {
        return this.http.get(`/api/user/posts/${id}`, { responseType: 'text' });
    }

    updatePostContent(id: string, content: string): Observable<any> {
        return this.http.put(`/api/user/posts/${id}`, content);
    }

    getFiles(): Observable<string[]> {
        const email = sessionStorage.getItem('user_email') || '';
        return this.http.get<string[]>(`/api/sample/files`);
    }

    uploadFile(form: FormData): Observable<any> {
        const email = sessionStorage.getItem('user_email') || '';
        return this.http.post('/api/sample/files', form, {
            reportProgress: true,
            observe: 'events'
        });
    }

    downloadFile(fileName: string): Observable<Blob> {
        const email = sessionStorage.getItem('user_email') || '';
        return this.http.get(`/api/sample/files/${fileName}`, {
            responseType: 'blob',
            headers: {
                'Content-Disposition': `attachment; filename="${fileName}"`
            }
        });
    }

    deleteFile(fileName: string): Observable<any> {
        const email = sessionStorage.getItem('user_email') || '';
        return this.http.delete(`/api/sample/files/${fileName}`);
    }

    verifyEmail(): Observable<any> {
        const email = sessionStorage.getItem('user_email') || '';
        return this.http.post(`/api/user/accounts/${email}/verification`, undefined);
    }
}
