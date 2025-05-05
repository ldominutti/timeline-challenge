import { mount, config } from '@vue/test-utils'
import App from '@/App.vue'
import {
  getExistingReservations,
  createReservation,
  deleteReservation
} from '@/services/reservationService'

config.stubs['transition'] = true
config.stubs['transition-group'] = true

jest.mock('@/services/reservationService', () => ({
  getExistingReservations: jest.fn(),
  createReservation: jest.fn(),
  deleteReservation: jest.fn()
}))

describe('App.vue', () => {
  let wrapper
  const mockToastMethods = {
    showToast: jest.fn()
  }

  const mockReservations = [
    { id: 1, name: 'Test 1', start: '2025-05-01 09:00', end: '2025-05-01 10:00' },
    { id: 2, name: 'Test 2', start: '2025-05-02 11:00', end: '2025-05-02 12:00' }
  ]

  beforeAll(() => {
    global.MutationObserver = class {
      observe() {}
      disconnect() {}
    }
  })

  beforeEach(async () => {
    jest.clearAllMocks()
    
    getExistingReservations.mockResolvedValue([...mockReservations])
    
    wrapper = mount(App, {
      stubs: {
        ReservationForm: true,
        ReservationTimeline: true,
        ReservationTable: true,
        AppToast: {
          template: '<div></div>',
          methods: mockToastMethods
        }
      },
      mocks: {
        $refs: { toast: mockToastMethods }
      },
      attachTo: document.body
    })

    await wrapper.vm.$nextTick()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('Initialization', () => {
    it('should load reservations on mount', () => {
      expect(getExistingReservations).toHaveBeenCalled()
      expect(wrapper.vm.reservations).toEqual(mockReservations)
    })

    it('should show error toast when loading fails', async () => {
      const errorMessage = 'Error al cargar las reservas'
      getExistingReservations.mockRejectedValue(new Error(errorMessage))
      
      const errorWrapper = mount(App, {
        stubs: {
          ReservationForm: true,
          ReservationTimeline: true,
          ReservationTable: true,
          AppToast: {
            template: '<div></div>',
            methods: mockToastMethods
          }
        },
        mocks: {
          $refs: { toast: mockToastMethods }
        }
      })

      await errorWrapper.vm.$nextTick()
      await new Promise(resolve => setImmediate(resolve))
      
      expect(mockToastMethods.showToast).toHaveBeenCalledWith(
        errorMessage,
        'error'
      )
      
      errorWrapper.destroy()
    })
  })

  describe('Reservation Management', () => {
    it('should add reservation and show success toast', async () => {
      const newReservation = {
        name: 'New Reservation',
        start: '2025-05-01 14:00',
        end: '2025-05-01 15:00'
      }
      const mockResponse = { ...newReservation, id: 3 }
      
      createReservation.mockResolvedValue(mockResponse)

      await wrapper.vm.handleAddReservation(newReservation)
      await wrapper.vm.$nextTick()

      expect(createReservation).toHaveBeenCalledWith(newReservation)
      expect(wrapper.vm.reservations).toContainEqual(mockResponse)
      expect(mockToastMethods.showToast).toHaveBeenCalledWith(
        'Reserva creada exitosamente',
        'success'
      )
    })

    it('should show error toast when adding conflicting reservation', async () => {
      const errorMessage = 'Conflicto con reserva existente'
      createReservation.mockRejectedValue(new Error(errorMessage))
      
      await wrapper.vm.handleAddReservation({})
      await wrapper.vm.$nextTick()

      expect(mockToastMethods.showToast).toHaveBeenCalledWith(
        errorMessage,
        'error'
      )
    })

    it('should delete reservation and show success toast', async () => {
      await wrapper.setData({ reservations: [...mockReservations] })
      deleteReservation.mockResolvedValue(1)

      await wrapper.vm.handleDeleteReservation(1)
      await wrapper.vm.$nextTick()

      expect(deleteReservation).toHaveBeenCalledWith(1)
      expect(wrapper.vm.reservations).toEqual([
        { id: 2, name: 'Test 2', start: '2025-05-02 11:00', end: '2025-05-02 12:00' }
      ])
      expect(mockToastMethods.showToast).toHaveBeenCalledWith(
        'Reserva eliminada exitosamente',
        'success'
      )
    })

    it('should show error toast when deleting non-existent reservation', async () => {
      const errorMessage = 'Reserva no encontrada'
      deleteReservation.mockRejectedValue(new Error(errorMessage))
      
      await wrapper.vm.handleDeleteReservation(999)
      await wrapper.vm.$nextTick()

      expect(mockToastMethods.showToast).toHaveBeenCalledWith(
        errorMessage,
        'error'
      )
    })
  })

  describe('Computed Properties', () => {
    it('should filter reservations by current date', async () => {
      await wrapper.setData({
        reservations: mockReservations,
        currentDate: '2025-05-01'
      })

      expect(wrapper.vm.filteredReservations).toEqual([
        { id: 1, name: 'Test 1', start: '2025-05-01 09:00', end: '2025-05-01 10:00' }
      ])
    })
  })

  describe('Event Handling', () => {
    it('should update current date when timeline changes', async () => {
      const newDate = '2025-05-03'
      await wrapper.vm.handleDateChange(newDate)

      expect(wrapper.vm.currentDate).toBe(newDate)
    })
  })
})