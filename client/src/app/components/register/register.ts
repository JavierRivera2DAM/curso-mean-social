import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { User } from "../../models/user";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";


@Component({
    selector: 'app-register',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './register.html'
})

export class RegisterComponent implements OnInit{
    public title:string;
    public user: User;

        constructor(
            private _route: ActivatedRoute,
            private _router: Router
        ){  
            this.title = 'Regístrate';
            this.user = new User("",
                "",
                "",
                "",
                "",
                "",
                "ROLE_USER",
                ""
            );          
        }


    ngOnInit(): void {
        console.log('Componente de register cargado...');
    }

    //Método invocado desde el Template
    onSubmit(form:any): void {
        console.log('Formulario enviado:', form.value);
    }
}