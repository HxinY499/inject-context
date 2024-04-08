import React from 'react';
import shallowEqual from './shallowEqual';
import get from './get';

export interface Configuer {
  get: (obj: any, path: string) => any;
  shallowEqual: (
    oldObj: any,
    newObj: any,
    deepKeys: Set<string> | string[]
  ) => boolean;
}
const CONFIG: Configuer = { get: get, shallowEqual: shallowEqual };

export function configure(newConfig: Partial<Configuer>) {
  Object.assign(CONFIG, newConfig);
}

export interface SelectorItem {
  /** 选择出的数值在props里的属性名 */
  key: string;
  /** 选值路径 */
  path: string;
  /** memo比较时是否采用深度比较（谨慎使用） */
  deep?: boolean;
}
/** 字符串形式是 {key: 'xxx', path: 'xxx'}的简写 */
export type Selector = (SelectorItem | string)[];

export interface ContextItem {
  /** Context实例 */
  context: React.Context<any>;
  /** 从Context中选值的字段配置 */
  selector: Selector;
}

/**
 * @description: 用于把context的值注入到props中，并使用memo比较props
 * @param contexts 一个数组，具体结构：
 * [
 *  {
 *    context: Context,
 *    selector: [{key:"key1", path: 'xxx[0].x'}],
 *  }
 * ]
 * @returns 一个接收组件的函数，这个组件就会被注入选择的context值
 */
export default function injectContext<ContextValue = {}, P = {}>(
  contexts: ContextItem[] | ContextItem
) {
  const allCtxs = Array.isArray(contexts) ? contexts : [contexts];

  return <Props = P>(Cpn: React.ComponentType<Props & ContextValue>) => {
    const memoDeepKeys: Set<string> = new Set();

    const injectContextMemoComponent = React.memo(
      props => React.createElement(Cpn as any, { ...props }),
      (newProps, oldProps) =>
        CONFIG.shallowEqual(newProps, oldProps, memoDeepKeys)
    );
    injectContextMemoComponent.displayName = 'injectContextMemoComponent';

    const component: React.FC<Props> = props => {
      const result: Record<string, any> = {};

      allCtxs.forEach(ctx => {
        const state = React.useContext(ctx.context);
        const contextSelector = (contextValue: any, selector: Selector) => {
          const selectState: Record<string, any> = {};
          selector.forEach(field => {
            if (typeof field === 'string') {
              selectState[field] = contextValue[field];
            } else {
              selectState[field.key] = CONFIG.get(contextValue, field.path);
              if (field.deep === true) {
                memoDeepKeys.add(field.key);
              }
            }
          });
          return selectState;
        };

        const selectState = contextSelector(state, ctx.selector);
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
