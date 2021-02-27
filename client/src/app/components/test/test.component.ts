import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'TestComponent',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.css'],
})

export class TestComponent implements OnInit{
    public title:string;
    constructor(){
        this.title = 'Bootstraps example'
    }

    ngOnInit(){
        console.log("test.component cargado");
    }
    
}