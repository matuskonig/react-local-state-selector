import { useCallback, useMemo, useState } from "react";
import { createContextState } from "./localStateFactory";

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
export const {
  Provider: LocalStateProvider,
  useContextSelector: useLocalContextSelector,
} = createContextState(useLocalState, "LocalState");
