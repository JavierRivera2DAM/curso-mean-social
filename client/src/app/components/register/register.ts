import { Component, OnInit } from "@angular/core";

@Component({
    selector: 'app-register',
    standalone: true,
    templateUrl: './register.html'
})

export class RegisterComponent implements OnInit{
    public title:string;

        constructor(){
            this.title = 'Regístrate';
        }


    ngOnInit(): void {
        console.log('Componente de register cargado...');
    }
}