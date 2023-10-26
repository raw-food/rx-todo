import { fromEvent, map, BehaviorSubject, filter, withLatestFrom } from 'rxjs';

import './reset.css';
import './styles.css';
import { TodoItem } from './types';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Hello RxJS TODO</h1>
    <input id="todo-input"/>
    <div id="todo-list"></div>
  </div>
`;

const input = document.querySelector<HTMLInputElement>('#todo-input')!;

const todos$ = new BehaviorSubject<TodoItem[]>([]);
const input$ = new BehaviorSubject<string>('');

const REMOVE_TODO = 'remove_todo';
const ADD_TODO = 'add_todo';

const action = {
  [REMOVE_TODO]: (id: number) => {
    const updatedTodos = todos$.value.filter((todo) => todo.id !== id);
    todos$.next(updatedTodos);
  },
  [ADD_TODO]: (text: string) => {
    todos$.next([
      ...todos$.value,
      { id: todos$.value.length + 1, isDone: false, text },
    ]);

    input$.next('');
    input.value = '';
  },
};

const render = (todos: TodoItem[]) => {
  const html = todos
    .map(
      (todo) => `
    <div id=${todo.id}>
      <input type="checkbox" ${todo.isDone ? 'checked' : ''}/>
      <span>${todo.text}</span>
      <button class="delete-btn">삭제</button>
    </div>
  `
    )
    .join('');
  document.querySelector<HTMLDivElement>('#todo-list')!.innerHTML = html;
};

fromEvent<MouseEvent>(input, 'input')
  .pipe(map((event) => (event.target as HTMLInputElement).value))
  .subscribe(input$);

fromEvent<KeyboardEvent>(input, 'keydown')
  .pipe(
    filter(
      (event: KeyboardEvent) => event.key === 'Enter' && !event.isComposing
    ),
    withLatestFrom(input$),
    map(([, text]) => text),
    filter((text) => text.trim() !== '')
  )
  .subscribe(action[ADD_TODO]);

fromEvent<MouseEvent>(document, 'click')
  .pipe(
    filter(
      (event: Event) => (event.target as HTMLInputElement).type === 'checkbox'
    ),
    map((event) => Number((event.target as HTMLInputElement).parentElement?.id))
  )
  .subscribe((id) => {
    const updatedTodos = todos$.value.map((todo) =>
      todo.id === id ? { ...todo, isDone: !todo.isDone } : todo
    );
    todos$.next(updatedTodos);
  });

fromEvent<MouseEvent>(document, 'click')
  .pipe(
    filter((event: Event) =>
      (event.target as HTMLElement).classList.contains('delete-btn')
    ),
    map((event) => Number((event.target as HTMLElement).parentElement?.id))
  )
  .subscribe(action[REMOVE_TODO]);

todos$.subscribe(render);
