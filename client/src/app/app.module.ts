import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NgModule } from "@angular/core";

//Componentes
import { AppComponent } from "./app.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
    declarations: [    
        AppComponent,
        LoginComponent,
        RegisterComponent    
    ],
    imports: [
        BrowserModule        
    ], providers: [],
    bootstrap: [AppComponent]
})

export class AppModule{}