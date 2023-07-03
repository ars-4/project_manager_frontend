<template>
    <div class="row project-create">
        <div class="col-md-2"></div>
        <div class="col-md-8">
            <h2>Create a project</h2>
            <div class="form row">
                <div class="col-md-12">
                    <input type="text" class="form-control" placeholder="Project Title" v-model="project.title">
                </div>
                <br>
                <div class="col-md-6">
                    <textarea cols="38" rows="5" class="form-control" placeholder="Project Description" v-model="project.description"></textarea>
                </div>
                <div class="col-md-6">
                    <div class="special_multiple_select">
                        <span>Select Employees</span>
                        <select class="form-control" multiple v-model="project.members">
                            <option v-for="employee in employees" :value="employee.id">{{ employee.name }}</option>
                        </select>
                    </div>
                </div>
                <br>
                <div class="col-md-6">
                    <input type="date" class="form-control" placeholder="Duration Start" v-model="project.duration_start">
                </div>
                <div class="col-md-6">
                    <input type="date" class="form-control" placeholder="Duration End" v-model="project.duration_end">
                </div>
                <br>
                <div class="col-md-6">
                    <input type="number" class="form-control" placeholder="Project Price" v-model="project.price">
                </div>
                <div class="col-md-6">
                    <select class="form-control" v-model="project.client">
                        <option selected value="none">Select Client</option>
                        <option v-for="client in clients" :value="client.id">{{ client.name }}</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <button class="btn btn-primary" @click="create_project">Add</button>
                </div>
                <div class="col-md-3">
                    <button class="btn btn-danger" @click="this.$router.go(-1)">Cancel</button>
                </div>
            </div>
        </div>
        <div class="col-md-2"></div>
    </div>
</template>


<style>
.project-create {
    color: #fff;
    margin-top: 5%;
}

.project-create .col-md-8 {
    background-color: #1a1a1a;
    border-radius: 4px;
    padding: 20px 20px 40px;
}

.project-create .form .btn {
    width: 100%;
    margin-top: 10px;
}

.project-create .form input,
.project-create .form select,
.project-create .form textarea {
    margin: 10px 0px 0px;
}

.project-create .form .special_multiple_select {
    margin-top: 10px;
    border-radius: 4px;
    padding: 0;
    background-color: #fff;
    color: #1a1a1a;
}

.project-create .form .special_multiple_select span {
    padding: 8px;
    font-size: 18px;
    display: block;
}

.project-create .form .special_multiple_select select {
    margin: 0;
}
</style>


<script>

import { defineComponent } from 'vue'

export default defineComponent({

    data() {
        return {
            employees: [{ 'id': 0, 'name': 'Ali2' }, { 'id': 1, 'name': 'Ali3' }],
            clients: [{ 'id': 0, 'name': 'Ali2' }, { 'id': 1, 'name': 'Ali3' }],
            project: {}
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
                        'name': employee['employee_username']
                    })
                }
            }).catch(e => { console.error(e) })
        },

        get_clients: async function () {
            this.clients = []
            await fetch(`${this.$api}/clients/`, {
                method: 'get',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${localStorage.getItem('token')}` }
            }).then(res => { return res.json() }).then(data => {
                for (let client of data) {
                    this.clients.push({
                        'id': client['id'],
                        'name': client['username']
                    })
                }
            }).catch(e => { console.error(e) })
        },

        create_project: async function() {
            await fetch(`${this.$api}/projects/`, {
                method:'post',
                headers:{'Content-Type':'application/json', 'Authorization':`Token ${localStorage.getItem('token')}`},
                body: JSON.stringify(this.project)
            }).then(res=>{return res.json()}).then(data=>{console.log(data); this.$router.push('/')}).catch(e=>{console.error(e)})
        },

    },

    beforeMount() {
        this.get_employees()
        this.get_clients()
    }

})


</script>

