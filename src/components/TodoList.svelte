<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import type { ITodoList } from '../types';
	import { createEventDispatcher } from 'svelte';
	export let filteredTodos: ITodoList[];
	export let remainingTodos: number;
	export let currentFilter: string;

	const dispatch = createEventDispatcher();
	function checkAllTodos() {
		dispatch('checkAllTodosDispatched');
	}

	function clearCompleted() {
		dispatch('clearCompletedTodos');
	}

	function editTodo(todo: ITodoList) {
        dispatch('editTodoDispatched',{
            todo
        });
    }

	function doneEdit(todo: ITodoList) {
        dispatch('doneEditDispatched',{
            todo
        });
    }

	function doneEditKeydown(event: KeyboardEvent, todo: ITodoList) {
        dispatch('doneEditKeydownDispatched',{
            key: event.key,
            todo
        });
    }

	function deleteTodo(id: number) {
        dispatch('deleteTodoDispatched', {
            id
        });
    }

    function updateFilter(filter: string) {
        dispatch('updateFilterDispatched', {
            filter
        });
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
							on:keydown={(event) => doneEditKeydown(event, todo)}
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
