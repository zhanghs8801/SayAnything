// 判断登录状态
if (STATUS_LOGIN) {
    $("#logined").show();
    $("#login").hide();
    $("#bg_login").hide();
    $("#logined_uid").html(STATUS_LOGIN.uid);
}

// 设置第1关
var level = 1;
var bgp_level = (level - 1) * 28 + 110;
$("#level_" + level).addClass("btn_level_now").css("backgroundPosition", "-70px -" + bgp_level + "px");

window.LEVEL = 1;


// 设置选择关卡效果

$(".btn_level").hover(function() {
    if (!window.canChangeLevel) return;
    var bgp = (this.id.split("_")[1] - 1) * 28 + 110;
    this.css("backgroundPosition", "-140px -" + bgp + "px");
}, function() {
    if (!window.canChangeLevel) return;
    var bgp = (this.id.split("_")[1] - 1) * 28 + 110;
    this.css("backgroundPosition", "-140px -" + bgp + "px");
    if (this.hasClass("btn_level_now")) {
        this.css("backgroundPosition", "-70px -" + bgp + "px");
    }
    else {
        this.css("backgroundPosition", "0 -" + bgp + "px");
    }
}).click(function() {
    if (!window.canChangeLevel) return;
    $(".btn_level").removeClass("btn_level_now");
    $("#level_1").css("backgroundPosition", "0 -110px");
    $("#level_2").css("backgroundPosition", "0 -138px");
    $("#level_3").css("backgroundPosition", "0 -166px");
    this.addClass("btn_level_now");
    window.LEVEL = parseInt(this.id.split("_")[1]);
    showPlayed(STATUS_LEVEL[window.LEVEL - 1], 5, true);
});

var getPrizeName = function(id) {
    return AWARD_CODE_NAMES[id];
};

var showPlayed = function(s, i, isbegin) {
    var a = s;
    $(".box").removeClass("box_active").addClass("box_open");
    if (isbegin) {
        var sHTML = "<div title='" + getPrizeName(a[0]) + "' class='prize_" + a[0] + " prize pn' style='display: block;'></div><div class='pn' id='get_start' onclick='startPanes();'></div>";
    }
    else {
        if (a[0] == "thx") {
            var sHTML = "<div title='" + getPrizeName(a[0]) + "'  class='prize_" + a[0] + " prize pn' style='display: block;'></div></div>";
        }
        else {
            var sHTML = "<div title='" + getPrizeName(a[0]) + "'  class='prize_" + a[0] + " prize pn' style='display: block;'></div><div class='pn' id='get_prize' onclick='showPrizes();'></div>";
        }
    }
    $("#box_" + i).removeClass("box_open").addClass("box_active").html(sHTML);
    switch (i) {
        case 1:
            var best = $$.pick([2, 4]);
            break;
        case 2:
            var best = $$.pick([1, 3, 5]);
            break;
        case 3:
            var best = $$.pick([2, 6]);
            break;
        case 4:
            var best = $$.pick([1, 5, 7]);
            break;
        case 5:
            var best = $$.pick([2, 4, 6, 8]);
            break;
        case 6:
            var best = $$.pick([9, 5, 3]);
            break;
        case 7:
            var best = $$.pick([4, 8]);
            break;
        case 8:
            var best = $$.pick([5, 7, 9]);
            break;
        case 9:
            var best = $$.pick([6, 8]);
            break;
    }
    var sHTML = "<div title='" + getPrizeName(a[1]) + "'  class='prize_" + a[1] + " prize pn' style='display: block;'></div>"
    $("#box_" + best).html(sHTML);
    for (var j = 1, n = 2; j < 10; j++) {
        if (j != i && j != best) {
            var sHTML = "<div title='" + getPrizeName(a[n]) + "'  class='prize_" + a[n++] + " prize pn' style='display: block;'></div>"
            $("#box_" + j).html(sHTML);
        }
    }
};

var showPlayed_first = function(s, i, isbegin) {
    var a = s;
    if (a[0] == "thx") {
        var sHTML = "<div title='" + getPrizeName(a[0]) + "'  class='prize_" + a[0] + " prize pn' style='display: block;'></div></div>";
    }
    else {
        var sHTML = "<div title='" + getPrizeName(a[0]) + "'  class='prize_" + a[0] + " prize pn' style='display: block;'></div><div class='pn' id='get_prize' onclick='showPrizes();'></div>";
    }
    $("#box_" + i).removeClass("box_open").addClass("box_active").html(sHTML);
};

