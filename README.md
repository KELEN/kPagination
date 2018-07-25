# kPagination分页插件

> 纯js分页插件，压缩版本~4kb，样式可以自定义

#### [demo](https://kelen.github.io/kPagination/dist/index.html)

## 使用方法

```html
<div id="pagination"></div>
<script src="kPagination.min.js"></script>
<script>
    new kPagination({
        id: 'pagination',
        currentPage: 1,         // 当前页
        totalPage: 20,
        offset: 5,
        showPrev: true,
        showNext: true,
        jumpPage: true,
        jumpText: '跳转'
    });
</script>
```

### 配置项

选项 | 类型 | 说明
----------- | ------------- | -------------
offset | number | 可以显示的按钮个数
showPrev | boolean | 是否显示上一页按钮
showNext | boolean | 是否显示下一页按钮
jumpPage | boolean | 是否显示跳转输入框
jumpText | string | 跳转按钮的文字
pageChange| function| 页面触发回调
afterRefresh | function | 重新渲染成功回调

### 可选样式

选项 | 说明
------------ | -------------
k-pagination-num-wrap | 分页容器样式
k-pagination-input-wrap | 按钮容器样式
k-pagination-num | 页码样式
k-pagination-num-active | 激活样式
k-pagination-disabled | 禁止样式
k-pagination-num-input | 输入框样式
k-pagination-jump-btn | 跳转按钮样式
k-pagination-jump-dot | 省略号样式