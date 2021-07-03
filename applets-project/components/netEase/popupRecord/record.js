import Lyric from '../../../utils/lrc-analysis';
import {
    netEaseAPI
} from '../../../utils/util';
Component({

    properties: {
        randomSwitch: Boolean,
        randomList: Array,
        playIndex: Number,
        song: Array,
        playerState: Boolean
    },
    data: {},
    methods: {
        analysislry() {
            let lrc = new Lyric({
                onPlay: (line, text) => {
                    console.log(line, text)

                },
                onSetLyric: (lines) => {
                    console.log(lines)
                },
                offset: 150
            })
            netEaseAPI('lyric?id=65528').then(res => {
                // console.log(res)
                lrc.setLyric(res.data.lrc.lyric)
            })

        }
    },
    lifetimes: {
        attached() {
            this.analysislry()
        },
        detached() {}, //在组件实例被从页面节点树移除时执行
    },
    options: {
        addGlobalClass: true,
    }
})