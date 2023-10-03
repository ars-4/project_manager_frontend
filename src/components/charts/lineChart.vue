<template>
    <Line :data="chartData" :options="chartOptions" />
</template>
  
<script lang="ts">
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

export default {
    name: 'App',
    components: {
        Line
    },
    data() {
        return {
            chartData: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'Spetember', 'October', 'November', 'December'],
                datasets: [
                    {
                        label: 'Clients',
                        backgroundColor: '#f44336',
                        data: [40, 39, 10, 80, 39, 200, 40],
                        borderColor: '#f44336'
                    },
                    {
                        label: 'Projects',
                        backgroundColor: '#42b983',
                        data: [30, 49, 5, 20, 49, 60, 10],
                        borderColor: '#42b983'
                    }
                ]
            },
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false,
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
  