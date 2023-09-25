<template>
    <div class="employees">
        <h4>Employees <router-link to="/employee/create/">+ <span>Add Employee</span></router-link></h4>
        <hr>
        <div class="row">
            <div class="col-md-6">
                <table>
                    <tr>
                        <th><i>ID</i></th>
                        <th>Username</th>
                        <th>Designation</th>
                        <th>Action</th>
                    </tr>
                    <tr v-for="employee in employees" :key="employee.id">
                        <td>{{ employee.id }}</td>
                        <td @click="$router.push(`/employee/${employee.id}`)">{{ employee.username }}</td>
                        <td>{{ employee.designation }}</td>
                        <td>
                            <button class="btn btn-dark" @click="show_actions(employee.id)">:</button>
                            <div class="hidden-menu" hidden :id="employee.id">
                                <button class="btn btn-primary" @click="create_attendance(employee.id, 'present')">Present</button>
                                <button class="btn btn-danger" @click="create_attendance(employee.id, 'absent')">Absent</button>
                                <button class="btn btn-secondary" @click="create_attendance(employee.id, 'leave')">Leave (Paid)</button>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="col-md-6">
                <table>
                    <tr>
                        <th><i>ID</i></th>
                        <th>Employee</th>
                        <th>Date & Time</th>
                        <th>Status</th>
                    </tr>
                    <tr v-for="attendance in attendances" :key="attendance.id">
                        <td>{{ attendance.id }}</td>
                        <td>{{ attendance.employee }}</td>
                        <td>{{ attendance.date }}</td>
                        <td>{{ attendance.status }}</td>
                    </tr>
                </table>
                <div class="attendances">
                    <span class="btn btn-primary" @click="decrement_day">Next</span>
                    <span class="btn btn-primary" @click="increment_day">Previous</span>
                </div>
            </div>
        </div>
    </div>
</template>


<style>
.employees {
    color: #fff;
}


.employees table {
    width: 100%;
    padding: 15px;
    background-color: #1a1a1a;
    border-radius: 4px;
    text-align: center;
    /* position: relative; */
}

.employees table th {
    border-bottom: 2px solid #fff;
    padding: 10px;
}

.employees table td {
    border-top: 2px solid #c3c3c3;
    padding: 10px;
    position: relative;
}

.employees table td:hover {
    background-color: #242424;
}

.employees .hidden-menu {
    position: absolute;
    top: -100px;
    width: 340px !important;
    right: 0;
    display: flex;
    padding: 20px;
    background-color: #1a1a1a;
    border-radius: 4px;
}

.employees .hidden-menu .btn {
    margin: 3px;
}

.employees h4 a {
    font-size: 25px;
    float: right;
    text-decoration: none;
    background-color: var(--bs-primary);
    color: #fff;
    padding: 2px 10px 2px 10px;
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    width: 120px;
}

.employees h4 a span {
    font-size: 12px;
    position: absolute;
    left: 30px;
    top: 10px;
}

.employees .attendances {
    background-color: #1a1a1a;
    height: 55px;
    border-top: 2px solid #fff;
    padding-top: 10px;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
}

.employees .attendances span {
    padding: 5px 15px;
    float: right;
    margin-right: 10px;
    width: 100px;
}
</style>



<script>

import { defineComponent } from 'vue';

export default defineComponent({

    data() {
        return {
            employees: [
                { 'id': 0, 'username': 'name', 'designation': 'designation' },
                { 'id': 1, 'username': 'username', 'designation': 'designation' }
            ],
            attendances: [],
            day: 0
        }
    },

    methods: {
        show_actions: function (ev) {
            if (document.getElementById(ev).hidden) {
                document.getElementById(ev).hidden = false;
            } else {
                document.getElementById(ev).hidden = true;
            }
        },

        increment_day: function() {
            this.day++;
            this.get_attendances(this.day)
        },

        decrement_day: function() {
            this.day--;
            this.get_attendances(this.day)
        },

        get_employees: async function () {
            this.employees = [];
            await fetch(`${this.$api}/employees/`, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            }).then(res => { return res.json() }).then(
                data => {
                    this.employees = data;
                })
        },

        get_attendances: async function (day) {
            this.attendances = []
            let token = localStorage.getItem('token')
            let today = new Date();
            let today_date = `${String(today.getFullYear())}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(Number(today.getDate()) - day).padStart(2, '0')}`
            let url = `${this.$api}/attendances/?date_created__gte=${today_date} ${today.getUTCHours()}:${today.getMinutes()}:${today.getSeconds()}`;
            await fetch(url, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            }).then(res => { return res.json() }).then(
                data => {
                    for (let dt of data) {
                        let date = dt['date_created'].slice(0, 10);
                        let time = dt['date_created'].slice(11, 16);
                        this.attendances.push({
                            "id": dt['id'],
                            "status": dt['status'],
                            "employee": dt['username'],
                            "date": `${date} ${time}`
                        })
                    }
                })
        },

        create_attendance: async function (employee, status) {
            await fetch(`${this.$api}/attendances/`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    "status": status,
                    "id": employee,
                })
            }).then(res=>{return res.json()}).catch(e=>{throw new Error(e)})
            this.get_attendances();
        }

    },

    beforeMount() {
        this.get_employees()
        this.get_attendances(this.day)
    }

})

</script>
