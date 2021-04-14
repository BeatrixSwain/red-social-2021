import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Publication } from '../../models/publication'
import { GLOBAL } from '../../services/global';

@Component({
    selector: 'timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.css'],
    providers: [UserService]

})

export class TimelineComponent implements OnInit {
    public title: string;
    public token: any;
    public identity: any;    
    public url: string;
    public status: string;

    
    constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService) {
        this.title = "Timeline";
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.status = "";
        this.url = GLOBAL.url;

    }

    ngOnInit() {
        console.log('Componente de TimelineComponent cargado...');
    }

}