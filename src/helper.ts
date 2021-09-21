
/**
 * 事件监听
 * @param el 
 * @param type 
 * @param listener 
 */
export function addEvent<T extends keyof HTMLElementEventMap>(el: HTMLElement, type: T, listener: (this: HTMLElement, ev: HTMLElementEventMap[T]) => any) {
  try {  // Chrome、FireFox、Opera、Safari、IE9.0及其以上版本
    el.addEventListener(type, listener, false);
  } catch (e) {
    try {  // IE8.0及其以下版本
      (<any>el).attachEvent('on' + type, listener);
    } catch (e) {  // 早期浏览器
      el['on' + type] = listener;
    }
  }
}

export function isFunction(fn: any) {
  return typeof fn === 'function';
}