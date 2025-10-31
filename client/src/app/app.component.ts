import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


//Agregado 'standalone: false' al Componente para evitar errores al usar NgModules
@Component({    
  selector: 'app-root', 
  imports: [CommonModule, RouterModule], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'NGSOCIAL';
}