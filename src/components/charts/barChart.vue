<template>
    <Bar v-if="loaded" :options="chartOptions" :data="chartData" />
</template>

<script>

import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
    name: 'BarChart',
    components: { Bar },
    data() {
        return {
            loaded: true,
            chartData: {
                labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                datasets: [
                    { data: [40, 20, 12], backgroundColor: '#f44336', label: 'Total' },
                    { data: [20, 30, 6], backgroundColor: '#42b983', label: 'Completed' },
                    { data: [20, 30, 6], backgroundColor: '#42b983', label: 'Pending' },
                ],
            },
            chartOptions: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: '#fff'
                        }
                    },
                },
                scales: {
                    x: {
                        ticks: {
                            color: 'white'
                        }
                    },
                    y: {
                        ticks: {
                            color: 'white',
                        }
                    }
                }

            }
        }
    }


}

</script>