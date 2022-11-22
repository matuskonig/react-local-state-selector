import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type Listener = () => void;
class Store<T> {
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
type Selector<T, U> = (state: T) => U;
type Compare<T> = (first: T, second: T) => boolean;

export const localStateFactory = <T extends object>(
  stateFunc: () => T,
  displayName: string
) => {
  const Context = React.createContext((undefined as unknown) as Store<T>);
  Context.displayName = displayName;

  const Provider: React.FC<PropsWithChildren> = ({ children }) => {
    const state = stateFunc();
    const store = React.useRef(new Store(state));
    useEffect(() => {
      store.current.state = state;
    }, [state]);

    return (
      <Context.Provider value={store.current}>{children}</Context.Provider>
    );
  };

  const useContextSelector = <U,>(
    selector: Selector<T, U>,
    compare: Compare<U> = (first, second) => first === second
  ) => {
    const store = useContext(Context);

    const [value, setValue] = useState(selector(store.state));

    const updateStateConditionally = () => {
      const selectorValue = selector(store.state);
      if (compare(selectorValue, value)) {
        setValue(selectorValue);
      }
    };
    useEffect(store.subscribe(updateStateConditionally));

    return value;
  };

  return { Provider, useContextSelector };
};