showPlayed(STATUS_LEVEL[0], 5, true);


// 点击抽奖
var startPanes = function() {
    window.canChangeLevel = false;
    var level = window.LEVEL;
    $("#playField_infoBg").show();
    $("#get_start").hide();
    if (STATUS_LOGIN) {
        if (STATUS_LOGIN.status == 0) {
            $("#pf_notvip").show();
        }
        else if (STATUS_LOGIN.status == 1) {
            $("#pf_expired").show();
        }
        else if (STATUS_LOGIN.status == 2) {
            $("#pf_phone").show();
        }
        else if (STATUS_LOGIN.status == 3) {
            if (STATUS_LOGIN.play_times == 0) {
                $("#pf_played").show();
            }
            else if (STATUS_LOGIN.max_level < level && level == 2) {
                $("#pf_nolevel2").show();
            }
            else if (STATUS_LOGIN.max_level < level && level == 3) {
                $("#pf_nolevel3").show();
            }
            else {
                $("#pf_canplay").show();
                $("#play_times_num").html(STATUS_LOGIN.play_times);
            }
        }
    }
    else {
        $("#pf_notlogin").show();
    }
};

var closePane = function() {
    window.canChangeLevel = true;
    $("#playField_infoBg, .playField_info").hide();
    $("#get_start").show();
};

var closePane_login = function() {
    closePane();
    $("#username").select();
};



// 开始游戏
var startPlaying = function() {
    $("#playField_infoBg, #pf_canplay").hide();
    window.covered = 0;
    coverBox();
};
window.isPlaying = false;
var startClick = function() {
    $("#key").show();
    window.isPlaying = true;
};

var coverBox = function() {
    var n = window.covered;
    switch (n) {
        case 0:
            n = 1;
            break;
        case 1:
            n = 2;
            break;
        case 2:
            n = 3;
            break;
        case 3:
            n = 6;
            break;
        case 4:
            n = 5;
            break;
        case 5:
            startClick();
            return;
        case 6:
            n = 9;
            break;
        case 7:
            n = 4;
            break;
        case 8:
            n = 7;
            break;
        case 9:
            n = 8;
            break;
        default:
            return;
    }
    var $box = $("#box_" + n);
    $box.removeClass("box_open").removeClass("box_active").addClass("box_cover").html("");
    window.covered = n;
    setTimeout(coverBox, 150);
};


if (!msie) {
    $(window).mousemove(function(e) {
        $("#key").css({
            left: e.page.x + 1,
            top: e.page.y + 1
        });
    });
}
else {
    document.body.onmousemove = function() {
        var event = window.event;
        if (event.pageX == null && event.clientX != null) {
            var doc = document.documentElement, body = document.body;
            event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0);
            event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0);
        }
        $("#key").css({
            left: event.pageX + 5,
            top: event.pageY + 5
        });
    }
}
window.canChangeLevel = true;

var openBox = function(i) {
    //openAnswer(STATUS_LEVEL[0], i);
    $.post("/XML_winXbaward.jsp?level=" + window.LEVEL, {}, function(s) {
        openAnswer(s.replace(/(^\s+)|(\s+$)/gm, '').split(","), i);
    });

};

var openAnswer = function(status_level, i) {
    $("#key").hide();
    window.isPlaying = false;
    showPlayed_first(status_level, i);
    window.BOX_I = i;
    window.status_level = status_level;
    window.setTimeout("showPlayed(window.status_level, window.BOX_I);", 4000);
};


$(".box").hover(function() {
    if (!window.isPlaying) return;
    this.removeClass("box_cover");
    this.addClass("box_hover");
}, function(e) {
    if (!window.isPlaying) return;
    this.removeClass("box_hover");
    this.addClass("box_cover");
}).click(function() {
    if (window.isPlaying) {
        var num = parseInt(this.id.split("_")[1]);
        var ch = ["一", "二", "三"];
        var s = "横向第" + ch[parseInt((num - 1) / 3)] + "排";
        s += "第" + ch[parseInt((num - 1) % 3)] + "个";
        if (confirm("你是不是要开" + s + "的这个箱子？")) {
            openBox(parseInt(this.id.split("_")[1]));
        }
    }
});


