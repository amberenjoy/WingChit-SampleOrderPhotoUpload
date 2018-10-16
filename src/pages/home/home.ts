import { Component } from '@angular/core';
import { NavController, ActionSheetController, AlertController } from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { HttpClient} from '@angular/common/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  photos : any;
  base64Image: string;
  avatar: string;

  constructor(public navCtrl: NavController,private camera: Camera,public http: HttpClient,public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController) {

  }

  ngOnInit() {
    this.photos = [];
  }

  openCamera(){
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     this.base64Image = 'data:image/jpeg;base64,' + imageData;
     this.photos.push(this.base64Image);
     this.photos.reverse();
     console.log(this.photos);
    }, (err) => {
     // Handle error
    });
  }

  deletePhoto(index) {
    let confirm = this.alertCtrl.create({
        title: 'Sure you want to delete this photo? There is NO undo!',
        message: '',
        buttons: [
          {
            text: 'No',
            handler: () => {
              console.log('Disagree clicked');
            }
          }, {
            text: 'Yes',
            handler: () => {
              console.log('Agree clicked');
              this.photos.splice(index, 1);
            }
          }
        ]
      });
    confirm.present();
  }

  uploadImage(){

    let url="http://192.168.0.93:8080/images/upload";
    let postData=new FormData();// Currently empty The FormData() constructor creates a new FormData 
    console.log(this.photos.length);
    let ajaxData={
      "userID": "ambertest",
      "versionID": "1222222",
      "photos":[]
    };
    for(var a=0;a<this.photos.length;a++){
      postData.append('photos',this.photos[a]);
      let imageData={'photoData':this.photos[a]};
      ajaxData.photos.push(imageData); 
    }
    console.log(JSON.stringify(ajaxData));
    // let data:Observable<any>=this.http.post(url,postData);    
    this.http.post(url,JSON.stringify(ajaxData),{headers: { 'Content-Type': 'application/json' }}).subscribe(res => console.log(res));
    
    let alert = this.alertCtrl.create({title: "上传成功",  buttons: ["确定"]});
    alert.present().then(value => {
      return value;
    });
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [{
        text: '拍照',
        role: 'takePhoto',
        handler: () => {
          this.openCamera();
        }
      }, {
        text: '从相册选择',
        role: 'chooseFromAlbum',
        handler: () => {
          this.imagePick();
        }
      }, {
        text: '取消',
        role: 'cancel',
        handler: () => {
          console.log("cancel");
        }
      }]
    });

    actionSheet.present().then(value => {
      return value;
    });
  }

  imagePick(){
  }

  presentAlert() {
    let alert = this.alertCtrl.create({title: "上传失败", buttons: ["确定"]});
    alert.present().then(value => {
      return value;
    });
  }

  openGallery(){
    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     this.base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
     // Handle error
    });
  }
}
