<template>
    
    <div class="project_invoice_create">
        <h1 class="text-light">Create Invoice<br>for <span style="cursor:pointer"><u>{{ project.title }}</u></span></h1>
        <br>
        <div class="invoice_form">
            <div class="row">
                <div class="col-md-5 text-light">
                    <span class="small">Project Total: {{ project.amount }}<br>
                    Remaining: {{ project.remaining_amount }}</span>
                    <hr>
                    <div class="form-group">
                        <label class="text-light">Enter Amount</label>
                        <input type="number" class="form-control" v-model="invoice.amount">
                    </div>
                    <br>
                    <button class="btn btn-primary" @click="create_invoice()">Generate</button>
                    &nbsp;
                    <a href="#" class="btn btn-danger">Cancel</a>
                </div>
                <div class="col-md-1"></div>
                <div class="col-md-5 text-light">
                    <h3>List of invoices</h3>
                    <ul v-if="invoices.length > 0">
                        <li v-for="invoice in invoices" :key="invoice.id">{{ invoice.date_created.split('T')[0] }} - {{ invoice.amount }} - <a href="#">view</a></li>
                    </ul>
                    <span v-else><i>~ No Invoice ~</i></span>
                    <a href="#" class="special-btn">view all →</a>
                </div>
            </div>
        </div>
    </div>

</template>

<style>

.project_invoice_create .col-md-5 {
    background-color: #1a1a1a;
    padding: 20px 25px;
    border-radius: 4px;
    position: relative;
}
.project_invoice_create .special-btn {
    float: right !important;
}
</style>

<script>

export default {

    data(){
        return{
            invoice: {
                amount: 0
            },
            invoices: [],
            project: {
                id: 1,
                title: 'Snake',
                amount: 5000,
                remaining_amount: 5000
            }
        }
    },
    methods: {
        get_project_invoices: async function (){
            await fetch(`${this.$api}/project_invoices/?project=${this.project.id}`, {
                method: 'get',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            }).then(res => {
                return res.json()
            }).then(data => {
                this.invoices = data;
                let invoices_amount = 0;
                for (let i = 0; i < this.invoices.length; i++){
                    invoices_amount += Number(this.invoices[i].amount);
                }
                this.project.remaining_amount = this.project.amount - invoices_amount;
            }).catch(e => {
                console.error(e);
            })
        },

        get_project: async function (){
            await fetch(`${this.$api}/projects/${this.$route.params.id}`, {
                method: 'get',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            }).then(res => {
                return res.json()
            }).then(data => {
                this.project = data;
                this.get_project_invoices();
            }).catch(e => {
                console.error(e);
            })
        },

        create_invoice: async function() {
            await fetch(`${this.$api}/project_invoices/`, {
                method: 'post',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: this.invoice.amount,
                    project: this.project.id,
                    title: `Invoice for ${this.project.title}`,
                    status: 'paid',
                    description: `Invoice for ${this.project.title}
                    - Amount: ${this.invoice.amount} - Created: ${new Date().toISOString().split('T')[0]}`
                })
            }).then(res => {
                return res.json()
            }).then(data => {
                this.$router.push(`/project/invoice/read/${data.id}`);
            }).catch(e => {
                console.error(e);
            })
        }

    },

    beforeMount(){
        this.get_project();
    },

    created() {
        this.$watch(() => this.$route.params, () => { this.get_project() })
    },

}

</script>