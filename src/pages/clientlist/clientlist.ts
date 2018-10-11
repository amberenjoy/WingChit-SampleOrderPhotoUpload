import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OrderlistPage } from '../orderlist/orderlist';
import { RestProvider } from '../../providers/rest/rest';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ClientlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-clientlist',
  templateUrl: 'clientlist.html',
})
export class ClientlistPage {
  mockClient:any;
  mockData: any;
  customerList: any;
  users: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public restProvider: RestProvider, public storage: Storage) {
    this.initializeclientItems();
 
  }

  initializeclientItems(){
    this.restProvider.getUsers()
    .then(data => {
      this.mockData = data;
      console.log("success");
      this.mockClient=[];
      let uniqueList=<any>[];
      for(let i=0;i<this.mockData.viewentry.length;i++){
        let obj= <any>{};
        let objChild= <any>{};
        obj.name = true; 
        obj.orders = [];
        objChild.id=true;
        objChild.class=true;
        objChild.typeList=[];
        objChild.colorList=[];
  
        let thisCustromer=this.mockData.viewentry[i].entrydata[0].text[0];
        let thisOrdersID=this.mockData.viewentry[i].entrydata[1].text[0];
        let thisOrdersClass=this.mockData.viewentry[i].entrydata[4].text[0];
  
   
        for(let j=7;j<17;j++){
          if(this.mockData.viewentry[i].entrydata[j].text[0]!=""){
            let thisOrdersTypeList=<any>{};
            thisOrdersTypeList.type=true;
            thisOrdersTypeList.client="";
            thisOrdersTypeList.type=this.mockData.viewentry[i].entrydata[j].text[0];
            objChild.typeList.push(thisOrdersTypeList);
          }
        }
        for(let z=17;z<27;z++){
          if(this.mockData.viewentry[i].entrydata[z].text[0]!=""){
            objChild.colorList.push(this.mockData.viewentry[i].entrydata[z].text[0]);
          }
        }

        objChild.id=thisOrdersID;
        objChild.class=thisOrdersClass;
        obj.orders.push(objChild);
  
        if(uniqueList.indexOf(thisCustromer) === -1){
          uniqueList.push(thisCustromer);
          obj.name=thisCustromer;
          this.mockClient.push(obj);
        }else{
          let index=uniqueList.indexOf(thisCustromer);
          this.mockClient[index].orders.push(objChild);
  
        }
      }
      // console.log(this.mockClient);
    });

  }

  getOrder(name,orderlist){
  	this.navCtrl.push(OrderlistPage,{clientName:name,orderlist: orderlist});
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ClientlistPage');
  }

}
