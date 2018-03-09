# kPagination分页插件
> 纯js分页插件，压缩版本3k

## 使用方法

引入js插件

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

## 配置项

选项 | 类型 | 说明
------------ | -------------
offset | number | 可以显示的按钮个数
showPrev | boolean | 是否显示上一页按钮
showNext | boolean | 是否显示下一页按钮
jumpPage | boolean | 是否显示跳转输入框
jumpText | string | 跳转按钮的文字

