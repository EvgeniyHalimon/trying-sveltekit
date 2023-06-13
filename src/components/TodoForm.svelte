<script lang="ts">
    import { todos } from '../stores/TodosStore'
    let todoTitle: string
    function addTodo() {
       todos.update(todos => {
        return [
			   ...todos,
			   {
				   id: todos.length + 1,
				   title: todoTitle,
				   isComplete: false,
				   isEditing: false
			   }
		   ];
       })

       todoTitle = ''
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