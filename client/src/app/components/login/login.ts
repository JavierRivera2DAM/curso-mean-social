import { Component, OnInit } from "@angular/core";

@Component({
    selector: 'login',
    templateUrl: './login.html'
})

export class LoginComponent implements OnInit{
    public title:string;

        constructor(){
            this.title = 'Identificate';
        }


    ngOnInit(): void {
        console.log('Componente de login cargado...');
    }
}