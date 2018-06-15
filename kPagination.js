(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return factory(root);
        });
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        root.kPagination = factory(root);
    }
})(this, function (root) {
    'use strict';

    function addEvent(obj, type, handle) {
        try {  // Chrome、FireFox、Opera、Safari、IE9.0及其以上版本
            obj.addEventListener(type, handle, false);
        } catch (e) {
            try {  // IE8.0及其以下版本
                obj.attachEvent('on' + type, handle);
            } catch (e) {  // 早期浏览器
                obj['on' + type] = handle;
            }
        }
    }

    var KPagination = function (config) {
        this.el = document.getElementById(config.id);

        this.pageWrap = document.createElement('div');
        this.pageWrap.className = 'k-pagination-num-wrap';

        this.el.appendChild(this.pageWrap);

        this.currentPage = config.currentPage || 1;     // 当前页码
        this.totalPage = config.totalPage || 1;         // 总页码
        this.offset = config.offset || 5;               // 偏移量，显示的页码数量
        this.showPrev = !!config.showPrev;              // 显示上一页
        this.showNext = !!config.showNext;              // 显示下一页
        this.offsetHalf = Math.floor((this.offset - 1) / 2);
        this.jumpPage = !!config.jumpPage;              // 是否跳转页面
        this.jumpText = config.jumpText || '确定';
        this.pageArray = [];
        this.pageChangeFn = typeof config.pageChange === 'function' ? config.pageChange: undefined;
        this.afterRefreshFn = typeof config.afterRefresh === 'function' ? config.afterRefresh: undefined;

        this.refresh();
        this.bindEvent();

        if (this.jumpPage) {
            this.generateInput();
        }
    };

    /**
     *  生成跳转输入框
     */
    KPagination.prototype.generateInput = function () {
        var div = document.createElement('div');
        div.className = 'k-pagination-input-wrap';
        var input = document.createElement('input');
        input.className = 'k-pagination-num-input';
        input.type = 'text';
        var btn = document.createElement('button');
        btn.className = 'k-pagination-jump-btn';
        btn.innerText = this.jumpText;
        div.appendChild(input);
        div.appendChild(btn);

        addEvent(input, 'keyup', function () {
            this.value = this.value.replace(/\D/g, '');
        })
        this.el.appendChild(div);
    };

    /**
     * 分发事件
     * @returns {Array}
     */
    KPagination.prototype.bindEvent = function () {
        var me = this, num;
        addEvent(this.el, 'click', function (e) {
            var target = e.target || e.srcElement;
            if (target.getAttribute('data-num')) {
                num = parseInt(target.getAttribute('data-num'), 10);
                if (num == me.currentPage) {
                    return;
                } else {
                    if (me.pageChangeFn) {
                        me.pageChangeFn.call(me, num);
                    }
                    me.currentPage = num;
                    me.refresh();
                }
            }
            if (target.className.indexOf('k-pagination-jump-btn') > -1) {
                num = parseInt(target.previousSibling.value, 10);
                if (!num) {
                    return;
                }
                if (num < 1) num = 1;
                if (num > me.totalPage) {
                    num = me.totalPage;
                }
                if (me.pageChangeFn) {
                    me.pageChangeFn.call(me, num);
                }
                me.currentPage = num;
                me.refresh();
            }
        })
    };

    /**
     * 更新页面
     * @returns {Array}
     */
    KPagination.prototype.refresh = function () {
        var numArr = this.build();
        this.pageWrap.innerHTML = this.generateHtml(numArr);
        if (this.afterRefreshFn) {
            this.afterRefreshFn.call(this);
        }
    };

    KPagination.prototype.setTotalPage = function (totalPage) {
        this.totalPage = totalPage;
        this.refresh();
    };

    KPagination.prototype.setCurrentPage = function (currentPage) {
        this.currentPage = currentPage;
        this.refresh();
    };

    /**
     * 构建分页数组
     * @returns {Array}
     */
    KPagination.prototype.build = function () {
        var arr = [],
            i = 1,
            start = 1,
            end = this.totalPage;

        if (this.showPrev) {
            // 代表前一页
            arr.push('p-' + Math.max(1, Math.min(this.currentPage - 1, this.totalPage)));
        }

        if (this.totalPage <= this.offset) {
            // 总页码数在显示的数量范围内
            while (i <= this.totalPage) {
                arr.push(i);
                i++;
            }
        } else if (this.currentPage < this.offset) {
            i = 1;
            while (i <= this.offset) {
                arr.push(i);
                i++;
            }
            if (this.currentPage < this.totalPage) {
                arr.push('.');
                arr.push(this.totalPage);
            }
        } else if (this.currentPage >= this.offset) {
            // 超过offset的话显示省略号
            if (this.currentPage <= this.offset + this.offsetHalf) {
                // 没超过继续显示
                arr.push(1);
                arr.push('.');
                end = Math.min(this.currentPage + this.offsetHalf, this.totalPage);
                for (i = this.currentPage - this.offsetHalf; i <= end; i++) {
                    arr.push(i);
                }
                if (this.currentPage < this.totalPage - this.offsetHalf) {
                    arr.push('.');
                    arr.push(this.totalPage);
                }
            } else {
                // 前后...
                arr.push(1);
                arr.push('.');

                if (this.currentPage > this.totalPage - this.offset + 1) {
                    // 直接显示后面的
                    start = this.totalPage - this.offset + 1;
                    end = this.totalPage;
                    for (i = start; i <= end; i++) {
                        arr.push(i);
                    }
                } else {
                    end = Math.min(this.currentPage + this.offsetHalf, this.totalPage);
                    start = Math.min(this.currentPage - this.offsetHalf, this.totalPage - this.offset + 1);
                    for (i = start; i <= end; i++) {
                        arr.push(i);
                    }
                    if (this.currentPage < this.totalPage - this.offsetHalf) {
                        arr.push('.');
                        arr.push(this.totalPage);
                    }
                }
            }
        }

        if (this.showNext) {
            arr.push('n-' + Math.max(1, Math.min(this.currentPage + 1, this.totalPage)));
        }

        this.pageArray = arr;
        return arr;
    };

    KPagination.prototype.generateHtml = function (numArr) {
        var arr = [], cls;
        for (var i = 0; i < numArr.length; i++) {
            if (numArr[i] === '.') {
                arr.push('<a class="k-pagination-dot">...</a>');
            } else if (typeof numArr[i] === 'string') {
                cls = 'k-pagination-num'
                var str = numArr[i];
                var tmp = str.split('-');
                var tmpNum = tmp[1];
                if (tmpNum == this.currentPage) {
                    cls = 'k-pagination-disabled';
                }
                if (tmp[0] === 'p') {
                    // 上一页
                    arr.push('<a href="#" data-num="' + tmpNum + '" class="' + cls + '">&#60;</a>');
                } else if (tmp[0] === 'n') {
                    // 下一页
                    arr.push('<a href="#" data-num="' + tmpNum + '" class="' + cls + '">&#62;</a>');
                }
            } else {
                cls = 'k-pagination-num';
                if (this.currentPage == numArr[i]) {
                    cls += ' k-pagination-num-active';
                }
                arr.push('<a href="#" data-num="' + numArr[i] + '" class="' + cls + '">' + numArr[i] + '</a>');
            }
        }

        return arr.join('');
    };

    return KPagination;
});