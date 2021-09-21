import {
  addEvent,
  isFunction
} from './helper'

interface IProps {
  el: HTMLElement | string
  offset?: number,
  linkTemplate?: string,
  linkTarget?: string
}

class KPagination {
  el: HTMLElement | null;
  /**
   * 当前页码
   */
  currentPage: number = 1;

  /**
   * 总页码
   */
  totalPage: number = 0;

  /**
   * 显示的按钮个数
   */
  offset: number = 5;

  /**
   * 显示上一页
   */
  showPrev: boolean = true;

  /**
   * 显示下一页
   */
  showNext: boolean = true;

  /**
   * 页码改变事件
   */
  onPageChange: Function | undefined = undefined;

  /**
   * 链接模板，用于SEO
   */
  linkTemplate: string | undefined = undefined;

  /**
   * 点击跳转目标，等同于 a 标签的 target 属性
   */
  linkTarget: string | undefined = '_self';

  constructor(props: IProps) {
    const {
      el,
      offset, // 页面偏移
      linkTemplate,
      linkTarget,
    } = props;

    if (typeof el === 'string') {
      this.el = document.querySelector(el)
    } else {
      this.el = el;
    }

    if (!this.el) {
      console.error('el is not found in document')
      return
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

  private bindEvent() {
    let {
      el,
      onPageChange
    } = this;
    if (el) {
      addEvent(el, 'click', e => {
        e.preventDefault();
        const {
          currentPage,
        } = this;
        const target = e.target as HTMLElement;
        if (target) {
          // 当前页码
          const clickPage = target.getAttribute('data-page');
          if (clickPage) {
            if (+currentPage === +clickPage) {
              return;
            } else {
              if (onPageChange && isFunction(onPageChange)) {
                onPageChange.call(this, clickPage);
              }
              this.currentPage = Number(clickPage);
              el?.setAttribute('data-page', clickPage)
              this.refresh();
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
      })
    }
  }

  public refresh() {
    const pageArr = this.build();
    if (this.el)
      this.el.innerHTML = this.generateHtml(pageArr)
  }

  public setCurrentPage(page: number) {
    this.currentPage = page;
    this.refresh();
  }

  public setTotalPage(total: number) {
    this.totalPage = total;
    this.refresh()
  }

  private build(): any[] {
    let arr: any[] = [],
      i = 1,
      start = 1,
      end = this.totalPage;

    const {
      showPrev,
      showNext,
      totalPage,
      offset,
      currentPage,
    } = this;

    if (currentPage > totalPage) {
      console.error('current page number must less than total page number');
      return [];
    }

    const offsetHalf: number = Number(Math.floor(offset / 2));

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
    } else if (currentPage < offset) {
      i = 1;
      while (i <= offset) {
        arr.push(i);
        i++;
      }
      if (currentPage < totalPage) {
        arr.push('.');
        arr.push(totalPage);
      }
    } else if (currentPage > totalPage - offset + 1) {
      arr.push(1, '.');
      for (i = totalPage - offset + 1; i <= totalPage; i++) {
        arr.push(i);
      }
    } else if (currentPage >= offset) {
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
      } else {
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
        } else {
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
  }

  /**
   * 替换linkTemplate的page
   */
  private getLinkByTemplate = (page: string | number, text: string | number, className = '') => {
    const {
      linkTemplate,
      linkTarget
    } = this;
    if (linkTemplate) {
      const href = linkTemplate.replace(/{{(page)}}/, String(page));
      return `<a class="${className}" href="${href}" target="${linkTarget}">${text}</a>`;
    }
    return '';
  }

  /**
   * 获取链接
   * @param page 
   * @param text 
   * @param className 
   */
  private getLink = (page: string | number, text: string | number, className = '') => {
    return `<a href="javascript:void(0)" data-page="${page}" class="${className}">${text}</a>`
  }

  private generateHtml = (pageArr: (string | number)[]): string => {
    const {
      currentPage,
      linkTemplate,
    } = this;
    let arr: string[] = [];

    if (linkTemplate) {
      pageArr.forEach((p) => {
        let cls = '';
        if (p === '.') {
          arr.push('<span class="k-pagination-dot">...</span>');
        } else if (typeof p === 'string') {
          cls = 'k-pagination-num'
          let [flag, page] = p.split('-');
          if (+page === +currentPage) {
            cls = 'k-pagination-disabled';
          }
          if (flag === 'p') {
            // prev
            const aLink = this.getLinkByTemplate(page, '«', cls);
            arr.push(aLink);
          } else if (flag === 'n') {
            // next
            const aLink = this.getLinkByTemplate(page, '»', cls);
            arr.push(aLink);
          }
        } else {
          cls = 'k-pagination-num';
          if (+currentPage === +p) {
            cls += ' k-pagination-num-active';
          }
          arr.push(this.getLinkByTemplate(p, p, cls));
        }
      })
    } else {
      pageArr.forEach((p) => {
        let cls = '';
        if (p === '.') {
          arr.push('<a class="k-pagination-dot">...</a>');
        } else if (typeof p === 'string') {
          cls = 'k-pagination-num'
          let [flag, page] = p.split('-');
          if (+page === +currentPage) {
            cls = 'k-pagination-disabled';
          }
          if (flag === 'p') {
            // 上一页
            arr.push(this.getLink(page, "«", cls));
          } else if (flag === 'n') {
            // 下一页
            arr.push(this.getLink(page, "»", cls));
          }
        } else {
          cls = 'k-pagination-num';
          if (+currentPage === +p) {
            cls += ' k-pagination-num-active';
          }
          arr.push(this.getLink(p, p, cls));
        }
      })
    }
    return arr.join('');
  }

}

export default KPagination;