### **通过 selector 结合 React.memo 来解决 context 重渲染的性能问题**

## 使用方式

```tsx
// 单个context
const Componnet = injectContext({
  context: Context,
  selector: (s) => ({....})
})(你的组件)

// 多个context
const Componnet = injectContext([
  {
    context: Context1,
    selector: (s) => ({....})
  },
  {
    context: Context2,
    selector: (s) => ({....})
  }
])(你的组件)
```

## 效果

组件重渲染，dom 会高亮，图中 `count` 会被改变，`someString` 不会被改变

`npm run demo` 可以运行该 demo

![20240410100632.gif](https://cdn.nlark.com/yuque/0/2024/gif/8406536/1712714803261-3211f283-75a3-48d1-89da-65d37dc10bba.gif#averageHue=%23f9f9fe&clientId=ud51f2106-5b8f-4&from=paste&height=326&id=u2b67f847&originHeight=652&originWidth=1592&originalType=binary&ratio=2&rotation=0&showTitle=false&size=228359&status=done&style=none&taskId=u8ed8d7e6-a0a5-4562-b475-8da1e105d69&title=&width=796)

## 支持深度比较

`memo` 默认的比较函数只能对比第一层属性，**inject-context** 扩展了这个默认函数，支持选择性的深度比较，如果选择的某个 context 状态想要深度比较的话，可以通过如下方式：

```tsx
const InjectContextChild2 = injectContext<{
  someString: ContextValue['someString'];
}>({
  context: Context,
  selector: s => ({ obj: s.obj }),

  // selector返回的对象的键
  deepKeys: ['obj']
})(....);
```

指定`deepKeys`来告诉 **inject-context** 你需要深度比较的属性，值就是 selector 返回的对象的键名。

**注意，不要滥用这个特性，深度比较带来的开销可能大于重渲染的开销。**

## TS 支持

#### props 类型提示

![image.png](https://cdn.nlark.com/yuque/0/2024/png/8406536/1712715954186-1ef8a3e4-0049-4b09-a564-177a46846a67.png#averageHue=%2320201f&clientId=u3c866676-172b-4&from=paste&height=136&id=u542129e3&originHeight=272&originWidth=700&originalType=binary&ratio=2&rotation=0&showTitle=false&size=48736&status=done&style=none&taskId=u6bbcef87-c7e6-4fbd-ba63-880218da9f0&title=&width=350)

count 实际被注入到 props 里了，但是并没有良好的类型提示，可以通过给 inject-context 传泛型解决，它能接收两个泛型，第一个是注入的值的类型，第二个是原本 props 的类型。

![image.png](https://cdn.nlark.com/yuque/0/2024/png/8406536/1712716255130-d4bcc7e7-d0a3-4c80-b940-2b908eea85e1.png#averageHue=%23201f1f&clientId=u3c866676-172b-4&from=paste&height=306&id=u89d529ab&originHeight=612&originWidth=1542&originalType=binary&ratio=2&rotation=0&showTitle=false&size=128044&status=done&style=none&taskId=u28faf9fe-98f8-4fa8-949c-7e951a719ab&title=&width=771)

#### selector 参数类型

默认的 selector 参数是 any，没有良好的类型提示

![image.png](https://cdn.nlark.com/yuque/0/2024/png/8406536/1712716481791-17e48c21-f6f7-474b-a0dd-e2f4080506d1.png#averageHue=%23212120&clientId=u3c866676-172b-4&from=paste&height=144&id=ude480040&originHeight=288&originWidth=1036&originalType=binary&ratio=2&rotation=0&showTitle=false&size=58706&status=done&style=none&taskId=u9d714e9e-a3ba-4cfe-a566-b88f37eb622&title=&width=518)

可以通过 inject-context 提供的 defineSelector 来提供类型提示。

![image.png](https://cdn.nlark.com/yuque/0/2024/png/8406536/1712716630227-b21c2a9d-fb95-4402-8364-ee600c94e318.png#averageHue=%2320201f&clientId=u3c866676-172b-4&from=paste&height=269&id=u6469d657&originHeight=538&originWidth=1750&originalType=binary&ratio=2&rotation=0&showTitle=false&size=102980&status=done&style=none&taskId=u5228cd15-047c-4a0f-9d3e-bd6a9961418&title=&width=875)

### 写在最后

[介绍文章](https://juejin.cn/post/7355800792073519144)
