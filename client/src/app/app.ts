import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    LoginComponent,
    RegisterComponent  
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // protected readonly title = signal('client');
  public title = 'NGSocial Javier Rivera';
}
