<template>
  <section aria-labelledby="form-title" class="form-container">
    <h2 id="form-title" class="form-title">RESERVAR</h2>

    <form @submit.prevent="handleSubmit" class="form-row">
      <div class="form-group name-group">
        <label for="name">Nombre</label>
        <input id="name" v-model="formData.name" type="text" class="form-input"
          :class="{ 'invalid-input': invalidFields.has('name') }" required aria-required="true" maxlength="30" />
      </div>

      <div class="form-group date-group">
        <label for="date">Fecha</label>
        <input id="date" v-model="formData.date" type="date" class="form-input"
          :class="{ 'invalid-input': invalidFields.has('date') }" required aria-required="true" :min="todayDate" />
      </div>

      <div class="form-group time-group">
        <label for="start-time">Desde</label>
        <input id="start-time" v-model="formData.startTime" type="time" class="form-input"
          :class="{ 'invalid-input': invalidFields.has('startTime') }" required aria-required="true" />
      </div>

      <div class="form-group time-group">
        <label for="end-time">Hasta</label>
        <input id="end-time" v-model="formData.endTime" type="time" class="form-input"
          :class="{ 'invalid-input': invalidFields.has('endTime') }" required aria-required="true" />
      </div>

      <button type="submit" class="form-button submit-button">
        Guardar
      </button>
    </form>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </section>
</template>

<script>
export default {
  name: 'ReservationForm',
  data: () => ({
    formData: {
      name: '',
      date: '',
      startTime: '',
      endTime: ''
    },
    errorMessage: '',
    invalidFields: new Set(),
    todayDate: window.moment().format('YYYY-MM-DD')
  }),
  computed: {
    dateTime() {
      const { date, startTime, endTime } = this.formData;
      return {
        start: window.moment(`${date} ${startTime}`),
        end: window.moment(`${date} ${endTime}`)
      }
    }
  },
  methods: {
    async handleSubmit() {
      if (!await this.validateForm()) return

      this.$emit('add-reservation', {
        name: this.formData.name.trim(),
        start: this.dateTime.start.format('YYYY-MM-DD HH:mm'),
        end: this.dateTime.end.format('YYYY-MM-DD HH:mm'),
        createdBy: 1234 // Assuming 1234 is the current user ID
      })
      this.resetForm();
    },
    async validateForm() {
      this.invalidFields.clear()
      this.errorMessage = ''
      const now = window.moment()

      // Validate required fields
      const requiredFields = ['name', 'date', 'startTime', 'endTime']
      const missingFields = requiredFields.filter(field => !this.formData[field])
      if (missingFields.length) {
        missingFields.forEach(field => this.invalidFields.add(field))
        this.errorMessage = 'Por favor rellena todos los campos'
        return false
      }

      // Validate time logic
      if (this.dateTime.start.isBefore(now)) {
        this.errorMessage = 'La fecha y hora de inicio no pueden ser anteriores al momento actual'
        this.invalidFields.add('date')
        this.invalidFields.add('startTime')
        return false
      }

      if (this.dateTime.start.isSameOrAfter(this.dateTime.end)) {
        this.errorMessage = 'La hora de inicio debe ser anterior a la de fin'
        this.invalidFields.add('startTime')
        this.invalidFields.add('endTime')
        return false
      }

      return true
    },
    resetForm() {
      this.formData = {
        name: '',
        date: '',
        startTime: '',
        endTime: ''
      }
    },
  }
}
</script>

<style scoped>
.form-group.name-group {
  flex: 4;
  min-width: 210px;
}

.form-group.date-group {
  flex: 1;
  min-width: 150px;
}

.form-group.time-group {
  flex: 1;
  min-width: 100px;
}

.submit-button {
  flex: 1;
  min-width: 130px;
}

@media (max-width: 900px) {
  .form-row {
    flex-wrap: wrap;
    gap: 15px;
  }

  .form-group.name-group {
    flex: 1 1 100%;
  }

  .form-group.date-group {
    flex: 2;
    min-width: 180px;
  }

  .form-group.time-group {
    flex: 1;
    min-width: 120px;
  }

  .submit-button {
    flex: 1 1 auto;
    min-width: 150px;
  }
}

@media (max-width: 600px) {
  .form-container {
    padding: 30px 20px;
  }

  .form-row {
    flex-direction: column;
    flex-wrap: nowrap;
    gap: 15px;
  }

  .form-group {
    width: 100%;
    min-width: 100% !important;
  }

  .submit-button {
    width: 100%;
    margin-top: 10px;
    min-width: auto;
  }

  input[type="date"],
  input[type="time"] {
    font-size: 16px;
  }
}
</style>