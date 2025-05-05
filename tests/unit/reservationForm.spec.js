import { mount, createLocalVue } from '@vue/test-utils'
import ReservationForm from '@/components/ReservationForm.vue'

const originalMoment = moment
const mockDate = '2025-01-01'
window.moment = (...args) => {
  return args.length === 0
    ? originalMoment(mockDate)
    : originalMoment(...args)
}

const localVue = createLocalVue()

describe('ReservationForm.vue', () => {
  const createWrapper = () => {
    return mount(ReservationForm, {
      localVue,
      attachTo: document.body
    })
  }

  describe('Rendering', () => {
    it('renders all required fields', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('#name').exists()).toBe(true)
      expect(wrapper.find('#date').exists()).toBe(true)
      expect(wrapper.find('#start-time').exists()).toBe(true)
      expect(wrapper.find('#end-time').exists()).toBe(true)
      expect(wrapper.find('button[type="submit"]').text()).toBe('Guardar')
    })
  })

  describe('Form binding', () => {
    it('syncs input values with formData', async () => {
      const wrapper = createWrapper()
      await wrapper.find('#name').setValue('John')
      await wrapper.find('#date').setValue('2025-01-01')
      await wrapper.find('#start-time').setValue('08:00')
      await wrapper.find('#end-time').setValue('09:00')
      expect(wrapper.vm.formData).toEqual({
        name: 'John',
        date: '2025-01-01',
        startTime: '08:00',
        endTime: '09:00'
      })
    })
  })

  describe('Validation', () => {
    it('shows errors for missing required fields', async () => {
      const wrapper = createWrapper()
      await wrapper.find('form').trigger('submit.prevent')
      expect(wrapper.vm.errorMessage).toBe('Por favor rellena todos los campos')
      expect([...wrapper.vm.invalidFields]).toEqual(
        expect.arrayContaining(['name', 'date', 'startTime', 'endTime'])
      )
    })

    it('rejects past start date', async () => {
      const wrapper = createWrapper()
      const pastDate = originalMoment(mockDate).subtract(1, 'day').format('YYYY-MM-DD')
      await wrapper.find('#name').setValue('Test')
      await wrapper.find('#date').setValue(pastDate)
      await wrapper.find('#start-time').setValue('09:00')
      await wrapper.find('#end-time').setValue('10:00')
      await wrapper.find('form').trigger('submit.prevent')
      expect(wrapper.vm.errorMessage).toBe('La fecha y hora de inicio no pueden ser anteriores al momento actual')
    })

    it('rejects end time earlier than start time', async () => {
      const wrapper = createWrapper()
      await wrapper.find('#name').setValue('Test')
      await wrapper.find('#date').setValue(mockDate)
      await wrapper.find('#start-time').setValue('10:00')
      await wrapper.find('#end-time').setValue('09:00')
      await wrapper.find('form').trigger('submit.prevent')
      expect(wrapper.vm.errorMessage).toBe('La hora de inicio debe ser anterior a la de fin')
    })
  })

  describe('Submission', () => {
    it('emits add-reservation with correct payload', async () => {
      const wrapper = createWrapper()
      await wrapper.find('#name').setValue('Meeting')
      await wrapper.find('#date').setValue('2025-01-02')
      await wrapper.find('#start-time').setValue('09:00')
      await wrapper.find('#end-time').setValue('10:00')
      await wrapper.find('form').trigger('submit.prevent')
      const emitted = wrapper.emitted('add-reservation')[0][0]
      expect(emitted).toMatchObject({
        name: 'Meeting',
        start: '2025-01-02 09:00',
        end: '2025-01-02 10:00',
        createdBy: 1234
      })
    })

    it('clears form after successful submission', async () => {
      const wrapper = createWrapper()
      await wrapper.find('#name').setValue('Reset')
      await wrapper.find('#date').setValue('2025-01-02')
      await wrapper.find('#start-time').setValue('09:00')
      await wrapper.find('#end-time').setValue('10:00')
      await wrapper.find('form').trigger('submit.prevent')
      expect(wrapper.vm.formData).toEqual({ name: '', date: '', startTime: '', endTime: '' })
    })
  })

  describe('Edge cases', () => {
    it('accepts 30-character name input', async () => {
      const wrapper = createWrapper()
      const name = 'A'.repeat(30)
      await wrapper.find('#name').setValue(name)
      expect(wrapper.vm.formData.name).toBe(name)
    })
  })
})
