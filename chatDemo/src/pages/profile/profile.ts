import * as firebase from 'firebase';

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFire,FirebaseListObservable, AngularFireDatabase,FirebaseObjectObservable  } from 'angularfire2';
import {Camera,File} from 'ionic-native';
import { AlertController,Platform } from 'ionic-angular';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { ChatsProvider } from '../../providers/chats-provider/chats-provider';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';


//Please add pugin
    // INSTALL PLUGIN - cordova plugin add cordova-plugin-file





declare var window: any;

//declare var firebase: any;
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
private useremail;
public base64Image: string;
private profilePictureRef: any;
private item;
private ref: any;
   // chats:Observable<any[]>;

postDiscription: Array<{id: any, username: any,email:any,phonenumber:any,base64Image:any}>;
profileInfo: Array<{id: any, username: any,email:any,phonenumber:any}>;
profileDetail: FirebaseListObservable<any>;
profileName: FirebaseObjectObservable<any>;
profileList: FirebaseListObservable<any>;

public isHideProfile= false;
public profile:any= {};
    usersRef: any = firebase.database().ref('profile');


constructor(public navCtrl: NavController, public navParams: NavParams,public database: AngularFireDatabase,public alertCtrl: AlertController, public platform: Platform,public userProvider: UserProvider,public chatsProvider:ChatsProvider,public storage:Storage,public af:AngularFire) {

this.useremail=window.localStorage['email'];






  this.profileDetail = this.database.list('/profile');
  this.profileName =this.database.object('/profile');
  this.ionViewDidLoad();



  }
  ionViewDidLoad() { 
    this.profileDetail.forEach(snap => {
      this.postDiscription = [];
      for (let i = 0; i < snap.length; i++) {
        if (snap[i].email == window.localStorage['email']) {
          this.isHideProfile = true;
    


window.localStorage['user_pic']=snap[i].base64Image;
          this.postDiscription.push({
            id: snap[i].$key,
            username: snap[i].username,
            email: snap[i].email,
            phonenumber: snap[i].phonenumber,
            base64Image:snap[i].base64Image

          });
        }
      }
    });
  }


  updatePicture() {
        this.userProvider.updatePicture();
    };

  updateProfile(data) { 

    
    if (((data.username == undefined) || (data.username == ''))) {
      alert("Plase Enter User Name");
      return null;
    } else if (data.phonenumber.length != 10) {
      alert("Plase Enter Valide Mobile Number");
      return null;
    } else { 
if (data.id) {

  alert("data.id"+data.id);

        this.profileDetail.update(data.id, {
          username: data.username,
          email: window.localStorage['email'],
          phonenumber: data.phonenumber,
          base64Image: data.base64Image,
        }); 
        alert("Profile is updated")
      } else { 


      this.profileDetail.push({
        username: data.username,
        email: window.localStorage['email'],
        phonenumber: data.phonenumber,
        base64Image: ''

      });
                alert("Profile is updated")

      }





      
    }

  }
  
  showAlert() {

    let alert = this.alertCtrl.create({

      title: 'Take Picture!',

      buttons: [
        {
          text: 'Take Photo form cemra',
          handler: () => {
            console.log('cemra');
            this.takePicture();
          }
        }, {

          text: 'Take Photo form Gallery',
          handler: () => {
            console.log('cancelar');
            this.accessGallery();
          }
        }
      ]
    });
    alert.present();
  }

  takePicture(){
    Camera.getPicture({
        destinationType: Camera.DestinationType.DATA_URL
        
    }).then((imageData) => {
      // imageData is a base64 encoded string
        this.base64Image = "data:image/jpeg;base64," + imageData; 

  this.profilePictureRef.child("user_image").child('profilePicture.png')
.putString(this.base64Image, 'base64', {contentType: 'image/png'})
  .then((savedPicture) => { 


   
  });


    }, (err) => {
        console.log(err);
    });
  }

   accessGallery(){
   Camera.getPicture({
     sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
     destinationType: Camera.DestinationType.DATA_URL
    }).then((imageData) => {
      this.base64Image = 'data:image/jpeg;base64,'+imageData;
     }, (err) => {
      console.log(err);
    });
  }


  doGetPicture(data) {

    // TODO:
    // get picture from camera
    Camera.getPicture({
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      targetHeight: 640,
      correctOrientation: true
    }).then((_imagePath) => {
      // convert picture to blob
      return this.makeFileIntoBlob(_imagePath);
    }).then((_imageBlob) => {
      // upload the blob
      return this.uploadToFirebase(_imageBlob);
    }).then((_uploadSnapshot: any) => {
this.base64Image=_uploadSnapshot.downloadURL;
      // store reference to storage in database
      return this.saveToDatabaseAssetList(_uploadSnapshot,data);

    }).then((_uploadSnapshot: any) => {
    }, (_error) => {
    });



  }


    getUser(userUid: string) {
        return this.usersRef.child(userUid).once('value');
    }


  uploadToFirebase(_imageBlob) {
    var fileName = 'sample-' + new Date().getTime() + '.jpg';

    return new Promise((resolve, reject) => {
      var fileRef = firebase.storage().ref('images/' + fileName);

      var uploadTask = fileRef.put(_imageBlob);

      uploadTask.on('state_changed', (_snapshot) => {
        console.log('snapshot progess ' + _snapshot);
      }, (_error) => { 
        reject(_error);
      }, () => {
        // completion...
        resolve(uploadTask.snapshot);
      });
    });
  }

  saveToDatabaseAssetList(_uploadSnapshot, data) {



    if (data.id) {

      this.profileDetail.update(data.id, {
        username: data.username,
        email: window.localStorage['email'],
        phonenumber: data.phonenumber,
        base64Image: _uploadSnapshot.downloadURL
      });
    } else {

      this.profileDetail.push({
        username: data.username,
        email: window.localStorage['email'],
        phonenumber: data.phonenumber,
        base64Image: _uploadSnapshot.downloadURL

      });
    }






  }
  makeFileIntoBlob(_imagePath) {

    // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
    if (this.platform.is('android')) {
      return new Promise((resolve, reject) => {
        window.resolveLocalFileSystemURL(_imagePath, (fileEntry) => {

          fileEntry.file((resFile) => {

            var reader = new FileReader();
            reader.onloadend = (evt: any) => {
              var imgBlob: any = new Blob([evt.target.result], { type: 'image/jpeg' });
              imgBlob.name = 'sample.jpg';
              resolve(imgBlob);
            };

            reader.onerror = (e) => {
              alert(JSON.stringify(e))
              console.log('Failed file read: ' + e.toString());
              reject(e);
            };

            reader.readAsArrayBuffer(resFile);
          });
        });
      });
    } else {
       return new Promise((resolve, reject) => {
        window.resolveLocalFileSystemURL(_imagePath, (fileEntry) => {

          fileEntry.file((resFile) => {

            var reader = new FileReader();
            reader.onloadend = (evt: any) => {
              var imgBlob: any = new Blob([evt.target.result], { type: 'image/jpeg' });
              imgBlob.name = 'sample.jpg';
              resolve(imgBlob);
            };

            reader.onerror = (e) => {
              alert(JSON.stringify(e))
              console.log('Failed file read: ' + e.toString());
              reject(e);
            };

            reader.readAsArrayBuffer(resFile);
          });
        });
      });
      /* return fetch(_imagePath).then((_response) => {
       return _response.blob();
       }).then((_blob) => {
       return _blob;
       }).catch((_error) => {
       alert(JSON.stringify(_error.message));
       });*/
    }
  }

}
