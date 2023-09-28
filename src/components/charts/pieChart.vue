<template>
    <Pie :data="chart_data" :options="chart_options" />
</template>
    
<script>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

export default {
    name: 'PieChart',
    components: {
        Pie
    },
    data() {
        return {
            chart_data: {
                labels: ['Present', 'Absent', 'Leave', 'Total'],
                datasets: [
                    {
                        label: 'Employees',
                        backgroundColor: ['#42b983', '#f44336', '#bcbcbc', 'indigo'],
                        data: [25, 10, 5, 40]
                    }
                ]
            },
            chart_options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#fff'
                        }
                    },
                }
            }
        }
    }
}

</script>