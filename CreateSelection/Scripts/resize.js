﻿var Sys = (function (ua) {
    var s = {};
    s.IE = ua.match(/msie ([\d.]+)/) ? true : false;
    s.Firefox = ua.match(/firefox\/([\d.]+)/) ? true : false;
    s.Chrome = ua.match(/chrome\/([\d.]+)/) ? true : false;
    s.IE6 = (s.IE && ([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 6)) ? true : false;
    s.IE7 = (s.IE && ([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 7)) ? true : false;
    s.IE8 = (s.IE && ([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 8)) ? true : false;
    return s;
})(navigator.userAgent.toLowerCase());
var Css = function (e, o) {/*更改对象的top,left,width,height来控制对象的大小*/
    for (var i in o) {
        e.style[i] = o[i];
    }
};
var Extend = function (destination, source) { /*拷贝对象的属性*/
    for (var property in source) {
        destination[property] = source[property];
    }
};
var Bind = function (object, fun) {
    var args = Array.prototype.slice.call(arguments).slice(2);
    return function () {
        return fun.apply(object, args);
    }
};
var BindAsEventListener = function (object, fun) {
    var args = Array.prototype.slice.call(arguments).slice(2);
    return function (event) {
        return fun.apply(object, [event || window.event].concat(args));
    }
};
var CurrentStyle = function (element) {
    return element.currentStyle || document.defaultView.getComputedStyle(element, null);
};
function addListener(element, e, fn) {
    element.addEventListener ? element.addEventListener(e, fn, false) : element.attachEvent("on" + e, fn);
};
function removeListener(element, e, fn) {
    element.removeEventListener ? element.removeEventListener(e, fn, false) : element.detachEvent("on" + e, fn)
};
var Class = function (properties) {
    var _class = function () {
        return (arguments[0] !== null && this.initialize && typeof (this.initialize) == 'function') ? this.initialize.apply(this, arguments) : this;
    };
    _class.prototype = properties;
    return _class;
};
var Resize = new Class({
    initialize: function (obj) {
        this.obj = obj;
        this.resizeelm = null;
        this.fun = null; //记录触发什么事件的索引
        this.original = []; //记录开始状态的数组
        this.width = null;
        this.height = null;
        this.fR = BindAsEventListener(this, this.resize);  /*拖拽去更改div的大小*/
        this.fS = Bind(this, this.stop);  /*停止移除监听的事件*/
        this.isResize = false;
    },
    set: function (elm, direction) {
        if (!elm) return;
        this.resizeelm = elm;
        addListener(this.resizeelm, 'mousedown', BindAsEventListener(this, this.start, this[direction]));
        return this;
    },
    start: function (e, fun) {
        imgEnabled = false;
        this.fun = fun;
        this.original = [parseInt(CurrentStyle(this.obj).width), parseInt(CurrentStyle(this.obj).height), parseInt(CurrentStyle(this.obj).left), parseInt(CurrentStyle(this.obj).top)];
        this.width = (this.original[2] || 0) + this.original[0];
        this.height = (this.original[3] || 0) + this.original[1];
        addListener(document, "mousemove", this.fR);
        addListener(document, 'mouseup', this.fS);
        scrollt = divper.scrollTop;//父容器滚动条高度
        scrollw = divper.scrollLeft;
        pWidth = parseFloat(imgDiv.style.width);//父容器当前宽度
        pHeight = parseFloat(imgDiv.style.height);
        docScrTop = document.documentElement.scrollTop || document.body.scrollTop;
        docScrLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
        tHeight = parseFloat(divper.offsetTop);//父容器距离浏览器的y坐标
        tWidth = parseFloat(divper.offsetLeft);//父容器距离浏览器的x坐标
        $.disable_cloose()//关闭拖拽移动父容器

    },
    resize: function (e) {
        this.isResize = true;
        this.fun(e);
        /*失去焦点的时候,调用this.stop去清除监听事件*/
        Sys.IE ? (this.resizeelm.onlosecapture = function () { this.fS(); }) : (this.resizeelm.onblur = function () { this.fS(); })
    },
    stop: function () {
        if (this.isResize) {
            imgEnabled = true;
            removeListener(document, "mousemove", this.fR);
            removeListener(document, "mousemove", this.fS);
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();      /**清除选中的内容*/
            this.isResize = false;
            $.disable_open()//开启拖拽移动父容器
            callbackOptDiv(this.obj);
        }
    },
    up: function (e) {
        var y = e.clientY + scrollt - tHeight + docScrTop;
        if (y < 0) {
            return false;
        }
        this.height > y ? Css(this.obj, { top: y + "px", height: this.height - y + "px" }) : this.turnDown(e);
    },
    down: function (e) {
        var y = e.clientY + scrollt - tHeight + docScrTop;
        if (y > this.original[3]) {
            if (y > pHeight)
                return false;
            Css(this.obj, { top: this.original[3] + 'px', height: y - this.original[3] + 'px' });
        } else {
            this.turnUp(e)
        }
    },
    left: function (e) {
        var x = e.clientX + scrollw - tWidth + docScrLeft;
        if (x < 0) {
            return false;
        }
        x < this.width ? Css(this.obj, { left: x + 'px', width: this.width - x + "px" }) : this.turnRight(e);
    },
    right: function (e) {
        var x = e.clientX + scrollw - tWidth + docScrLeft;
        if (x > this.original[2]) {
            if (x > pWidth)
                return false;
            Css(this.obj, { left: this.original[2] + 'px', width: x - this.original[2] + "px" })
        } else {
            this.turnLeft(e)
        }
    },
    leftUp: function (e) {
        this.up(e); this.left(e);
    },
    leftDown: function (e) {
        this.left(e); this.down(e);
    },
    rightUp: function (e) {
        this.up(e); this.right(e);
    },
    rightDown: function (e) {
        this.right(e); this.down(e);
    },
    turnDown: function (e) {
        var y = e.clientY + scrollt - tHeight + docScrTop;
        Css(this.obj, { top: this.height + 'px', height: y - this.height + 'px' });
    },
    turnUp: function (e) {
        var y = e.clientY + scrollt - tHeight + docScrTop;
        Css(this.obj, { top: y + 'px', height: this.original[3] - y + 'px' });
    },
    turnRight: function (e) {
        var x = e.clientX + scrollw - tWidth + docScrLeft;
        Css(this.obj, { left: this.width + 'px', width: x - this.width + 'px' });
    },
    turnLeft: function (e) {
        var x = e.clientX + scrollw - tWidth + docScrLeft;
        Css(this.obj, { left: x + 'px', width: this.original[2] - x + 'px' });
    }
});