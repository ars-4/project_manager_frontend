<template>
    <div class="salary-invoice-read">


        <h1 class="text-light heading">Salary Invoice</h1>

        <div class="invoice_form">
            <h3>{{ employee.employee_username }}</h3>
            <hr>
            <div class="invoice_form_details">
                <span>Amount Paid - {{ invoice.amount }}</span>
                <span>Amount Dues (if any) - {{ invoice.previous_dues }}</span>
            </div>
            <hr>
            <div class="footer">
                <span>Date Created - {{ invoice.date_created.split('T')[0] }}</span>
                <span>Status - {{ invoice.status }}</span>
            </div>
        </div>

        <button class="btn btn-primary" @click="print()">Print</button>

    </div>
</template>

<style>
.salary-invoice-read .invoice_form {
    margin: 20px 10%;
    background-color: #1a1a1a;
    color: #fff;
    border-radius: 4px;
    padding: 20px 25px;
}

.salary-invoice-read .invoice_form .invoice_form_details {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.salary-invoice-read .invoice_form .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.salary-invoice-read .btn-primary {
    margin: 0px 10%;
    color: #fff;
    border-radius: 4px;
    padding: 10px 25px;
}

@media print {

    .salary-invoice-read .btn-primary,
    .salary-invoice-read .heading,
    nav,
    .side-nav {
        display: none !important;
    }

    .main-view {
        margin: 0px !important;
    }

    .salary-invoice-read .invoice_form {
        display: block !important;
        color: #000 !important;
    }

    @page {
        size: auto;
        margin: 0;
    }
}
</style>

<script>

export default {
    name: "SalaryInvoiceReadView",
    data() {
        return {
            invoice: {
                amount: 0,
                previous_dues: 0,
                date_created: '',
                status: ''
            },
            employee: {
                id: 1,
                name: 'John Doe'
            }
        }
    },
    methods: {
        print() {
            window.print();
        },

        getInvoice: async function () {
            await fetch(`${this.$api}/salary_invoices/${this.$route.params.id}`, {
                method: 'get',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    return response.json();
                }).then(data => {
                    this.invoice = data;
                    this.employee.id = this.invoice.person;
                    this.get_employee();
                })
                .catch(error => {
                    console.log(error);
                });
        },

        get_employee: async function () {
            await fetch(`${this.$api}/employees/${this.employee.id}`, {
                method: 'get',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    return response.json();
                }).then(data => {
                    this.employee = data;
                })
                .catch(error => {
                    console.log(error);
                });
        }

    },

    beforeMount() {
        this.getInvoice();
    },

    created() {
        this.$watch(() => this.$route.params, () => { this.getInvoice() })
    },

}

</script>