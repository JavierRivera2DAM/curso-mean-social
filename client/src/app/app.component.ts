import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';


//Agregado 'standalone: false' al Componente para evitar errores al usar NgModules
@Component({    
  selector: 'app-root', 
  imports: [CommonModule, RouterModule, LoginComponent], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'NGSOCIAL';
}