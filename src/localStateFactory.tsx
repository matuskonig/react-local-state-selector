import React, {
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { useRef } from "react";

type Listener = () => void;
export class Store<T> {
  _state: T;
  listeners = new Set<Listener>();

  constructor(initState: T) {
    this._state = initState;
  }

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  get state() {
    return this._state;
  }
  set state(value) {
    if (value !== this._state) {
      this._state = value;
      this.listeners.forEach((listener) => listener());
    }
  }
}
export type Selector<T, U> = (state: T) => U;
export type AreEqual<T> = (first: T, second: T) => boolean;
const basicEqual = <T,>(a: T, b: T) => a === b;

interface WithState<T> {
  state: T;
}
export const createProvider = <T,>(Context: React.Context<Store<T>>) => {
  const Provider: FC<PropsWithChildren<WithState<T>>> = ({
    state,
    children,
  }) => {
    const store = useRef<Store<T> | null>(null);
    if (store.current === null) {
      store.current = new Store(state);
    }
    useEffect(() => {
      if (store.current) {
        store.current.state = state;
      }
    }, [state]);
    return (
      <Context.Provider value={store.current}>{children}</Context.Provider>
    );
  };
  return Provider;
};

/* Use this context selector in case the selector is static, e.g. is not changed dynamicly, it is not a closure 
depending on props, etc. Reference change of selector does not trigger selector recumputation and update. */
export const useStaticContextSelector = <T, U>(
  Context: React.Context<Store<T>>,
  selector: Selector<T, U>,
  areEqual: AreEqual<U> = basicEqual
) => {
  const store = useContext(Context);

  const [value, setValue] = useReducer(
    (_: U, newState: U) => newState,
    selector(store.state)
  );

  useEffect(() => {
    const updateConditionally = () => {
      const selectorValue = selector(store.state);
      if (!areEqual(selectorValue, value)) {
        setValue(selectorValue);
      }
    };
    return store.subscribe(updateConditionally);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return value;
};

/* Use this selector for dynamic selectors, e.g. dynamically changed on condition, closures dependant on props.
Every reference change of selector causes selector trigger and if the return values are not equal, causes 
a rerender. */
export const useVariableContextSelector = <T, U>(
  Context: React.Context<Store<T>>,
  selector: Selector<T, U>,
  areEqual: AreEqual<U> = basicEqual
) => {
  const store = useContext(Context);
  const selectorRef = useRef(selector);

  const [value, setValue] = useReducer(
    (prevState: U, newState: U) => newState,
    selector(store.state)
  );

  useEffect(() => {
    selectorRef.current = selector;

    const selectorValue = selector(store.state);
    if (!areEqual(selectorValue, value)) {
      setValue(selectorValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selector]);

  useEffect(() => {
    const updateConditionally = () => {
      const selectorValue = selectorRef.current(store.state);
      if (!areEqual(selectorValue, value)) {
        setValue(selectorValue);
      }
    };
    return store.subscribe(updateConditionally);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return value;
};
