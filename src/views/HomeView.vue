<template>
    <h1 class="text-light">Dashboard</h1>
    <div class="row">
        <div class="col-md-12">
            <lineChart />
        </div>
    </div>

    <br><br><br>

    <div class="row">
        <div class="col-md-4">
            <pieChart />
        </div>

        <div class="col-md-8">
            <barChart />
        </div>
    </div>
</template>

<script>

import barChart from '@/components/charts/barChart.vue';
import pieChart from '@/components/charts/pieChart.vue';
import lineChart from '@/components/charts/lineChart.vue';

export default {
    name: 'Dashboard',
    components: {
        barChart,
        pieChart,
        lineChart
    }
}

</script>
