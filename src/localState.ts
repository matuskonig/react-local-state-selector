import { useMemo, useState } from "react";
import { createContextState } from "./localStateFactory";

const useLocalState = () => {
  const [name, setName] = useState<string | null>(null);
  const [surname, setSurname] = useState<string | null>(null);
  const [todos, setTodos] = useState<string[]>([]);

  return useMemo(
    () => ({
      name,
      surname,
      todos,
      setName,
      setSurname,
      addTodo: (todo: string) => setTodos([...todos, todo]),
      removeTodo: (index: number) =>
        setTodos(todos.filter((_, i) => i !== index)),
    }),
    [name, surname, todos]
  );
};
export const {
  Provider: LocalStateProvider,
  useContextSelector: useLocalContextSelector,
} = createContextState(useLocalState, "LocalState");
