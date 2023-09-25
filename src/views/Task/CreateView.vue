<template>
    <div class="task_create">

        <h1>Create A Task</h1>

        <div class="row">
            <div class="col-md-3"></div>
            <div class="col-md-6">
                <div class="form">
                    <input type="text" class="form-control" placeholder="Task Title" v-model="task.title">
                    <select class="form-control" multiple v-model="task.assigned_to">
                        <option v-for="employee in employees" :value="employee.id">{{ employee.name }}</option>
                    </select>
                    <textarea class="form-control" cols="5" rows="4" placeholder="Task Description" v-model="task.description"></textarea>
                    <button class="btn btn-primary" @click="create_task">Add Task</button>
                    <button class="btn btn-danger" @click="$router.go(-1)">Cancel</button>
                </div>
            </div>
            <div class="col-md-3"></div>
        </div>

    </div>
</template>


<style>
.task_create {
    color: #fff;
}

.task_create .form {
    background-color: #1a1a1a;
    border-radius: 4px;
    padding: 30px;
}

.task_create .form input,
.task_create .form select,
.task_create .form textarea {
    margin: 10px 0px;
}

.task_create .form .btn {
    width: 120px;
    margin-right: 10px;
}
</style>


<script>

import { defineComponent } from 'vue'

export default defineComponent({
    data() {
        return {
            employees: [],
            task: {
                project: 0
            }
        }
    },

    methods: {
        get_employees: async function () {
            this.employees = []
            await fetch(`${this.$api}/employees/`, {
                method: 'get',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${localStorage.getItem('token')}` }
            }).then(res => { return res.json() }).then(data => {
                for (let employee of data) {
                    this.employees.push({
                        'id': employee['id'],
                        'name': employee['username']
                    })
                }
            }).catch(e => { console.error(e) })
        },

        create_task: async function() {
            this.task.project = this.$route.params['id'];
            this.task.status = 'pending';
            await fetch(`${this.$api}/tasks/`, {
                method: 'post',
                headers: {'Content-Type': 'application/json', 'Authorization':`Token ${localStorage.getItem('token')}`},
                body: JSON.stringify(this.task)
            }).then(res=>{console.log(res.json()); this.$router.go(-1)}).catch(e=>{console.error(e)})
        }

    },

    beforeMount() {
        this.get_employees()
    }

})

</script>

