import { Component } from '@angular/core';

@Component({
  selector: 'app-un-authorized',
  standalone: false,
  templateUrl: './un-authorized.component.html',
  styleUrl: './un-authorized.component.css'
})
export class UnAuthorizedComponent {
  onClick() {
    console.log('You are not authorized to view this page.');
    console.log('read sso site from storage');
    console.log("http://localhost/login?origin=xxx&href=xxx");
    document.location.href = '/';
  }
}
