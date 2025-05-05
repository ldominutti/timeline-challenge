import { shallowMount } from '@vue/test-utils'
import ReservationTable from '@/components/ReservationTable.vue'

const mockReservations = [
  {
    id: 1,
    name: 'Reserva 1',
    start: '2024-05-05T10:00:00',
    end: '2024-05-05T11:00:00'
  },
  {
    id: 2,
    name: 'Reserva 2',
    start: '2024-05-05T12:00:00',
    end: '2024-05-05T13:00:00'
  }
]

describe('ReservationTable.vue', () => {
  it('renders reservation rows correctly', () => {
    const wrapper = shallowMount(ReservationTable, {
      propsData: { reservations: mockReservations }
    })

    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(2)
    expect(rows.at(0).text()).toContain('Reserva 1')
    expect(rows.at(1).text()).toContain('Reserva 2')
  })

  it('renders "No hay reservaciones" if list is empty', () => {
    const wrapper = shallowMount(ReservationTable, {
      propsData: { reservations: [] }
    })

    expect(wrapper.find('.empty-message').text()).toBe('No hay reservaciones')
  })

  it('emits delete-reservation when delete button is clicked', async () => {
    const wrapper = shallowMount(ReservationTable, {
      propsData: { reservations: mockReservations }
    })

    const deleteBtn = wrapper.find('button.icon-button')
    await deleteBtn.trigger('click')

    expect(wrapper.emitted('delete-reservation')).toBeTruthy()
    expect(wrapper.emitted('delete-reservation')[0]).toEqual([1])
  })

  it('toggles sort direction when header is clicked', async () => {
    const wrapper = shallowMount(ReservationTable, {
      propsData: { reservations: mockReservations }
    })

    expect(wrapper.vm.sortDirection).toBe('ascending')

    const timeHeader = wrapper.find('.time-header')
    await timeHeader.trigger('click')

    expect(wrapper.vm.sortDirection).toBe('descending')
  })

  it('sorts reservations by start time', async () => {
    const reversed = [...mockReservations].reverse()
    const wrapper = shallowMount(ReservationTable, {
      propsData: { reservations: reversed }
    })

    const firstRow = wrapper.findAll('tbody tr').at(0)
    expect(firstRow.text()).toContain('Reserva 1')

    await wrapper.find('.time-header').trigger('click')
    const newFirstRow = wrapper.findAll('tbody tr').at(0)
    expect(newFirstRow.text()).toContain('Reserva 2')
  })
})
