// ==UserScript==
// @name         BiliBili记住播放进度
// @namespace    yungyu16/bilibili-helper
// @version      0.1
// @description  记住B站视频或专辑播放进度
// @author       yungyu16
// @include     http*://www.bilibili.com/video/av*
// @include     http*://www.bilibili.com/video/BV*
// @require     https://lib.baomitu.com/qs/6.9.3/qs.min.js
// @grant       GM_log
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       unsafeWindow
// ==/UserScript==

(function () {
    'use strict';
    debugger;
    window.onload = doRealAction;

    function doRealAction() {
        debugger;
        let videoObj = $(".bilibili-player-video video").get(0);
        let videoId = extractCurVideoId();
        GM_log("当前视频id：", videoId)
        let settingKey = settingKeyBuilder(videoId);
        GM_setValue(settingKey("lastPage"), 6);
        let lastPage = GM_getValue(settingKey("lastPage"), 1);
        let lastTime = GM_getValue(settingKey("lastTime"), 0);
        let pageNo = extractCurPageNo();
        let pageList = $('.list-box li');
        let pageCount = pageList.length;
        GM_log("lastPage：", lastPage)
        GM_log("lastTime：", lastTime)
        GM_log("pageNo：", pageNo)
        GM_log("pageCount：", pageCount)
        if (pageCount > 0 && pageNo !== lastPage) {
            // let newPageIdx = lastPage - 1;
            location.href = `${videoId}?p=${lastPage}`
            // let newPage = pageList.eq(newPageIdx);
            // newPage.click();
            // newPage.toggleClass('on');
            // pageList.eq(pageNo - 1).toggleClass('on');
            // history.pushState(null, null, `${videoId}?p=${newPageIdx}`)
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
