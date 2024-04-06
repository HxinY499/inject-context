import { createContext, useContext, useRef, useState } from 'react';
import injectContext from 'inject-context';
import useHighlight from './useHightlight';

interface ContextValue {
  count?: number;
  someString?: string;
  setContext?: React.Dispatch<React.SetStateAction<ContextValue>>;
}
const Context = createContext<ContextValue>({});

function Child1() {
  const ref = useRef<HTMLDivElement>(null);
  useHighlight(ref);
  const { count } = useContext(Context);
  return (
    <div ref={ref} className="child">
      <div>使用了context的count：</div>
      <div>{count}</div>
    </div>
  );
}
function Child2() {
  const ref = useRef<HTMLDivElement>(null);
  useHighlight(ref);
  const { someString } = useContext(Context);
  return (
    <div ref={ref} className="child">
      <div>使用了context的someString：</div>
      <div>{someString}</div>
    </div>
  );
}

const InjectContextChild = injectContext<{ count: ContextValue['count'] }>({
  context: Context,
  selector: ['count'],
})(function (props) {
  const ref = useRef<HTMLDivElement>(null);
  useHighlight(ref);
  return (
    <div ref={ref} className="child">
      <div>使用了context的count：</div>
      <div>{props.count}</div>
    </div>
  );
});

const InjectContextChild2 = injectContext<{
  someString: ContextValue['someString'];
}>({
  context: Context,
  selector: ['someString'],
})(function (props) {
  const ref = useRef<HTMLDivElement>(null);
  useHighlight(ref);
  return (
    <div ref={ref} className="child">
      <div>使用了context的someString：</div>
      <div>{props.someString}</div>
    </div>
  );
});

function App() {
  const context = useContext(Context);

  return (
    <>
      <button
        onClick={() => {
          context.setContext?.(prev => ({ ...prev, count: prev.count! + 1 }));
        }}
      >
        改变context的count
      </button>
      <div className="wrapper">
        <div>
          <div className="title">使用inject-context</div>
          <InjectContextChild></InjectContextChild>
          <InjectContextChild2></InjectContextChild2>
        </div>
        <div>
          <div className="title">没有使用inject-context</div>
          <Child1></Child1>
          <Child2></Child2>
        </div>
      </div>
    </>
  );
}

const ContextApp = () => {
  const [state, setState] = useState<ContextValue>({
    count: 0,
    someString: '一个没有被更新的字符串',
  });
  return (
    <Context.Provider value={{ ...state, setContext: setState }}>
      <App />
    </Context.Provider>
  );
};
export default ContextApp;
