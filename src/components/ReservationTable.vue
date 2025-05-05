<template>
  <section class="reservation-table-container" aria-labelledby="table-title">
    <table class="reservation-table">
      <thead>
        <tr>
          <th scope="col" class="name-header">Nombre</th>
          <th 
            scope="col" 
            @click="toggleSort" 
            class="time-header sortable-header"
            :aria-sort="sortDirection"
          >
            <span class="header-content">
              Horario
              <span class="sort-icon material-icons" aria-hidden="true">
                arrow_{{ sortDirection === 'ascending' ? 'upward' : 'downward' }}
              </span>
            </span>
          </th>
          <th scope="col" class="action-header">Acción</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="reservation in sortedReservations" :key="reservation.id">
          <td class="name-cell" data-label="Nombre">
            <strong>{{ reservation.name }}</strong>
          </td>
          <td class="time-cell" data-label="Horario">
            {{ formatTimeRange(reservation.start, reservation.end) }}
          </td>
          <td class="action-cell">
            <button 
              @click="$emit('delete-reservation', reservation.id)" 
              class="icon-button"
              aria-label="Eliminar reservación"
            >
              <span class="material-icons">delete</span>
            </button>
          </td>
        </tr>
        <tr v-if="!reservations.length">
          <td colspan="3" class="empty-message">No hay reservaciones</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
  
  <script>
  export default {
    name: 'ReservationTable',
    props: {
      reservations: { type: Array, default: () => [] },
      isLoading: Boolean
    },
    data: () => ({
      sortDirection: 'ascending'
    }),
    computed: {
      sortedReservations() {
        const direction = this.sortDirection === 'ascending' ? 1 : -1;
        return [...this.reservations].sort((a, b) => (
          window.moment(a.start).valueOf() - window.moment(b.start).valueOf()
        ) * direction);
      }
    },
    methods: {
      toggleSort() {
        this.sortDirection = this.sortDirection === 'ascending' ? 'descending' : 'ascending';
      },
      formatTimeRange(start, end) {
        return `de ${this.formatTime(start)} a ${this.formatTime(end)}`;
      },
      formatTime(datetime) {
        return window.moment(datetime).format('HH:mm');
      }
    }
  };
  </script>
  
  <style scoped>
  .reservation-table-container {
    margin-top: 70px;
    width: 100%;
    max-width: 1000px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .reservation-table {
    width: 100%;
    min-width: 600px;
    border-collapse: collapse;
    font-size: 0.9rem;
  }
  
  .reservation-table th,
  .reservation-table td {
    border-bottom: 1px solid #e0e0e0;
    padding: 1rem;
  }
  
  .name-header,
  .name-cell {
    width: 68%;
    text-align: left;
  }
  
  .time-header,
  .time-cell {
    width: 16%;
    text-align: right;
  }
  
  .action-header,
  .action-cell {
    width: 16%;
    text-align: center;
  }
  
  .name-cell {
    font-weight: bold;
  }
  
  .time-cell {
    color: #838383;
    white-space: nowrap;
  }
  
  .reservation-table th {
    color: #838383;
  }
  
  .sortable-header {
    cursor: pointer;
  }
  
  .header-content {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
  }
  
  .sort-icon {
    font-size: 1rem;
  }
  
  .icon-button {
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    color: #cccccc;
    transition: all 0.2s;
    border-radius: 50%;
  }
  
  .icon-button:hover {
    color: #e74c3c;
    background-color: rgba(231, 76, 60, 0.1);
  }
  
  .icon-button .material-icons {
    font-size: 1.45rem;
  }
  
  .empty-message {
    text-align: center;
    color: #6c757d;
    padding: 2rem;
  }
  
  @media (max-width: 768px) {
    .reservation-table {
      min-width: 100%;
    }
    
    .reservation-table th,
    .reservation-table td {
      padding: 0.75rem 0.5rem;
    }
  }
  </style>