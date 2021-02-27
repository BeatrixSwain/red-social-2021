import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'HomeComponent',
    templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit{
    public title:string;
    constructor(){
        this.title = 'Welcome to Wittian'
    }

    ngOnInit(){
        console.log("home.component cargado");
    }
}