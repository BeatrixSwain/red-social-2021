import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follows.service';
import { Publication } from '../../models/publication'
import { GLOBAL } from '../../services/global';


@Component({
    selector: 'sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
    providers: [UserService, FollowService]

})

export class SidebarComponent implements OnInit {
    public token: any;
    public identity: any;
    public url:any;
    public stats:any;
    public status:any;
    public publication:Publication;

    constructor(private _userService: UserService, private _followService: FollowService) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.stats = this._userService.getStats();
        this.publication = new Publication("","","","",this.identity._id);

    }

    ngOnInit() {
        console.log('Componente de SidebarComponent cargado...');
    }

    ngDoCheck(){//Cada vez que hay modificaciones a nivel de app en los componentes, los stats se actualizan obtieniendolos desde el local
         this.stats = this._userService.getStatsLocal();
    }

    onSubmit(){
        console.log(this.publication);
    }
    
}