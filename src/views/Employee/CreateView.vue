<template>
    <div class="row employee-create">
        <div class="col-md-2"></div>
        <div class="col-md-8">
            <h2>Register <br>
                <h5>a new Employee</h5>
            </h2>
            <div class="form row">
                <div class="col-md-5">
                    <input type="text" class="form-control" placeholder="Choose a username" v-model="employee.user">
                </div>
                <div class="col-md-7">
                    <input type="file" class="form-control" @change="handleFileUpload($event)">
                </div>
                <br>
                <div class="col-md-6">
                    <input type="text" class="form-control" placeholder="First Name" v-model="employee.first_name">
                </div>
                <div class="col-md-6">
                    <input type="text" class="form-control" placeholder="Last Name" v-model="employee.last_name">
                </div>
                <br>
                <div class="col-md-6">
                    <input type="text" class="form-control" placeholder="Email" v-model="employee.email">
                </div>
                <div class="col-md-6">
                    <input type="text" class="form-control" placeholder="Mobile" v-model="employee.mobile">
                </div>
                <br>
                <div class="col-md-6">
                    <input type="text" class="form-control" placeholder="Address" v-model="employee.address">
                </div>
                <div class="col-md-6">
                    <input type="text" class="form-control" placeholder="City" v-model="employee.city">
                </div>
                <br>
                <div class="col-md-6">
                    <input type="number" class="form-control" placeholder="Salary" v-model="employee.salary">
                </div>
                <div class="col-md-6">
                    <input type="text" class="form-control" placeholder="Designation" v-model="employee.designation">
                </div>
                <div class="col-md-3">
                    <button class="btn btn-primary" @click="create_employee">Add</button>
                </div>
                <div class="col-md-3">
                    <button class="btn btn-danger" @click="$router.go(-1)">Cancel</button>
                </div>
            </div>
        </div>
        <div class="col-md-2"></div>
    </div>
</template>


<style>
.employee-create {
    color: #fff;
    margin-top: 5%;
}

.employee-create .col-md-8 {
    background-color: #1a1a1a;
    border-radius: 4px;
    padding: 20px 20px 40px;
}

.employee-create .form .btn {
    width: 100%;
    margin-top: 10px;
}

.employee-create .form input,
.employee-create .form select,
.employee-create .form textarea {
    margin: 10px 0px 0px;
}
</style>



<script>

import { defineComponent } from 'vue';

export default defineComponent({

    data() {
        return {
            employee: {
                user: '',
                first_name: '',
                last_name: '',
                pass: 'Qwerty@234',
                email: '',
                mobile: '',
                address: '',
                city: 'Lahore',
                salar: '',
                designation: ''
            },
            profile_picture: 'null'
        }
    },

    methods: {
        handleFileUpload: function (e) {
            this.profile_picture = e.target.files[0];
        },
        create_employee: function () {
            let formData = new FormData();
            formData.append('employee', JSON.stringify(this.employee))
            formData.append('picture', this.profile_picture)
            fetch(`${this.$api}/employees/`, {
                method: 'post',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                },
                body: formData
            }).then(res => res.json()).then(data => { console.log(data); this.$router.go(-1) }).catch(e => { throw new Error(e) })
        }
    }

})

</script>