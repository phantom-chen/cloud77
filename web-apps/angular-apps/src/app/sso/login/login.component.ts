import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../sso.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCommonModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { getTokens } from '@shared/utils';
import { GatewayService } from '../../gateway.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor(
    @Inject('GatewayService') private gateway: GatewayService,
    @Inject('UserService') private service: UserService,
    private san: DomSanitizer) { }

  ngOnDestroy(): void {

  }

  ngOnInit(): void {
    this.remember = (localStorage.getItem('remember_me') ?? '')?.length > 0 ? true : false;
    if (this.remember) {
      this.account = localStorage.getItem('remember_me') ?? '';
    }
    if (this.account.length === 0) {
      this.account = localStorage.getItem('user_email') ?? '';
    }

    this.channel.onmessage = (event) => {
      console.log('Received message:', event.data);
      // Handle the received message here
    }

    this.gateway.get().subscribe((data: any) => {
      console.log(data);
    });

    this.hadToken = (localStorage.getItem('user_access_token') ?? "").length > 0;
    if (this.hadToken) {
      this.validateToken();
    }
    
    // this.service.isHealth().subscribe((data: any) => {
    //   console.log('Health check:', data);
    // });

    this.frameResourceUrl = this.san.bypassSecurityTrustResourceUrl(sessionStorage.getItem('user_app_message') ?? localStorage.getItem('user_app_message') ?? '');
    window.addEventListener('message', function (ev) {
      if (ev.data) {
        console.log(ev.data);
        if (ev.data.name === 'tokens_saved') {
          console.log('tokens saved');
          const appUrl = sessionStorage.getItem('user_app_url') ?? localStorage.getItem('user_app_message') ?? '';

          if (!localStorage.getItem("debug")) {
            sessionStorage.removeItem("user_app_message");
            sessionStorage.removeItem("user_app_url");
            sessionStorage.removeItem("user_app_host");

            localStorage.removeItem("user_app_message");
            localStorage.removeItem("user_app_url");
            localStorage.removeItem("user_app_host");
          }
          
          sessionStorage.setItem('user_app_ready', 'true');
          
          if (!localStorage.getItem('debug')) {
            window.location.href = appUrl;
          }
        }
      }
    });
  
    window.addEventListener('storage', () => {
      console.log('Storage event:');
    });
  }
  
  remember = true;
  account: string = '';
  password = '';

  message = '';
  channel: BroadcastChannel = new BroadcastChannel("testing");

  hadToken = false;
  hadValidToken = false;
  frameResourceUrl?: SafeResourceUrl;

  @ViewChild("messageContainer")
  messageContainer!: ElementRef<HTMLIFrameElement>;

  sendMessage() {
    console.log('Sending message:', this.message);
    this.channel.postMessage(this.message);
  }

  onAccountChange() {
    this.service.getUser(this.account, '')
      .subscribe(res => {
        console.log(res);
        console.log(res.existing);
      })
  }

  onKeyUp(event: KeyboardEvent): void {

  }

  onLoginClick() {
    if (this.remember) {
      localStorage.setItem('remember_me', this.account);
    }

    this.service.getToken(this.account, this.password)
      .subscribe(res => {
        console.log(res);
        localStorage.setItem('user_email', res.email);
        localStorage.setItem('user_access_token', res.value);
        localStorage.setItem('user_refresh_token', res.refreshToken);

        this.validateToken();
      })
  }

  openingMessage = '...';

  validateToken() {
    this.hadToken = (localStorage.getItem('user_access_token') ?? "").length > 0;
    if (!this.hadToken) return;

    this.gateway.validateToken().subscribe(res => {
      console.log(res);
      if (res.role) {
        this.hadValidToken = true;

        const messageUrl = sessionStorage.getItem('user_app_message') ?? localStorage.getItem('user_app_message') ?? '';
        this.frameResourceUrl = this.san.bypassSecurityTrustResourceUrl(messageUrl);
        console.log('find the message url' + messageUrl);

        // navigate to the application
        let sixDotx = "......";
        const tokens = getTokens(false);
        this.openingMessage = 'Opening your app' + sixDotx;
        setInterval(() => {
          if (sixDotx.length > 1) {
            sixDotx = sixDotx.slice(1);
            this.openingMessage = 'Opening your app' + sixDotx;
          }
        }, 300);
        
        setTimeout(() => {
          this.openingMessage = 'Your app is ready!';
          console.log('sync tokens to' + messageUrl)
          this.messageContainer.nativeElement.contentWindow?.postMessage({
            name: 'sync-tokens',
            accessToken: tokens.access,
            refreshToken: tokens.refresh
          }, '*')
        }, 2000);
      }
    });
  }
}
