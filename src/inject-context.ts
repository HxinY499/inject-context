import React from 'react';
import shallowEqual from './shallowEqual';

export interface ContextItem<ContextValueType = any> {
  /** Context实例 */
  context: React.Context<ContextValueType>;
  /** 从Context中选值的字段配置 */
  selector: (value: ContextValueType) => Record<string, any>;
  /** React.memo比较props时需要深度比较的属性 */
  deepKeys?: string[];
}

/** 为injectContext的参数定义类型 */
export function defineSelector<T>(contextItem: ContextItem<T>): ContextItem<T> {
  return contextItem;
}

/**
 * @description: 用于把context的值注入到props中，并使用memo比较props
 * @param contexts 一个数组，具体结构：
 * [
 *  {
 *    context: Context,
 *    selector: (obj) => ({...}),
 *    deepKeys: [...]
 *  }
 * ]
 * @returns 一个接收组件的函数，这个组件就会被注入选择的context值
 */
export default function injectContext<ContextValueInProps = {}, Props = {}>(
  contexts: ContextItem[] | ContextItem
) {
  const allCtxs = Array.isArray(contexts) ? contexts : [contexts];

  return <P = Props>(Cpn: React.ComponentType<P & ContextValueInProps>) => {
    const memoDeepKeys: string[] = [];

    const injectContextMemoComponent = React.memo(
      props => React.createElement(Cpn as any, { ...props }),
      (newProps, oldProps) => shallowEqual(newProps, oldProps, memoDeepKeys)
    );
    injectContextMemoComponent.displayName = 'injectContextMemoComponent';

    const component: React.FC<Props> = props => {
      const result: Record<string, any> = {};

      allCtxs.forEach(ctx => {
        const contextValue = React.useContext(ctx.context);
        const selectState = ctx.selector(contextValue);
        if (ctx.deepKeys) memoDeepKeys.push(...ctx.deepKeys);
        Object.assign(result, selectState);
      });
      return React.createElement(injectContextMemoComponent, {
        ...props,
        ...result,
      });
    };
    component.displayName = 'injectContext';

    return component;
  };
}
