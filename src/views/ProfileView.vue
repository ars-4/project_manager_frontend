<template>
    <div class="profile">
        <h1 class="text-light">Profile: {{ user.username.slice(0, 1).toUpperCase() }}{{ user.username.slice(1) }}</h1>

        <div class="personal">
            <div class="row">
                <div class="col-md-7 information">
                    <input type="text" class="form-control" placeholder="Username" v-model="user.username">
                    <input type="text" class="form-control" placeholder="Email" v-model="user.email">
                    <br>
                    <input type="text" class="form-control" placeholder="First Name" v-model="user.first_name">
                    <input type="text" class="form-control" placeholder="Last Name" v-model="user.last_name">
                    <br>
                    <input type="text" class="form-control" placeholder="Address" v-model="user.address">
                    <input type="text" class="form-control" placeholder="City" v-model="user.city">
                    <br>
                    <input type="text" class="form-control" placeholder="Designation" v-model="user.designation">
                    <input type="text" class="form-control" placeholder="Salary" v-model="user.salary">
                    <br>
                    <button class="btn btn-primary" @click="update_user">Update</button>
                    <button class="btn btn-danger" @click="reload">Delete</button>&nbsp;&nbsp;
                    <a v-if="username == 'admin'" @click="$router.push(`/employee/invoice/create/${user.id}`)" class="btn btn-success">+ Invoice</a>
                    <button class="btn btn-primary" @click="reload">Last Invoice</button>
                </div>
                <div class="col-md-1"></div>
                <div class="col-md-4 image">
                    <img :src="user.profile_picture" alt="profile">
                </div>
            </div>
        </div>

        <div class="company">
            <div class="row">
                <div class="col-md-5 tasks">
                    <table>
                        <tr>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Title</th>
                        </tr>
                        <tr v-for="task in tasks_d">
                            <td>{{ task.date_created }}</td>
                            <td>{{task.status}}</td>
                            <td>{{ task.title }}</td>
                        </tr>
                    </table>
                </div>
                <div class="col-md-3 attendances">
                    <table>
                        <tr>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                        <tr v-for="attendance in attendances" :key="attendance">
                            <td>{{ attendance.date_created }}</td>
                            <td>{{ attendance.status }}</td>
                        </tr>
                    </table>
                </div>
                <div class="col-md-3 perfomance">
                    <h3>Perfomance</h3>
                    <span class="duration">{{ one_month_date }} &nbsp; - &nbsp; {{ today_date }}</span>
                    <br>
                    <div class="row">
                        <div class="col-4">
                            <span>Presents</span>
                            <span>{{ presents }}</span>
                        </div>
                        <div class="col-4">
                            <span>Absents</span>
                            <span>{{ absents }}</span>
                        </div>
                        <div class="col-4">
                            <span>Leave</span>
                            <span>{{ leaves }}</span>
                        </div>
                        <div class="col-4">
                            <span>Tasks</span>
                            <span>{{ tasks }}</span>
                        </div>
                        <div class="col-4">
                            <span>Projects</span>
                            <span>{{ projects }}</span>
                        </div>
                        <div class="col-4">
                            <span>Score</span>
                            <span>{{ score }}%</span>
                        </div>
                    </div>
                    <hr>
                    <div class="salary-count">
                        <span>Current Salary</span>
                        <span>{{ salary }} /-</span>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>



<style>
.personal {
    margin-left: 1%;
}

.personal .information,
.personal .image {
    background-color: #1a1a1a;
    border-radius: 4px;
    padding: 20px;
}

.personal .information input {
    display: inline-block;
    width: 45%;
    margin: 12px;
}

.personal .information .btn {
    margin-left: 12px;
    width: 21.5%;
}

.personal .image img {
    width: 100%;
    aspect-ratio: 1/1;
}
</style>
<style>
.company .attendances,
.company .tasks,
.company .perfomance {
    background-color: #1a1a1a;
    border-radius: 4px;
    padding: 16px 20px;
    margin: 16px 8px;
}

