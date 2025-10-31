import { Component, signal } from '@angular/core';


//Agregado 'standalone: false' al Componente para evitar errores al usar NgModules
@Component({
  standalone: false,  
  selector: 'app-root',  
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'NGSOCIAL';
}