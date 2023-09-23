<template>
    
    <div class="project_invoice_read text-light">
        <h1>Project Invoice</h1>
        <div class="invoice_form">
            <div class="header">
                <h3>{{ project.title }}</h3>
                <span class="small">Invoice #{{ invoice.id }}</span>
            </div>
            <hr>
            <div class="body">
                <span>Amount Paid - {{ invoice.amount }}</span>
                <span>Amount Due - {{ project.remaining_amount }}</span>
                <span>Total Amount - {{ project.amount }}</span>
            </div>
            <hr>
            <div class="footer">
                <span>Created Date: {{ invoice.date_created.split('T')[0] }}</span>
                <span>Status: {{ invoice.status }}</span>
            </div>
        </div>
        <button class="btn btn-primary" @click="print()">Print</button>
    </div>

</template>


<style>

.project_invoice_read .invoice_form {
    margin: 20px 10%;
    background-color: #1a1a1a;
    color: #fff;
    padding: 20px 25px;
    border-radius: 4px;
}
.project_invoice_read .invoice_form .header,
.project_invoice_read .invoice_form .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.project_invoice_read .invoice_form .body {
    margin: 5% 0px;
}
.project_invoice_read .invoice_form .body span {
    display: block;
    margin: 15px 20px;
}
.project_invoice_read .invoice_form .footer {
    font-size: 12px;
}
.project_invoice_read .btn-primary {
    margin: 0px 10%;
}
</style>

<script>
export default {
    name: 'InvoiceRead',
    data() {
        return {
            invoice: {
                amount: 0,
                status: '',
                id: 1,
                date_created: ''
            },
            project: {
                id: 1,
                title: '',
                amount: 0,
                remaining_amount: 0
            },
            invoices: []
        }
    },
    methods: {
        print: function () {
            window.print()
        },
        get_invoice: async function() {
            await fetch(`${this.$api}/project_invoices/${this.$route.params.id}`, {
                method: 'get',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            }).then(res => {
                return res.json()
            }).then(data => {
                this.invoice = data;
                this.get_project();
            }).catch(e => {
                console.error(e)
            })
        },

        get_project: async function() {
            await fetch(`${this.$api}/projects/${this.project.id}`, {
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
                console.error(e)
            })
        },

        get_project_invoices: async function() {
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
                console.error(e)
            })
        }
    },

    beforeMount() {
        this.get_invoice()
    },
    created() {
        this.$watch(() => this.$route.params, () => {
            this.get_invoice()
        })
    }
    
}
</script>