import { Component, OnInit } from "@angular/core";

@Component({
    selector: 'register',
    templateUrl: './register.html'
})

export class RegisterComponent implements OnInit{
    public title:string;

        constructor(){
            this.title = 'Identificate';
        }


    ngOnInit(): void {
        console.log('Componente de register cargado...');
    }
}