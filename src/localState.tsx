import {
  useCallback,
  useMemo,
  useState,
  createContext,
  FC,
  PropsWithChildren,
} from "react";

import {
  Store,
  createProvider,
  useStaticContextSelector,
  useVariableContextSelector,
} from "./localStateFactory";

const useLocalState = () => {
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [todos, setTodos] = useState<string[]>([]);

  const addTodo = useCallback(
    (todo: string) => setTodos((t) => [...t, todo]),
    []
  );
  const removeTodo = useCallback(
    (index: number) => setTodos((t) => t.filter((_, i) => i !== index)),
    []
  );

  return useMemo(
    () => ({
      name,
      surname,
      todos,
      setName,
      setSurname,
      addTodo,
      removeTodo,
    }),
    [name, surname, todos, addTodo, removeTodo]
  );
};

type LocalState = ReturnType<typeof useLocalState>;

const Context = createContext(null as unknown as Store<LocalState>);
const ContextProvider = createProvider(Context);

export const LocalContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const state = useLocalState();
  return <ContextProvider state={state}>{children}</ContextProvider>;
};

export const useStaticLocalContextSelector = <T,>(
  selector: (state: LocalState) => T,
  areEqual?: (a: T, b: T) => boolean
) => useStaticContextSelector(Context, selector, areEqual);
export const useVariableLocalContextSelector = <T,>(
  selector: (state: LocalState) => T,
  areEqual?: (a: T, b: T) => boolean
) => useVariableContextSelector(Context, selector, areEqual);
