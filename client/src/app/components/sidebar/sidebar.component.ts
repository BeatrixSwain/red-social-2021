import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follows.service';

import { GLOBAL } from '../../services/global';


@Component({
    selector: 'sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
    providers: [UserService, FollowService]

})

export class SidebarComponent implements OnInit {
    public title: string;
    public token: any;
    public identity: any;
    public url:any;

    constructor(private _userService: UserService, private _followService: FollowService) {
        this.title = "sidebar";
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;

    }

    ngOnInit() {
        console.log('Componente de SidebarComponent cargado...');
    }
    
}