import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCommonModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCommonModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCheckboxModule
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {

  @Input()
  account = '';

  password = '';

  @Input()
  remember = false;

  @Input()
  accountExisting: boolean = false;

  @Output()
  login: EventEmitter<void> = new EventEmitter();

  @Output()
  accountChange: EventEmitter<string> = new EventEmitter();

  @Output()
  signInChange: EventEmitter<{ account: string, password: string, remember: boolean }> = new EventEmitter<{ account: string, password: string, remember: boolean }>();

  onAccountChange(): void {
    this.accountChange.emit(this.account);
    this.onSignInChange();
  }

  onSignInChange(): void {
    this.signInChange.emit({ account: this.account, password: this.password, remember: this.remember });
  }

  onKeyUp(event: KeyboardEvent): void {
    if (event.key === "Enter") {
        this.login.next();
    }
  }
}
