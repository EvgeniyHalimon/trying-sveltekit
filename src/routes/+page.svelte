<script lang="ts">
	
	import { NoTodos, TodoForm, TodoList } from '../components/index';
	import '../css/reset.css';
	import '../css/style.css';
	import { todos } from '../stores/TodosStore'

	$: {
		console.log('🚀 ~ file: +page.svelte:10 ~ todos:', todos);
	}

	/* function addTodo(event: CustomEvent<{todoTitle: string}>) {
		
		$todos = [
			...$todos,
			{
				id: $todos.length + 1,
				title: event.detail.todoTitle,
				isComplete: false,
				isEditing: false
			}
		];
	} */
</script>

<div class="todo-app-container">
	<div class="todo-app">
		<h2>Todo App</h2>
		<TodoForm /> <!-- on:todoAdded={addTodo} -->

		{#if $todos.length > 0}
			<TodoList />
		{:else}
			<NoTodos/>
		{/if}
	</div>
</div>
