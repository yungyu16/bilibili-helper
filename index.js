// ==UserScript==
// @name         BiliBili记住播放进度
// @namespace    yungyu16/bilibili-helper
// @version      0.1
// @description  记住B站视频或专辑播放进度
// @author       yungyu16
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

(function () {
    'use strict';
    window.Bhelper_debug = true;
    let qs = window.Qs;
    let videoEl = $(".bilibili-player-video video").get(0);
    let videoId = extractCurVideoId();
    let settingKey = settingKeyBuilder(videoId);
    if (Bhelper_debug) {
        GM_log("当前视频id：", videoId);
    }
    main();

    function formatProgressSecond(lastTime) {
        return `${Math.floor(lastTime / 60)}m${Math.floor(lastTime % 60)}s`;
    }

    function main() {
        let lastPage = GM_getValue(settingKey("lastPage"), 1);
        let lastTime = GM_getValue(settingKey("lastTime"), 0);
        let pageNo = extractCurPageNo();
        let pageList = $('.list-box li');
        let pageCount = pageList.length;
        if (Bhelper_debug) {
            GM_log("lastPage：", lastPage);
            GM_log("lastTime：", lastTime);
            GM_log("pageNo：", pageNo);
            GM_log("pageCount：", pageCount);
        }

        if (pageCount > 0 && (pageNo / 1) !== (lastPage / 1)) {
            location.href = `${videoId}?p=${lastPage}`
        }
        if (lastTime > 0) {
            setTimeout(() => {
                videoEl.currentTime = lastTime;
                GM_notification({
                    title: "bilibili-helper",
                    text: `已定位到历史播放进度:${formatProgressSecond(lastTime)}`,
                    silent: true,
                    timeout: 3000,
                });
                videoEl.play();
            }, 3 * 1000);
        }
        setInterval(persistPlayProgress, 5 * 1000);
    }

    function persistPlayProgress() {
        let pageNo = extractCurPageNo();
        let currentTime = videoEl.currentTime;
        GM_setValue(settingKey("lastPage"), pageNo);
        GM_setValue(settingKey("lastTime"), currentTime <= 0 ? 0 : currentTime);
        if (Bhelper_debug) {
            GM_log("lastPage：", pageNo, ",lastTime:", formatProgressSecond(currentTime));
        }
    }

    /**
     * 拼接videoId av号、BV号
     * @param bv
     * @returns {function(*): string}
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
        return pathname.substr(pathname.lastIndexOf('/') + 1);
    }

    /**
     * 抽取当前集数
     */
    function extractCurPageNo() {
        let searchStr = location.search;
        if (!searchStr) {
            return 1;
        }
        let queryParams = qs.parse(searchStr.substr(1));
        return queryParams.p ? queryParams.p : 1;
    }
})();
