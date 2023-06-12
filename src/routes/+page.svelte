<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition';
	import { NoTodos, TodoForm } from '../components/index';
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

	function doneEditKeydown(event: KeyboardEvent, todo: ITodoList) {
		if (event.key === 'Enter') {
			doneEdit(todo);
		}
		if (event.key === 'Escape') {
			todo.title = beforeEditCache;
			doneEdit(todo);
		}
	}
</script>

<div class="todo-app-container">
	<div class="todo-app">
		<h2>Todo App</h2>
		<TodoForm on:todoAdded={addTodo}/>

		{#if todos.length > 0}
			<ul class="todo-list">
				{#each filteredTodos as todo (todo.id)}
					<li class="todo-item-container" transition:fade={{duration: 300}}>
						<div class="todo-item">
							<input type="checkbox" bind:checked={todo.isComplete} />
							{#if !todo.isEditing}
								<span
									on:dblclick={() => editTodo(todo)}
									class="todo-item-label"
									class:line-through={todo.isComplete}>{todo.title}</span
								>
							{:else}
								<!-- svelte-ignore a11y-autofocus -->
								<input
									type="text"
									class="todo-item-input"
									bind:value={todo.title}
									on:blur={() => doneEdit(todo)}
									on:keydown={(event) => doneEditKeydown(event, todo)}
									autofocus
								/>
							{/if}
						</div>
						<button class="x-button" on:click={deleteTodo(todo.id)}>
							<svg class="x-button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									strokelinecap="round"
									strokelinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</li>
				{/each}
			</ul>

			<div class="check-all-container">
				<div>
					<button on:click={checkAllTodos} class="button">Check All</button>
				</div>

				<div>
					{#key remainingTodos}
						<span style="display: inline-block" in:fly={{ y: -20 }}>
							{remainingTodos}
						</span>
					{/key}
					<span>items remaining</span>
				</div>
			</div>

			<div class="other-buttons-container">
				<div>
					<button
						class="button filter-button"
						on:click={() => (currentFilter = 'all')}
						class:filter-button-active={currentFilter === 'all'}
					>
						All
					</button>
					<button
						class="button filter-button"
						on:click={() => (currentFilter = 'active')}
						class:filter-button-active={currentFilter === 'active'}
					>
						Active
					</button>
					<button
						class="button filter-button"
						on:click={() => (currentFilter = 'completed')}
						class:filter-button-active={currentFilter === 'completed'}
					>
						Completed
					</button>
				</div>
				<div>
					<button class="button" on:click={clearCompleted}>Clear completed</button>
				</div>
			</div>
		{:else}
			<NoTodos/>
		{/if}
	</div>
</div>
