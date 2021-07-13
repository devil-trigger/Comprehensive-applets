Component({
    properties: {
        dataJson:Object
    },
    data: {},
    methods: {
        popupClose(){
            this.triggerEvent('popupClose')
        },
        toshare(){
            console.log('分享++++',this.properties.dataJson);
        }
    },
    lifetimes:{
        attached(){  
            // console.log(this.properties.dataJson);
         }
    },
    options: {addGlobalClass: true}
})