var showPrizes = function() {
    if (!STATUS_LOGIN) {
        alert("对不起，您还未登录，无法查看我的奖品！");
        return;
    }
    $.postJSON("/XML_findMyaward.jsp", {}, _showPrizes);
};

var _showPrizes = function(jnPrizes) {
    var s = "";
    for (var i = 0; i < jnPrizes.length; i++) {
        var prize = jnPrizes[i];
        s += "\
            <div>\
                <span class='popImg'><span class='prize_" + prize.awardId + " prize pn'></span>\
                <span id='usedString_" + prize.id + "' class='popused pn' style='display: " + (prize.isUsed ? "block" : "none") + ";'>已申领</span></span>\
                <span class='poptxt_bg'></span>\
                <span class='poptxt'>" + prize.Desc + "</span>\
                <a id='usedBtn_" + prize.id + "' style='display: " + (prize.isUsed ? "none" : "block") + ";' class='get_prize' href='javascript:' onclick='startUse(" + prize.id + ");' title='立即使用'></a>\
            </div>\
        ";
    }
    var s_showPrizes = "\
    <div id='bg_showPrizes'>\
        <div id='popPrizes_content'>\
            <div id='popPrizes_left'></div>\
            <div id='popPrizes_pics' class='pics'>\
            <div>\
" + s + "\
            </div>\
            </div>\
            <div id='popPrizes_right'></div>\
        </div>\
        <div id='popPrizes_close' class='pn' onclick='$$.modal.close();'></div>\
    </div>";
    $$.modal(s_showPrizes, { width: 507, height: 465, top: 30 });
    $("#popPrizes_right").format("flip", "h");

    var btnleft = $('#popPrizes_left');
    var btnright = $('#popPrizes_right');
    var ps = new $.PhotoSlide($('#popPrizes_content'), 380, 340, { autoSwitchTime: -1 });
    btnleft.addEvent('click', function(ev) { ev.stop(); if (ps.selectedPageNum > 0) { ps.changePage(ps.selectedPageNum - 1); } });
    btnright.addEvent('click', function(ev) { ev.stop(); if (ps.selectedPageNum < ps.pageCount - 1) { ps.changePage(ps.selectedPageNum + 1); } });
    ps.changePage(0);

    $$.modal._b.click(function() {
        $$.modal.close();
    });
};

