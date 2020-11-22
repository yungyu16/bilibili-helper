![bilibili-helper](https://socialify.git.ci/yungyu16/bilibili-helper/image?description=1&descriptionEditable=Bilibili%E5%88%B7%E8%AF%BE%E7%9C%8B%E7%89%87%E5%B0%8F%E5%8A%A9%E6%89%8B&language=1&logo=https%3A%2F%2Fraw.githubusercontent.com%2Fyungyu16%2Fcdn%2Fmaster%2Favatar.png&owner=1&pattern=Circuit%20Board&theme=Light)

<p align="center">
    <br/>
    <br/>
    <b>这是一个用于在浏览器本地记住B站播放进度的油猴脚本</b>
    <br/>
    <br/>
</p>

# 哔哩哔哩 (゜-゜)つロ 干杯~
众所周知，B站是一个**学习**APP.   
我的收藏夹里收藏了很多高质量的网课,平时业余时间会刷课充电.    
然而每次从收藏夹进入播放页都自动从第一集开始播放,不能自动接着上次看到的那一集开始看(╥╯^╰╥)    
为了解决这个问题,所以我写了这个脚本.     
欢迎大家提供建议.

# 原理
利用定时器每5秒钟将视频ID(av号/bv号)和播放进度作为键值对存储到本地缓存中.   
每次进入视频播放页时读取缓存中的记录进行选集和播放进度定位.     
源码思路清晰且注释完整,详情请点击[这里](index.js).

# 安装
本脚本已发布到 [Greasy Fork](https://greasyfork.org/zh-CN/scripts/416450-bilibili%E8%AE%B0%E4%BD%8F%E6%92%AD%E6%94%BE%E8%BF%9B%E5%BA%A6).    
按[指引](http://www.tampermonkey.net/)安装合适的TamperMonkey版本后可一键安装本脚本.


