import  {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({        
    selector: 'login',
    imports: [CommonModule],
    templateUrl: './login.component.html'
})
export class LoginComponent {
    public title:string= 'Identificate';
    

    ngOnInit() {
        console.log ('Componente de login cargado...');
    }
}