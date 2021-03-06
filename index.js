// ==UserScript==
// @author      yungyu16
// @name        BiliBili记住播放进度
// @description 记住B站视频或专辑播放进度
// @namespace   yungyu16/bilibili-helper
// @version     1.0
// @website     https://github.com/yungyu16/bilibili-helper
// @supportURL  https://github.com/yungyu16/bilibili-helper/issues
// @updateURL   https://raw.githubusercontent.com/yungyu16/bilibili-helper/master/index.js
// @downloadURL https://raw.githubusercontent.com/yungyu16/bilibili-helper/master/index.js
// @include     http*://www.bilibili.com/video/av*
// @include     http*://www.bilibili.com/video/BV*
// @require     https://lib.baomitu.com/qs/6.9.3/qs.min.js
// @require     https://lib.baomitu.com/jquery/3.5.1/jquery.slim.min.js
// @grant       GM_log
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_notification
// @grant       unsafeWindow
// ==/UserScript==

const FLAG_DEBUG = false;
const FLAG_REDIRECT = '__bh_r_f'; //__bhelper_redirect_flag__


(function () {
    'use strict';

    let videoEl = $(".bilibili-player-video video").get(0);
    let videoId = extractCurVideoId();
    let settingKey = settingKeyBuilder(videoId);
    let lastPageKey = settingKey("lastPage");
    let lastTimeKey = settingKey("lastTime");

    doWithDebugMode(() => GM_log("当前视频id：", videoId));

    //恢复播放上下文
    switchPlayContext();
    //保存播放上下文
    savePlayContext();

    //===========================================
    //                正文开始
    //===========================================

    /**
     * 切换播放上下文
     */
    function switchPlayContext() {
        let lastPage = GM_getValue(lastPageKey, 1);
        let pageNo = extractCurPageNo();
        let pageCount = countVideoPage();
        doWithDebugMode(() => {
            GM_log("lastPage：", lastPage);
            GM_log("pageCount：", pageCount);
        });
        //重定向到指定集
        if (pageNo > 0) {
            doWithDebugMode(() => GM_log("指定集数播放...无需重定向"));
        }
        if (pageCount > 0
            && pageNo < 0
            && lastPage > 1) { //当前链接没有携带集数参数
            if ((pageNo) !== (lastPage / 1)) {
                let thisQueryParams = parseQueryString();
                thisQueryParams.p = lastPage;
                setRedirectFlag(thisQueryParams); //添加重定向标记
                location.href = `/video/${videoId}?${Qs.stringify(thisQueryParams)}`
                return;
            }
        }
        //设置播放进度
        if (getRedirectFlag()) { //检查重定向标记
            let lastTime = GM_getValue(lastPageKey, 0);
            doWithDebugMode(() => GM_log("lastTime：", lastTime));
            if (lastTime > 0) {
                setTimeout(() => {
                    if (videoEl.currentTime > 10) {
                        GM_log("B站已自动同步播放进度,无需重新定位");
                        return;
                    }
                    videoEl.currentTime = lastTime;
                    let progressMsg = `已定位到历史播放进度:${formatProgressSecond(lastTime)}`;
                    doWithDebugMode(() => publishNotification(progressMsg));
                    GM_log("progressMsg：", progressMsg);
                    videoEl.play();
                }, 4 * 1000);
            }
        }
    }

    /**
     * 定时持久化播放上下文
     */
    function savePlayContext() {
        setInterval(doSavePlayContext, 5 * 1000);
    }

    /**
     * 持久化播放上下文
     */
    function doSavePlayContext() {
        let pageNo = extractCurPageNo();
        let currentTime = videoEl.currentTime;
        GM_setValue(lastPageKey, pageNo);
        GM_setValue(lastTimeKey, currentTime <= 0 ? 0 : currentTime);
        doWithDebugMode(() => GM_log("lastPage：", pageNo, ",lastTime:", formatProgressSecond(currentTime)));
    }

    /**
     * 调试命令
     */
    function doWithDebugMode(action) {
        try {
            if (FLAG_DEBUG) {
                action();
            }
        } catch (e) {
            GM_log("Bhelper调试指令执行异常：", e);
        }
    }

    /**
     * 统计当前播放页有多少集
     */
    function countVideoPage() {
        let pageList = $('.list-box li');
        return pageList.length;
    }

    /**
     * 播放进度格式化
     */
    function formatProgressSecond(lastTime) {
        return `${Math.floor(lastTime / 60)}m${Math.floor(lastTime % 60)}s`;
    }

    /**
     * 拼接videoId av号、BV号
     */
    function settingKeyBuilder(bv) {
        return function (key) {
            return bv + ":" + key;
        }
    }

    /**
     * 抽取videoId av号、BV号
     */
    function extractCurVideoId() {
        let pathname = location.pathname;
        if (!pathname) {
            return undefined;
        }
        if (pathname.endsWith("/")) {
            pathname = pathname.substring(0, pathname.length - 1);
        }
        return pathname.substr(pathname.lastIndexOf('/') + 1);
    }

    /**
     * 抽取pageNo 当前集数
     */
    function extractCurPageNo() {
        let queryParams = parseQueryString();
        return queryParams.p ? queryParams.p : -1;
    }

    /**
     * 解析url参数
     */
    function parseQueryString() {
        let searchStr = location.search;
        if (!searchStr) {
            return {};
        }
        return Qs.parse(searchStr.substr(1));
    }

    /**
     * 获取重定向标记,获取一次后删除
     */
    function getRedirectFlag() {
        let queryParams = parseQueryString();
        let redirectFlag = queryParams[FLAG_REDIRECT];
        delete queryParams[FLAG_REDIRECT];
        history.replaceState(null, null, `${location.pathname}?${Qs.stringify(queryParams)}`);
        return redirectFlag;
    }

    /**
     * 设置重定向标记
     */
    function setRedirectFlag(obj) {
        obj[FLAG_REDIRECT] = 1;
    }

    /**
     * 发送桌面通知
     */
    function publishNotification(msg) {
        let notifyParam = {
            title: "bilibili-helper",
            text: msg,
            silent: true,
            timeout: 3000,
        };
        GM_notification(notifyParam);
    }
})();
