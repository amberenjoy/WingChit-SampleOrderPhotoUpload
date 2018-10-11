import { Component } from '@angular/core';
import { NavController, NavParams,ViewController,ActionSheetController,AlertController,ModalController,Platform} from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { GalleryModal } from 'ionic-gallery-modal';
import { RestProvider } from '../../providers/rest/rest';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {
  private photos: any[] = [];

	typeId: string;
  orderID:string;
  base64Image: string;
  colors: any;
  color: any;
  note:string='';
  clientName:string;
  hasPhoto:any=['null','null','null','null','null','null'];
  picToView:any=["assets/imgs/logo.png","assets/imgs/logo.png","assets/imgs/logo.png","assets/imgs/logo.png","assets/imgs/logo.png","assets/imgs/logo.png"];
  orderImages:any={};

  constructor(public navCtrl: NavController,public platform: Platform, public navParams: NavParams,public viewCtrl: ViewController,public actionSheetCtrl: ActionSheetController,public camera: Camera, public alertCtrl: AlertController,private modalCtrl: ModalController,public restProvider: RestProvider,  private storage: Storage) {
  	this.typeId=navParams.get('typeId');
    this.orderID=navParams.get('orderID');
    this.clientName=navParams.get('clientName');
    this.colors=navParams.get('colorsList');
    this.color = { name: ' '};
    this.createPhotos();
    platform.registerBackButtonAction(() => {
      this.viewCtrl.dismiss();
    });

  }

  private createPhotos(length:number = 6) {
    for (let i = 0; i < length; i++) {
      this.photos.push({
        url: `assets/imgs/logo.png`,
      });
    }
    this.photos[0].title = '前幅';
    this.photos[1].title = '后幅';
    this.photos[2].title = '侧围1';
    this.photos[3].title = '侧围2';
    this.photos[4].title = '内格';
    this.photos[5].title = '其它';
    // console.log(this.photos);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalPage');
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  presentPhotoSheet(id){
    console.log(id);
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [{
        text: '拍照',
        role: 'takePhoto',
        handler: () => {
          this.openCamera(id);
        }
      }, {
        text: '从相册选择',
        role: 'chooseFromAlbum',
        handler: () => {
          this.imagePick(id);
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

  openCamera(id){
    console.log("open camera",id);
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType:this.camera.PictureSourceType.CAMERA,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     this.base64Image = 'data:image/jpeg;base64,' + imageData;
     // this.photos.push(this.base64Image);
     // this.photos.reverse();
     this.picToView[id]=this.base64Image;
     this.hasPhoto[id]=id;
     this.photos[id].url=this.base64Image;
    }, (err) => {
     // Handle error
    });
  }
  imagePick(id){
    console.log("open gallery",id);
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType:this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
       // this.photos.push(this.base64Image);
       // this.photos.reverse();
      this.picToView[id]=this.base64Image;
      this.hasPhoto[id]=id;
      this.photos[id].url=this.base64Image;
    }, (err) => {
     // Handle error
    });
  }
  deletePhoto(id){
    let alert = this.alertCtrl.create({
      title: '确定删除该图片？',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '确定',
          handler: () => {
            console.log('delete clicked');
              this.picToView[id]="assets/imgs/logo.png";
              this.photos[id].url="assets/imgs/logo.png";
              this.hasPhoto[id]="null";
          }
        }
      ]
    });
    alert.present();
  }
  viewGallery(id){
    console.log(this.photos);
    let modal = this.modalCtrl.create(GalleryModal, {
      photos: this.photos,
      initialSlide: id, // The second image
    });
    modal.present();
  }
  uploadData(data){
    this.storage.get('updateUser').then((val) => {
      console.log('updateUser is', val);
      data.uploadperson=val;
      data.sono=this.orderID;
      data.styleno=this.typeId;
      data.color=this.color.name;
      data.remark=this.note;
      data.photo1="";data.photo2="";data.photo3="";data.photo4="";data.photo5="";data.photo6="";
     
      let request:any=[];
      // let j=1;
      let check=0;
      for( let i=0;i<6;i++){
        if(this.hasPhoto[i]!="null"){
          // var photoName = 'photo'+ j;
          var photoName = 'photo'+ (i+1);
          data[photoName]=this.photos[i].url.split("data:image/jpeg;base64,")[1];
          // j++;
          check=1;
        }
      }
      if(check===0){
        let alert = this.alertCtrl.create({title: "至少上传一张照片",buttons: ['确定']});
        alert.present();
      }else{
        request.push(data);
        console.log(request);
        this.postImage(request);
      }
    });


    // if(this.hasPhoto[0]!="null"){
    //   data.photobase=this.photos[0].url.split("data:image/jpeg;base64,")[1];
    //   request.push(data);
    //   this.postImage(request);
    // }else{
    //   console.log("photo not null ");
    // }
 
    // data.typeId=this.typeId;
    // data.orderID=this.orderID;
    // data.clientName=this.clientName;
    // data.note=this.note;
    // data.color=this.color.name;
    // data.photos=[];
    // for( let i=0;i<5;i++){
    //   if(this.hasPhoto[i]!="null"){
    //     data.photos.push(this.photos[i]);
    //   }
    // }
  }
 
  postImage(data){
    this.restProvider.saveImage(data).then(() => {
      let alert = this.alertCtrl.create({title: "上传成功", buttons: [ {
          text: "确定",
          handler: () => {this.closeModal();}
        }]
      });
      alert.present().then(value => {
        return value;
      });
    }, (err) => {
      console.log(err);
      let alert = this.alertCtrl.create({title: "上传失败", buttons: [ {
          text: "确定",
          handler: () => {
          }
        }]
      });
      alert.present().then(value => {
        return value;
      });
    }) 
  }
}