<script lang="ts">
	
	import { NoTodos, TodoForm, TodoList } from '../components/index';
	import '../css/reset.css';
	import '../css/style.css';
	import type { ITodoList } from '../types';

	let todos: ITodoList[] = [];
	let currentFilter = 'all';

	$: remainingTodos = todos.filter((todo: ITodoList) => !todo.isComplete).length;
	$: filteredTodos =
		currentFilter === 'all'
			? todos
			: currentFilter === 'active'
			? todos.filter((todo) => !todo.isComplete)
			: todos.filter((todo) => todo.isComplete);
	$: {
		console.log('🚀 ~ file: +page.svelte:10 ~ todos:', todos);
	}

	function addTodo(event: CustomEvent<{todoTitle: string}>) {
		todos = [
			...todos,
			{
				id: todos.length + 1,
				title: event.detail.todoTitle,
				isComplete: false,
				isEditing: false
			}
		];
	}

	function deleteTodo(id: number): any {
		todos = todos.filter((todo: ITodoList) => todo.id !== id);
	}

	function checkAllTodos() {
		todos = todos.map((todo) => {
			todo.isComplete = true;
			return todo;
		});
	}

	function clearCompleted() {
		todos = todos.filter((todo: ITodoList) => !todo.isComplete);
	}

	let beforeEditCache = '';
	function editTodo(todo: ITodoList) {
		beforeEditCache = todo.title;
		todo.isEditing = true;
		todos = todos;
	}

	function doneEdit(todo: ITodoList) {
		if (todo.title.trim().length === 0) {
			todo.title = beforeEditCache;
		}
		todo.isEditing = false;
		todos = todos;
	}

	function doneEditKeydown(key: string, todo: ITodoList) {
		if (key === 'Enter') {
			doneEdit(todo);
		}
		if (key === 'Escape') {
			todo.title = beforeEditCache;
			doneEdit(todo);
		}
	}

	function updateFilter(filter: string){
		currentFilter = filter;
	}
</script>

<div class="todo-app-container">
	<div class="todo-app">
		<h2>Todo App</h2>
		<TodoForm on:todoAdded={addTodo}/>

		{#if todos.length > 0}
			<TodoList 
				{filteredTodos} 
				{remainingTodos} 
				{currentFilter} 
				on:checkAllTodosDispatched={checkAllTodos}
				on:clearCompletedTodos={clearCompleted}
				on:deleteTodoDispatched={(e) => deleteTodo(e.detail.id)}
				on:doneEditDispatched={(e) => doneEdit(e.detail.todo)}
				on:doneEditKeydownDispatched={(e) => doneEditKeydown(e.detail.key, e.detail.todo)}
				on:editTodoDispatched={(e) => editTodo(e.detail.todo)}
				on:updateFilterDispatched={(e) => updateFilter(e.detail.filter)}
			/>
		{:else}
			<NoTodos/>
		{/if}
	</div>
</div>