var startUse = function(uaid) {
    $.postJSON("/XML_useXbAward.jsp", { uaid: uaid }, function(jn) {
        alert(jn.txt);
        $("#usedString_" + uaid).show();
        $("#usedBtn_" + uaid).hide();
        if (jn.a) top.location.href = jn.a;
    });
};
//var jnPrizes = [{ "id": 22, "isUsed": 0, "awardId": "pp_7d", "Desc": "PP会员免费7天续费！\r\n恭喜您，运气不错哦。点击“立即使用”，即可拥有PP会员免费7天续费服务。" }, { "id": 21, "isUsed": 0, "awardId": "pp_7d", "Desc": "PP会员免费7天续费！\r\n恭喜您，运气不错哦。点击“立即使用”，即可拥有PP会员免费7天续费服务。" }, { "id": 20, "isUsed": 0, "awardId": "pp_7d", "Desc": "PP会员免费7天续费！\r\n恭喜您，运气不错哦。点击“立即使用”，即可拥有PP会员免费7天续费服务。" }, { "id": 19, "isUsed": 0, "awardId": "key", "Desc": " 寻宝钥匙！\r\n恭喜你，找到寻宝钥匙，你又拥有了一次寻宝机会。\r\n再去试试手气吧！百元现金，ipad，iphone都有可能是你的哦！" }, { "id": 18, "isUsed": 0, "awardId": "key", "Desc": "寻宝钥匙！\r\n恭喜你，找到寻宝钥匙，你又拥有了一次寻宝机会。\r\n再去试试手气吧！百元现金，ipad，iphone都有可能是你的哦！" }, { "id": 17, "isUsed": 0, "awardId": "key", "Desc": "寻宝钥匙！\r\n恭喜你，找到寻宝钥匙，你又拥有了一次寻宝机会。\r\n再去试试手气吧！百元现金，ipad，iphone都有可能是你的哦！" }, { "id": 16, "isUsed": 0, "awardId": "key", "Desc": "寻宝钥匙！\r\n恭喜你，找到寻宝钥匙，你又拥有了一次寻宝机会。\r\n再去试试手气吧！百元现金，ipad，iphone都有可能是你的哦！" }, { "id": 15, "isUsed": 0, "awardId": "key", "Desc": "寻宝钥匙！\r\n恭喜你，找到寻宝钥匙，你又拥有了一次寻宝机会。\r\n再去试试手气吧！百元现金，ipad，iphone都有可能是你的哦！" }, { "id": 14, "isUsed": 0, "awardId": "key", "Desc": "寻宝钥匙！\r\n恭喜你，找到寻宝钥匙，你又拥有了一次寻宝机会。\r\n再去试试手气吧！百元现金，ipad，iphone都有可能是你的哦！" }, { "id": 13, "isUsed": 0, "awardId": "key", "Desc": "寻宝钥匙！\r\n恭喜你，找到寻宝钥匙，你又拥有了一次寻宝机会。\r\n再去试试手气吧！百元现金，ipad，iphone都有可能是你的哦！" }, { "id": 12, "isUsed": 0, "awardId": "key", "Desc": "寻宝钥匙！\r\n恭喜你，找到寻宝钥匙，你又拥有了一次寻宝机会。\r\n再去试试手气吧！百元现金，ipad，iphone都有可能是你的哦！" }, { "id": 11, "isUsed": 0, "awardId": "key", "Desc": "寻宝钥匙！\r\n恭喜你，找到寻宝钥匙，你又拥有了一次寻宝机会。\r\n再去试试手气吧！百元现金，ipad，iphone都有可能是你的哦！" }, { "id": 10, "isUsed": 0, "awardId": "pp_3m", "Desc": "3个月免费PP会员！\r\n恭喜您！您已获得价值30 元人民币的PP会员免费续费。\r\n点击“立即使用”即可直接续费3个月PP会员服务。" }, { "id": 9, "isUsed": 0, "awardId": "key", "Desc": "寻宝钥匙！\r\n恭喜你，找到寻宝钥匙，你又拥有了一次寻宝机会。\r\n再去试试手气吧！百元现金，ipad，iphone都有可能是你的哦！" }, { "id": 8, "isUsed": 0, "awardId": "pp_3m", "Desc": "3个月免费PP会员！\r\n恭喜您！您已获得价值30元人民币的PP会员免费续费。\r\n点击“立即使用”即可直接续费3个月PP会员服务。" }, { "id": 7, "isUsed": 0, "awardId": "thx", "Desc": "谢谢参与！\r\n不要灰心哦，再去试一下，希望就在转角处！" }, { "id": 6, "isUsed": 0, "awardId": "key", "Desc": "寻宝钥匙！\r\n恭喜你，找到寻宝钥匙，你又拥有了一次寻宝机会。\r\n再去试试手气吧！百元现金，ipad，iphone都有可能是你的哦！" }, { "id": 5, "isUsed": 0, "awardId": "thx", "Desc": "谢谢参与！\r\n不要灰心哦，再去试一下，希望就在转角处！" }, { "id": 4, "isUsed": 0, "awardId": "thx", "Desc": "谢谢参与！\r\n不要灰心哦，再去试一下，希望就在转角处！" }, { "id": 3, "isUsed": 0, "awardId": "thx", "Desc": "谢谢参与！\r\n不要灰心哦，再去试一下，希望就在转角处！" }, { "id": 2, "isUsed": 0, "awardId": "key", "Desc": "寻宝钥匙！\r\n恭喜你，找到寻宝钥匙，你又拥有了一次寻宝机会。\r\n再去试试手气吧！百元现金，ipad，iphone都有可能是你的哦！" }, { "id": 1, "isUsed": 0, "awardId": "thx", "Desc": "谢谢参与！\r\n不要灰心哦，再去试一下，希望就在转角处！"}];
//_showPrizes(jnPrizes);
