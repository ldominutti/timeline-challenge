<template>
  <div id="app" class="app">
    <AppToast ref="toast" />
    <ReservationForm :existing-reservations="filteredReservations" @add-reservation="handleAddReservation" />
    <ReservationTimeline :reservations="reservations" :current-date="currentDate" @date-change="handleDateChange" />
    <ReservationTable :reservations="filteredReservations" @delete-reservation="handleDeleteReservation" />
  </div>
</template>

<script>
import {
  getExistingReservations,
  createReservation,
  deleteReservation
} from './services/reservationService'
import ReservationForm from './components/ReservationForm.vue'
import ReservationTable from './components/ReservationTable.vue'
import ReservationTimeline from './components/ReservationTimeline.vue'
import AppToast from './components/AppToast.vue'

export default {
  name: 'App',
  components: { ReservationForm, ReservationTable, ReservationTimeline, AppToast },
  data() {
    return {
      reservations: [],
      // Day focused on the timeline
      currentDate: window.moment().format('YYYY-MM-DD')
    }
  },
  computed: {
    // Current day reservations
    filteredReservations() {
      return this.reservations.filter(r =>
        window.moment(r.start).isSame(this.currentDate, 'day')
      )
    }
  },
  methods: {
    async handleAddReservation(reservation) {
      try {
        const createdReservation = await createReservation(reservation)
        this.reservations.push(createdReservation)
        this.currentDate = window.moment(reservation.start).format('YYYY-MM-DD')
        this.$refs.toast.showToast('Reserva creada exitosamente', 'success')
      } catch (error) {
        this.$refs.toast.showToast(error.message, 'error')
      }
    },

    async handleDeleteReservation(id) {
      try {
        await deleteReservation(id)
        this.reservations = this.reservations.filter(r => r.id !== id)
        this.$refs.toast.showToast('Reserva eliminada exitosamente', 'success')
      } catch (error) {
        this.$refs.toast.showToast(error.message, 'error')
      }
    },

    handleDateChange(date) {
      this.currentDate = date
    }
  },
  async mounted() {
    try {
      this.reservations = await getExistingReservations()
    } catch (error) {
      this.$refs.toast.showToast('Error al cargar las reservas', 'error')
    }
  }
}
</script>