<template>
    <div class="salary-invoice-create">

        <h1 class="text-light heading">Salary Invoice for: {{ `${employee.first_name}` }}</h1>

        <div class="row">
            <div class="form text-light col-md-8">
                <div class="row">
                    <div class="form-group col-md-5 card">
                        <label>Employee Data<br><span class="small">Sept 07 - Aug 07</span></label>
                        <br>
                        <div class="row">
                            <div class="col-4">
                                <span>Presents</span>
                                <br>
                                <span>{{ employee.presents }}</span>
                            </div>
                            <div class="col-4">
                                <span>Absents</span>
                                <br>
                                <span>{{ employee.absents }}</span>
                            </div>
                            <div class="col-4">
                                <span>Leaves</span>
                                <br>
                                <span>{{ employee.leaves }}</span>
                            </div>
                        </div>
                        <br>
                        <label>Employee Reward</label>
                        <input type="number" class="form-control" v-model="reward" @change="generate_invoice_salary()">
                    </div>
                    <div class="form-group col-md-5 card">
                        <label>Employee Current Salary</label>
                        <input type="number" class="form-control" v-model="basic_salary" disabled>
                        <br>
                        <label>Employee Generated Salary</label>
                        <input type="number" class="form-control" v-model="invoice_salary" disabled>
                        <br>
                        <label>Employee Deduction</label>
                        <input type="number" class="form-control" v-model="deduction" disabled>
                    </div>
                </div>
                <hr>
                <button class="btn btn-primary" @click="create_invoice()">Generate</button>
                &nbsp;
                <button class="btn btn-danger">Cancel</button>
            </div>
            <div class="col-md-3 text-light card previous">
                <h4>Employee Previous Invoices</h4>
                <ul>
                    <li v-for="invoice in invoices" :key="invoice">{{ `${invoice.date_created.split('T')[0].split('-')[1]}/${invoice.date_created.split('T')[0].split('-')[2]}` }} - {{ invoice.amount }} - <a href="#">view</a></li>
                </ul>
                <a class="special-btn" href="#">view all</a>
            </div>
        </div>

    </div>
</template>

<style>
.salary-invoice-create .heading {
    margin: 10px 0px;
}

.salary-invoice-create .card {
    background-color: #1a1a1a;
    padding: 25px 15px;
    margin: 10px 8px;
}

.salary-invoice-create .previous {
    position: relative;
}

.salary-invoice-create .previous .special-btn {
    position: absolute;
    bottom: 10px;
    right: 10px;
}
</style>

<script>

export default {

    name: 'SalaryInvoiceCreateView',

    data() {
        return {
            basic_salary: 25000,
            invoice_salary: 25000,
            deduction: 5000,
            reward: 0,
            employee: {
                id: 1,
                name: 'John Doe'
            },
            invoices: [],
            attendances: []
        }
    },

    methods: {
        generate_invoice_salary: function () {
            this.employee.presents = 0;
            this.employee.absents = 0;
            this.employee.leaves = 0;
            for(let i = 0; i < this.attendances.length; i++) {
                if(this.attendances[i].status === 'absent') {
                    this.employee.absents++;
                } else if(this.attendances[i].status === 'leave') {
                    this.employee.leaves++;
                } else if(this.attendances[i].status === 'present') {
                    this.employee.presents++;
                }
            }
            this.deduction = this.employee.absents * (this.basic_salary / 30);
            this.invoice_salary = this.employee.presents * (this.basic_salary / 30);
            this.invoice_salary = this.invoice_salary + this.reward - this.deduction;
            this.invoice_salary = Math.round(this.invoice_salary);
        },

        get_employee: async function () {
            await fetch(`${this.$api}/employees/${this.$route.params.id}/`, {
                method: 'get',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            }).then(res => {
                return res.json();
            }).then(data => {
                this.employee = data;
                this.basic_salary = Number(this.employee.salary);
                this.employee.presents = 0;
                this.employee.absents = 0;
                this.employee.leaves = 0;
                this.get_previous_invoices();
            }).catch(e => {
                console.error(e);
            })
        },

        get_previous_invoices: async function () {
            await fetch(`${this.$api}/salary_invoices/?person=${this.employee.id}`, {
                method: 'get',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            }).then(res => {
                return res.json();
            }).then(data => {
                this.invoices = data;
                this.get_attendaces();
            }).catch(e => {
                console.error(e);
            })
        },

        get_attendaces: async function() {
            let date = this.invoices[this.invoices.length-1].date_created.split('T')[0];
            await fetch(`${this.$api}/attendances/?date_created__gte=${date}&employee=${this.employee.id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            }).then(res => {
                return res.json();
            }).then(data => {
                this.attendances = data;
                this.generate_invoice_salary();
            }).catch(e => {
                console.error(e);
            });
        },

        create_invoice: async function() {
            let date = new Date();
            date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            await fetch(`${this.$api}/salary_invoices/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: this.invoice_salary,
                    person: this.employee.id,
                    status: 'paid',
                    previous_dues: 0,
                    title: 'Salary Invoice',
                    description: `Salary Invoice for ${this.employee.username} of 
                    ${this.invoice_salary} and date is ${date}`,
                })
            }).then(res => {
                return res.json();
            }).then(data => {
                this.$router.push(`/employee/invoice/read/${data.id}/`);
            }).catch(e => {
                console.error(e);
            });
        }

    },

    beforeMount() {
        this.get_employee();
    },

    created() {
        this.$watch(() => this.$route.params, () => { this.get_employee() })
    },

}

</script>