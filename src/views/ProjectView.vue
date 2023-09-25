<template>
    <div class="project text-light">
        <div class="heading">
            <h1>Project: {{ project.title.slice(0, 1).toUpperCase() }}{{ project.title.slice(1) }}</h1>
            <div class="group">
                <span class="btn btn-primary" @click="this.$router.push(`/project/invoice/create/${project.id}`)">+ <span>Invoice</span></span>
                &nbsp;
                <span class="btn btn-primary" @click="this.$router.push(`/task/create/${project.id}`)">+ <span>Task</span></span>
            </div>
        </div>
        <hr>
        <!-- <h4>The Information:</h4> -->
        <div class="project_info">
            <span>Project Duration: {{ project.duration_left }} / {{ project.duration }}</span>
            <span>Project Dues: {{ project.amount_left.toFixed(0) }} / {{ project.amount }}</span>
            <span>Project Totals: </span>
        </div>
        <hr>
        <div class="row">
            <div class="col-md-4">
                <div class="members">
                    <h3>Members</h3>
                    <hr>
                    <div v-for="employee in project.employees" :key="employee.id">
                        <span>{{ employee.name.slice(0, 1).toUpperCase() }}{{ employee.name.slice(1, 2).toUpperCase() }}</span>
                        <span>{{ employee.name }}</span>
                    </div>
                </div>
            </div>
            <div class="col-md-4" @dragenter="change_status('1')">
                <div class="open-tasks">
                    <h3>Open Tasks</h3>
                    <hr>
                    <div v-for="task in project.open_tasks" :key="task" draggable="true" @dragend="update_task(task.id)">
                        <span @click="read_task_details(task)">{{ task.title }}</span>
                        <span>Members: <i v-for="assigne in task.assignees" :key="assigne">{{ assigne.name }}, </i></span>
                        <div class="row date">
                            <div class="col-5">
                                <span>date_created: {{ task.date_created }}</span>
                            </div>
                            <div class="col-1"></div>
                            <div class="col-5">
                                <span>date_updated: {{ task.date_updated }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4" @dragenter="change_status('0')">
                <div class="close-tasks">
                    <h3>Closed Tasks</h3>
                    <hr>
                    <div v-for="task in project.close_tasks" :key="task" draggable="true" @dragend="update_task(task.id)">
                        <span @click="read_task_details(task)">{{ task.title }}</span>
                        <span>Members: <i v-for="assigne in task.assignees" :key="assigne">{{ assigne.name }}, </i></span>
                        <div class="row date">
                            <div class="col-5">
                                <span>date_created: {{ task.date_created }}</span>
                            </div>
                            <div class="col-1"></div>
                            <div class="col-5">
                                <span>date_updated: {{ task.date_updated }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="task-read-modal" id="task_read_modal">
            <div class="task-read-modal-content">
                <a class="close-btn" @click="read_task_details(task_read)">&times;</a>
                <br>
                <br>
                <h4>{{ task_read.title }}</h4>
                <hr>
                <p>{{ task_read.description }}</p>
            </div>
        </div>

    </div>
</template>



<style>
.project .heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.project .heading span {
    cursor: pointer;
}

.project .heading span span {
    font-size: 14px;
    margin-top: 1px;
}

.project .project_info {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    width: 50%;
}

.project .members,
.project .open-tasks,
.project .close-tasks {
    background-color: #1a1a1a;
    border-radius: 4px;
    padding: 20px;
}

.project .members div {
    margin-bottom: 10px;
}

.project .members div span {
    margin: 0px 5px;
}

.project .members div span:nth-child(1) {
    background: linear-gradient(to bottom right, green, lightgreen);
    padding: 5px 5px;
    margin: 3px;
    aspect-ratio: 1 / 1;
    border-radius: 4px;
    color: #242424;
    font-weight: bold;
}

.project .open-tasks div,
.project .close-tasks div {
    background-color: #242424;
    padding: 15px;
    margin: 5px 0px;
    border-radius: 4px;
}

.project .open-tasks div span:nth-child(1),
.project .close-tasks div span:nth-child(1) {
    font-weight: bold;
    text-decoration: underline;
    text-underline-offset: 4px;
    font-size: 18px;
}

.project .open-tasks div span:nth-child(2),
.project .close-tasks div span:nth-child(2) {
    font-size: 12px;
}

.project .open-tasks div span:nth-child(3),
.project .close-tasks div span:nth-child(3) {
    font-size: 10px;
}

.project .open-tasks .date,
.project .close-tasks .date {
    padding: 0px;
    margin: 0px;
}

.project .open-tasks .date .col-5 span,
.project .close-tasks .date .col-5 span {
    font-size: 10px;
    text-decoration: none;
    font-weight: normal;
    padding: 0px;
    margin: 0px;
}

.project .open-tasks span,
.project .close-tasks span {
    display: block;
}

.task-read-modal {
    padding: 20px;
    background-color: rgba(24, 24, 24, 0.6);
    border-radius: 4px;
    text-align: center;
    position: absolute;
    top: -20%;
    transition: 0.5s;
    left: 40%;
    width: 30%;
    backdrop-filter: blur(5px);
}

.task-read-modal .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    text-decoration: none;
    cursor: pointer;
    color: #fff;
    font-weight: bold;
    font-size: 20px;
}
</style>



<script>

import { defineComponent } from 'vue';

export default defineComponent({
    data() {
        return {
            project: {
                title: 'Snake'
            },
            task: 'closed',
            task_read: {}
        }
    },

    methods: {

        say: function (m) {
            console.log(m)
            console.log(this.task)
        },

        change_status: function (i) {
            if (i === '0') {
                this.task = 'closed'
            } else {
                this.task = 'opened'
            }
        },

        get_project: async function () {
            await fetch(`${this.$api}/projects/${this.$route.query.pro}`, {
                method: 'get',
                headers: { 'Authorization': `Token ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' }
            }).then(res => { return res.json() }).then(data => {
                this.project.id = data['id']
                this.project.title = data['title']
                this.project.duration_start = data['duration_start']
                let tdo = new Date();
                let tdo_t = `${tdo.getFullYear()}-${String(tdo.getMonth() + 1).padStart(2, '0')}-${String(tdo.getDate()).padStart(2, '0')}`
                this.project.duration_left = this.get_duration(`${tdo_t}`, data['duration_end'])
                this.project.duration_end = data['duration_end']
                this.project.duration = this.get_duration(data['duration_start'], data['duration_end'])
                this.project.amount = data['amount']
                this.project.amount_left = (data['amount'] / this.project.duration) * this.project.duration_left
                this.project.employees = []
                for (let i = 0; i < data['employees'].length; i++) {
                    this.project.employees.push({
                        id: data['employees'][i],
                        name: data['employees_username'][i]
                    })
                }
                console.log(this.project.employees)
            }).then(() => { this.get_tasks(); }).catch(e => { throw new Error(e) })
        },

        get_duration: function (start, end) {
            let d_ = start.split('-')
            let e_ = end.split('-')
            let yrs = (Number(e_[0]) - Number(d_[0])) * 365
            let mnths = (Number(e_[1]) - Number(d_[1])) * 30
            let dys = Number(e_[2]) - Number(d_[2])
            let res = dys + mnths + yrs;
            return res
        },

        get_tasks: async function () {
            this.project.open_tasks = []
            this.project.close_tasks = []
            await fetch(`${this.$api}/tasks/?project=${this.$route.query.pro}`, {
                method: 'get',
                headers: { 'Authorization': `Token ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' }
            }).then(res => { return res.json() }).then(data => {
                for (let dt of data) {
                    let task = {
                        id: dt['id'],
                        title: dt['title'],
                        assignees: [],
                        status: dt['status'],
                        description: dt['description'],
                        date_created: dt['date_created'].slice(0, 19).replace('T', ' '),
                        date_updated: dt['date_updated'].slice(0, 19).replace('T', ' ')
                    }
                    for (let i = 0; i < dt['assigned_to'].length; i++) {
                        task.assignees.push({
                            id: dt['assigned_to'][i],
                            name: dt['assignees'][i]
                        })
                    }
                    if (task.status === 'pending') {
                        this.project.open_tasks.push(task)
                    } else {
                        this.project.close_tasks.push(task)
                    }
                }
            }).catch(e => { throw new Error(e) })
        },

        update_task: async function (_id) {
            if (this.task === 'closed') {
                await fetch(`${this.$api}/update_task/${_id}/`, {
                    method: 'post',
                    headers: { 'Authorization': `Token ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'status': 'completed' })
                }).then(res => { return res.json() }).then(() => { this.get_tasks() }).catch(e => { console.error(e); })
            } else {
                await fetch(`${this.$api}/update_task/${_id}/`, {
                    method: 'post',
                    headers: { 'Authorization': `Token ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'status': 'pending' })
                }).then(res => { console.log(res.json()) }).then(() => { this.get_tasks() }).catch(e => { console.error(e); })
            }
        },

        read_task_details: function (task) {
            let modal = document.getElementById('task_read_modal');
            // console.log(modal.style.top)
            this.task_read.title = task.title;
            this.task_read.description = task.description;
            if (modal.style.top === "-100%" || modal.style.top !== "30%") {
                modal.style.top = "30%"
            } else {
                modal.style.top = "-100%"
            }
        }

    },

    created() {
        this.$watch(() => this.$route.query, (toQuery, previousQuery) => { this.get_project() })
    },

    beforeMount() {
        // this.project.title = 'Snake'
        this.get_project()
    }

})

</script>
