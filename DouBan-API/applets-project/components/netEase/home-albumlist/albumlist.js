Component({
    properties: {
        title:String,
        listArr:Array
    },
    data: {

    },
    methods: {
        toRemd(e) { //点击进入歌单
            wx.navigateTo({
                url: `/pages/Subpage/MusicSubPage/playlistsDetails/playlistsDetails?id=${e.currentTarget.dataset.num}`
            })
            // console.log(e.currentTarget.dataset.num)
        },
        playlist(e){
            this.triggerEvent('playlist',e.currentTarget.dataset.num)
        }
    },
    options: {
        addGlobalClass: true,
    }
})
