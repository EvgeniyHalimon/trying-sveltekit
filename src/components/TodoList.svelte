<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import type { ITodoList } from '../types';
    import { todos } from '../stores/TodosStore'

   /*  let todosValue: ITodoList[];
    const unsubscribe = todos.subscribe((value) => (todosValue = value))
    onDestroy(unsubscribe)
    
    instead we can use $todos in code
    */

	
	let remainingTodos: number;
	let currentFilter: string = 'all';

    $: filteredTodos =
		currentFilter === 'all'
			? $todos
			: currentFilter === 'active'
			? $todos.filter((todo) => !todo.isComplete)
			: $todos.filter((todo) => todo.isComplete);

    $: remainingTodos = $todos.filter((todo: ITodoList) => !todo.isComplete).length;

	function checkAllTodos() {
        todos.update((todos) => 
        todos.map((todo) => {
			todo.isComplete = true;
			return todo;
		})
	)}

	function clearCompleted() {
		todos.update((todos) => todos.filter((todo: ITodoList) => !todo.isComplete))
	}

	let beforeEditCache = '';
	function editTodo(todo: ITodoList) {
		beforeEditCache = todo.title;
		todo.isEditing = true;
		$todos = $todos;
	}

	function doneEdit(todo: ITodoList) {
		if (todo.title.trim().length === 0) {
			todo.title = beforeEditCache;
		}
		todo.isEditing = false;
		$todos = $todos;
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

	function deleteTodo(id: number) {
        todos.update((todos) => todos.filter((todo: ITodoList) => todo.id !== id))
    }

    function updateFilter(filter: string){
		currentFilter = filter;
	}
</script>

<div>
	<ul class="todo-list">
		{#each filteredTodos as todo (todo.id)}
			<li
				class="todo-item-container"
				in:fly={{ x: 100, duration: 400 }}
				out:fade={{ duration: 300 }}
			>
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
							on:keydown={(e) => doneEditKeydown(e.key, todo)}
							autofocus
						/>
					{/if}
				</div>
				<button class="x-button" on:click={() => deleteTodo(todo.id)}>
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
				on:click={() => updateFilter('all')}
				class:filter-button-active={currentFilter === 'all'}
			>
				All
			</button>
			<button
				class="button filter-button"
				on:click={() => updateFilter('active')}
				class:filter-button-active={currentFilter === 'active'}
			>
				Active
			</button>
			<button
				class="button filter-button"
				on:click={() => updateFilter('completed')}
				class:filter-button-active={currentFilter === 'completed'}
			>
				Completed
			</button>
		</div>
		<div>
			<button class="button" on:click={clearCompleted}>Clear completed</button>
		</div>
	</div>
</div>
