import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { ChatViewPage } from '../chat-view/chat-view';
import { AngularFire,FirebaseListObservable, AngularFireDatabase,FirebaseObjectObservable  } from 'angularfire2';
import { ProfilePage } from '../profile/profile';


@Component({
    templateUrl: 'users.html'
})
export class UsersPage {
    public profileID: string;

    users:Observable<any[]>;
      items: Array<any>;
      profileDetail: FirebaseListObservable<any>;
postDiscriptionNew: Array<{id: any, username: any,email:any,phonenumber:any,base64Image:any}>;


    uid:string;
    constructor(public nav: NavController, public userProvider: UserProvider,public database: AngularFireDatabase) {
          this.profileDetail = this.database.list('/profile');

this.getUsers();


    }



     ionViewDidLoad() { 
    this.profileDetail.forEach(snap => {
      this.postDiscriptionNew = [];
      for (let i = 0; i < snap.length; i++) {
        if (snap[i].email != window.localStorage['email']) {
    


          this.postDiscriptionNew.push({
            id: snap[i].$key,
            username: snap[i].username,
            email: snap[i].email,
            phonenumber: snap[i].phonenumber,
            base64Image:snap[i].base64Image

          });
        }else{
this.profileID=snap[i].$key;


        }
      }
    });
  }



    getUsers(){ 


this.items=[];

        this.userProvider.getUid()
        .then(uid => { 
            this.uid = uid;
            this.users = this.userProvider.getAllUsers();



            this.users.forEach(item => {

                console.log("item"+JSON.stringify(item))

                for (let i = 0; i < item.length; i++) { 

                    if (window.localStorage['email'].toLowerCase() != item[i].email.toLowerCase()) {

                        this.items.push({
                            username: item[i].email,
                            user_image: item[i].picture,
                            userId:item[i].$key



                        });
                    } 



                }





            });
        });


    }

    ngOnInit() {

/*
this.items=[];

        this.userProvider.getUid()
        .then(uid => { 
            this.uid = uid;
            this.users = this.userProvider.getAllUsers();



            this.users.forEach(item => {

                console.log("item"+JSON.stringify(item))

                for (let i = 0; i < item.length; i++) { 

                    if (window.localStorage['email'].toLowerCase() != item[i].email.toLowerCase()) {

                        this.items.push({
                            username: item[i].email,
                            user_image: item[i].picture,
                            userId:item[i].$key



                        });
                    } 



                }





            });
        });*/
    };
    
    openChat(key) {

        if(this.profileID){
 let param = {uid:this.profileID, interlocutor: key};
        this.nav.push(ChatViewPage,param);
  
        }else{
            this.nav.push(ProfilePage);

        }
       
       // let param = {uid:this.profileID, interlocutor: key};
        //this.nav.push(ChatViewPage,param);
    }
}