.company .tasks {
    width: 45%;
}

.company table {
    width: 100%;
    color: #fff;
}

.company .attendances {
    width: 25%;
}

.company .perfomance {
    width: 25%;
    color: #fff;
}

.company .perfomance .duration {
    text-align: center;
    font-size: 10px;
}

.company .perfomance .row .col-4 {
    margin-top: 5px;
}

.company .perfomance .row .col-4 span {
    display: block;
    text-align: center;
}

.company .perfomance .row .col-4 span:nth-child(1) {
    font-size: 12px;
}
.company .perfomance .salary-count span {
    text-align: center;
    font-size: 12px;
    display: block;
}
</style>



<script>

import { defineComponent } from 'vue';

export default defineComponent({

    data() {
        return {
            user: {
                username: 'snake'
            },
            tasks_d: {},
            attendances: [],
            presents: 0,
            absents: 0,
            leaves: 0,
            tasks: 0,
            projects: 0,
            score: 0,
            salary: 0,
            today_date: null,
            one_month_date: null
        }
    },

    methods: {
        get_user: async function () {
            let token = localStorage.getItem('token');
            await fetch(`${this.$api}/get_profile/`, {
                method:'get',
                headers: {'Authorization': `Token ${token}`}
            }).then( res=>{return res.json()} ).then(data=>{
                this.user = data;
                this.user.profile_picture = this.$baseUri + data['profile_picture'];
            }).catch(e=>{throw new Error(e)});
            this.get_attendances()
        },

        update_user: async function() {
            let token = localStorage.getItem('token');
            await fetch(`${this.$api}/update_profile/`, {
                method:'post',
                headers: {'Authorization': `Token ${token}`, 'Content-Type':'application/json'},
                body: JSON.stringify(this.user)
            }).then( res=>{ console.log(res.json()) } ).then( this.$router.go() ).catch(e=>{throw new Error(e)})
        },

        get_attendances: async function() {
            this.attendances = []
            await this.get_last_invoice()
            this.get_tasks()
            let today = new Date();
            this.today_date = `${String(today.getFullYear())}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')} ${String(today.getHours()).padStart(2, '0')}:${today.getMinutes()}:${today.getSeconds()}`
            await fetch(`${this.$api}/attendances/?employee=${this.user.id}&date_created__gte=${this.one_month_date}&date_created__lte=${this.today_date}`, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            }).then(res=>{
                return res.json()
            }).then(data=>{
                for(let attendance of data) {
                    switch (attendance['status']) {
                        case 'present':
                            this.presents++;
                            break;
                        case 'absent':
                            this.absents++;
                            break;
                        case 'leave':
                            this.leaves++;
                            break;
                        default:
                            break;
                    }
                    let date = attendance['date_created'].slice(0,10);
                    let time = attendance['date_created'].slice(11,16);
                    this.attendances.push({
                        date_created : date + ' ' + time,
                        status :attendance['status']
                    })
                }
                let day_salary = this.user.salary / 30;
                let days_worked = 30 - this.absents;
                this.salary = (day_salary * days_worked).toFixed(0);
            })
        },

        get_last_invoice: async function() {
            await fetch(`${this.$api}/salary_invoices/`, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            }).then(res=>{return res.json()}).then(data=>{
                this.one_month_date = data[0]['date_created'].slice(0, 19).replace('T', ' ')
            }).catch(e=>{console.error(e)})
        },

        get_tasks: async function () {
            this.tasks_d = []
            this.tasks = 0
            await fetch(`${this.$api}/tasks/?assigned_to=${this.user.id}`, {
                method: 'get',
                headers: { 'Authorization': `Token ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' }
            }).then(res => { return res.json() }).then(data => {
                for (let dt of data) {
                    this.tasks++;
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
                    this.tasks_d.push(task)
                }
            }).catch(e => { throw new Error(e) })
        },

        reload: function() {
            this.$router.go()
        }
    },

    beforeMount() {
        this.get_user()
    }

})

</script>