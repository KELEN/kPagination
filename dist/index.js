(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.KPagination = factory());
}(this, (function () { 'use strict';

  /**
   * 事件监听
   * @param el
   * @param type
   * @param listener
   */
  function addEvent(el, type, listener) {
      try { // Chrome、FireFox、Opera、Safari、IE9.0及其以上版本
          el.addEventListener(type, listener, false);
      }
      catch (e) {
          try { // IE8.0及其以下版本
              el.attachEvent('on' + type, listener);
          }
          catch (e) { // 早期浏览器
              el['on' + type] = listener;
          }
      }
  }
  function isFunction(fn) {
      return typeof fn === 'function';
  }

  var KPagination = /** @class */ (function () {
      function KPagination(props) {
          var _this = this;
          /**
           * 当前页码
           */
          this.currentPage = 1;
          /**
           * 总页码
           */
          this.totalPage = 0;
          /**
           * 显示的按钮个数
           */
          this.offset = 5;
          /**
           * 显示上一页
           */
          this.showPrev = true;
          /**
           * 显示下一页
           */
          this.showNext = true;
          /**
           * 页码改变事件
           */
          this.onPageChange = undefined;
          /**
           * 链接模板，用于SEO
           */
          this.linkTemplate = undefined;
          /**
           * 点击跳转目标，等同于 a 标签的 target 属性
           */
          this.linkTarget = '_self';
          /**
           * 替换linkTemplate的page
           */
          this.getLinkByTemplate = function (page, text, className) {
              if (className === void 0) { className = ''; }
              var _a = _this, linkTemplate = _a.linkTemplate, linkTarget = _a.linkTarget;
              if (linkTemplate) {
                  var href = linkTemplate.replace(/{{(page)}}/, String(page));
                  return "<a class=\"" + className + "\" href=\"" + href + "\" target=\"" + linkTarget + "\">" + text + "</a>";
              }
              return '';
          };
          /**
           * 获取链接
           * @param page
           * @param text
           * @param className
           */
          this.getLink = function (page, text, className) {
              if (className === void 0) { className = ''; }
              return "<a href=\"javascript:void(0)\" data-page=\"" + page + "\" class=\"" + className + "\">" + text + "</a>";
          };
          this.generateHtml = function (pageArr) {
              var _a = _this, currentPage = _a.currentPage, linkTemplate = _a.linkTemplate;
              var arr = [];
              if (linkTemplate) {
                  pageArr.forEach(function (p) {
                      var cls = '';
                      if (p === '.') {
                          arr.push('<span class="k-pagination-dot">...</span>');
                      }
                      else if (typeof p === 'string') {
                          cls = 'k-pagination-num';
                          var _a = p.split('-'), flag = _a[0], page = _a[1];
                          if (+page === +currentPage) {
                              cls = 'k-pagination-disabled';
                          }
                          if (flag === 'p') {
                              // prev
                              var aLink = _this.getLinkByTemplate(page, '«', cls);
                              arr.push(aLink);
                          }
                          else if (flag === 'n') {
                              // next
                              var aLink = _this.getLinkByTemplate(page, '»', cls);
                              arr.push(aLink);
                          }
                      }
                      else {
                          cls = 'k-pagination-num';
                          if (+currentPage === +p) {
                              cls += ' k-pagination-num-active';
                          }
                          arr.push(_this.getLinkByTemplate(p, p, cls));
                      }
                  });
              }
              else {
                  pageArr.forEach(function (p) {
                      var cls = '';
                      if (p === '.') {
                          arr.push('<a class="k-pagination-dot">...</a>');
                      }
                      else if (typeof p === 'string') {
                          cls = 'k-pagination-num';
                          var _a = p.split('-'), flag = _a[0], page = _a[1];
                          if (+page === +currentPage) {
                              cls = 'k-pagination-disabled';
                          }
                          if (flag === 'p') {
                              // 上一页
                              arr.push(_this.getLink(page, "«", cls));
                          }
                          else if (flag === 'n') {
                              // 下一页
                              arr.push(_this.getLink(page, "»", cls));
                          }
                      }
                      else {
                          cls = 'k-pagination-num';
                          if (+currentPage === +p) {
                              cls += ' k-pagination-num-active';
                          }
                          arr.push(_this.getLink(p, p, cls));
                      }
                  });
              }
              return arr.join('');
          };
          var el = props.el, offset = props.offset, // 页面偏移
          linkTemplate = props.linkTemplate, linkTarget = props.linkTarget;
          if (typeof el === 'string') {
              this.el = document.querySelector(el);
          }
          else {
              this.el = el;
          }
          if (!this.el) {
              console.error('el is not found in document');
              return;
          }
          this.totalPage = Number(this.el.getAttribute('data-total'));
          this.currentPage = Number(this.el.getAttribute('data-page'));
          this.linkTemplate = linkTemplate;
          this.linkTarget = linkTarget;
          this.offset = offset || 5;
          this.refresh();
          if (!linkTemplate) {
              this.bindEvent();
          }
      }
      KPagination.prototype.bindEvent = function () {
          var _this = this;
          var _a = this, el = _a.el, onPageChange = _a.onPageChange;
          if (el) {
              addEvent(el, 'click', function (e) {
                  e.preventDefault();
                  var currentPage = _this.currentPage;
                  var target = e.target;
                  if (target) {
                      // 当前页码
                      var clickPage = target.getAttribute('data-page');
                      if (clickPage) {
                          if (+currentPage === +clickPage) {
                              return;
                          }
                          else {
                              if (onPageChange && isFunction(onPageChange)) {
                                  onPageChange.call(_this, clickPage);
                              }
                              _this.currentPage = Number(clickPage);
                              el === null || el === void 0 ? void 0 : el.setAttribute('data-page', clickPage);
                              _this.refresh();
                          }
                      }
                      // if (target.className.indexOf('k-pagination-jump-btn') > -1) {
                      //   if (target && target.previousSibling) {
                      //     page = parseInt((target.previousSibling as HTMLInputElement).value, 10);
                      //     if (!page) {
                      //       return;
                      //     }
                      //     if (page < 1) page = 1;
                      //     if (page > totalPage) {
                      //       page = totalPage;
                      //     }
                      //     if (onPageChange) {
                      //       onPageChange.call(this, page);
                      //     }
                      //     currentPage = page;
                      //     this.refresh();
                      //   }
                      // }
                  }
              });
          }
      };
      KPagination.prototype.refresh = function () {
          var pageArr = this.build();
          if (this.el)
              this.el.innerHTML = this.generateHtml(pageArr);
      };
      KPagination.prototype.setCurrentPage = function (page) {
          this.currentPage = page;
          this.refresh();
      };
      KPagination.prototype.setTotalPage = function (total) {
          this.totalPage = total;
          this.refresh();
      };
      KPagination.prototype.build = function () {
          var arr = [], i = 1, start = 1, end = this.totalPage;
          var _a = this, showPrev = _a.showPrev, showNext = _a.showNext, totalPage = _a.totalPage, offset = _a.offset, currentPage = _a.currentPage;
          if (currentPage > totalPage) {
              console.error('current page number must less than total page number');
              return [];
          }
          var offsetHalf = Number(Math.floor(offset / 2));
          if (showPrev) {
              // p-3 => 上一页是3
              arr.push('p-' + Math.max(1, Math.min(currentPage - 1, totalPage)));
          }
          if (totalPage <= offset) {
              // 总页码数在显示的数量范围内
              while (i <= totalPage) {
                  arr.push(i);
                  i++;
              }
          }
          else if (currentPage < offset) {
              i = 1;
              while (i <= offset) {
                  arr.push(i);
                  i++;
              }
              if (currentPage < totalPage) {
                  arr.push('.');
                  arr.push(totalPage);
              }
          }
          else if (currentPage > totalPage - offset + 1) {
              arr.push(1, '.');
              for (i = totalPage - offset + 1; i <= totalPage; i++) {
                  arr.push(i);
              }
          }
          else if (currentPage >= offset) {
              // 超过offset的话显示省略号
              if (currentPage <= offset + offsetHalf) {
                  // 没超过继续显示
                  arr.push(1);
                  arr.push('.');
                  end = Math.min(currentPage + offsetHalf, totalPage);
                  for (i = currentPage - offsetHalf; i <= end; i++) {
                      arr.push(i);
                  }
                  if (currentPage < totalPage - offsetHalf) {
                      arr.push('.');
                      arr.push(totalPage);
                  }
              }
              else {
                  // 前后...
                  arr.push(1);
                  arr.push('.');
                  if (currentPage > totalPage - offset + 1) {
                      // 直接显示后面的
                      start = totalPage - offset + 1;
                      end = totalPage;
                      for (i = start; i <= end; i++) {
                          arr.push(i);
                      }
                  }
                  else {
                      end = Math.min(currentPage + offsetHalf, totalPage);
                      start = Math.min(currentPage - offsetHalf, totalPage - offset + 1);
                      for (i = start; i <= end; i++) {
                          arr.push(i);
                      }
                      if (currentPage < totalPage - offsetHalf) {
                          arr.push('.');
                          arr.push(totalPage);
                      }
                  }
              }
          }
          if (showNext) {
              // n-2 => 下一页是2
              arr.push('n-' + Math.max(1, Math.min(currentPage + 1, totalPage)));
          }
          return arr;
      };
      return KPagination;
  }());

  return KPagination;

})));
