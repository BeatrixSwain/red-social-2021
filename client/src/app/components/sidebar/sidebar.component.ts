import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follows.service';
import { Publication } from '../../models/publication'
import { GLOBAL } from '../../services/global';
import { PublicationService} from '../../services/publication.service'

@Component({
    selector: 'sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
    providers: [UserService, FollowService, PublicationService]

})

export class SidebarComponent implements OnInit {
    public token: any;
    public identity: any;
    public url:any;
    public stats:any;
    public status:any;
    public publication:Publication;


    constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService, private _followService: FollowService, private _publicationService:PublicationService) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.stats = this._userService.getStats();
        this.publication = new Publication("","","","",this.identity._id);
        this.status = '';

    }

    ngOnInit() {
        console.log('Componente de SidebarComponent cargado...');
    }

    ngDoCheck(){//Cada vez que hay modificaciones a nivel de app en los componentes, los stats se actualizan obtieniendolos desde el local
         this.stats = this._userService.getStatsLocal();
    }

    onSubmit(form:any){
        console.log(this.publication);
        this._publicationService.addPublication(this.token, this.publication).subscribe(
            response=>{
                if(response.publication){
                    this.status = 'success';
                    form.reset();
                    this._router.navigate(['/timeline']);
                }else{
                    this.status = 'error';
                }
                this.stats = this._userService.getStats();

            }, error=>{
                var errorMessage= <any>error;
                console.log(errorMessage);
                if(errorMessage!=null){
                    this.status = 'error';
                }
            }
        )
    }

    //Output
    @Output() sended = new EventEmitter();
    sendPublication(event:any){
        this.sended.emit({send:'true'});
    }
    
}