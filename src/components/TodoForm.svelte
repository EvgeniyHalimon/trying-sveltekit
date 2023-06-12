<script lang="ts">
	import { createEventDispatcher } from "svelte";

    let todoTitle: string
    const dispatch = createEventDispatcher<{todoAdded: {todoTitle: string}}>()
    function addTodo() {
        dispatch("todoAdded",{
            todoTitle
        })
		todoTitle = '';
	}
</script>


<form action="#" on:submit|preventDefault={addTodo}>
    <input
        type="text"
        class="todo-input"
        placeholder="What do you need to do?"
        bind:value={todoTitle}
    />
</form>