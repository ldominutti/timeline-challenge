<template>
  <div class="timeline-container">
    <div class="timeline-header">
      <div class="timeline-title">Agenda de Reservas</div>
      <ReservationLegend :items="legendItems"></ReservationLegend>
    </div>

    <div class="timeline-wrapper">
      <div ref="timelineContainer">
        <div 
          class="navigation-arrow" 
          :class="direction"
          v-for="direction in ['left', 'right']"
          :key="direction"
          @click="handleMove(direction)"
        >
          <i class="material-icons">chevron_{{ direction === 'left' ? 'left' : 'right' }}</i>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import ReservationLegend from './ReservationLegend.vue';

export default {
  name: 'ReservationTimeline',
  components: { ReservationLegend },
  props: {
    reservations: {
      type: Array,
      required: true
    },
    currentDate: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      timeline: null,
      timelineItems: null,
      legendItems: [
        { class: 'available', label: 'Disponible' },
        { class: 'reserved', label: 'Reservado' },
        { class: 'my-reservation', label: 'Mi Reserva Actual' }
      ],
      isDragging: false,
      dragStartX: 0,
      scrollLeft: 0
    };
  },
  watch: {
    reservations: {
      handler: 'updateTimeline',
      deep: true
    },
    currentDate: 'moveToDate'
  },
  mounted() {
    this.initializeTimeline();
  },
  beforeDestroy() {
    this.cleanupTimeline();
  },
  methods: {
    initializeTimeline() {
      this.timelineItems = new window.vis.DataSet(this.processReservations());
      this.timeline = new window.vis.Timeline(
        this.$refs.timelineContainer,
        this.timelineItems,
        {
          orientation: { axis: "top", item: "top" },
          zoomMax: 87600900, // Approximately 1 day view
          zoomMin: 10000000,  // Approximately 2.7 hours view
          height: 120
        }
      );
      this.timeline.on('rangechanged', this.handleRangeChange);
    },
    processReservations() {
      return this.reservations.map(res => ({
        id: res.id,
        start: res.start,
        end: res.end,
        style: res.createdBy === 1234 // Assuming 1234 is the current user ID
          ? 'background-color: #91feb5; color: #374151;'
          : 'background-color: #fff48c; color: #374151;'
      }));
    },
    updateTimeline() {
      this.timelineItems?.clear();
      this.timelineItems?.add(this.processReservations());
    },
    cleanupTimeline() {
      if (!this.timeline) return;
      this.timeline.off('rangechanged', this.handleRangeChange);
      this.timeline.destroy();
    },
    handleRangeChange(event) {
      this.$emit('date-change', window.moment(event.start).format('YYYY-MM-DD'));
    },
    move(percentage) {
      if (!this.timeline) return;
      
      const { start, end } = this.timeline.getWindow();
      const interval = end - start;
      
      this.timeline.setWindow({
        start: start.valueOf() - interval * percentage,
        end: end.valueOf() - interval * percentage
      });
    },
    moveToDate(date) {
      this.timeline?.setWindow(
        window.moment(date).startOf('day').toDate(),
        window.moment(date).endOf('day').toDate(),
        { animation: true }
      );
    },
    handleMove(direction) {
      this.move(direction === 'left' ? 0.2 : -0.2);
    }
  }
};
</script>

<style scoped>
.timeline-container {
  margin: 30px auto 0;
  width: 100%;
  max-width: 1000px;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0 15px;
}

.timeline-title {
  color: #727272;
  font-size: 1.2rem;
}

.timeline-wrapper {
  position: relative;
  width: 100%;
}

.navigation-arrow {
  position: absolute;
  top: 0;
  height: 100%;
  width: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s ease;
  box-shadow: 
    4px 0px 2px -2px rgba(0, 0, 0, 0.1),
    -4px 0px 2px -2px rgba(0, 0, 0, 0.1),
    0px 2px 1px -2px rgba(0, 0, 0, 0.1),
    0px -2px 1px -2px rgba(0, 0, 0, 0.1);
}

.navigation-arrow:hover {
  background-color: rgba(255, 255, 255, 1);
}

.navigation-arrow.left {
  left: 0;
}

.navigation-arrow.right {
  right: 0;
}

.navigation-arrow i {
  font-size: 2rem;
  color: #727272;
}

.range {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}
</style>