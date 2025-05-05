import { shallowMount } from '@vue/test-utils';
import ReservationLegend from '@/components/ReservationLegend.vue';

describe('ReservationLegend.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ReservationLegend, {
      propsData: {
        items: [
          { class: 'available', label: 'Disponible' },
          { class: 'reserved', label: 'Reservado' },
          { class: 'my-reservation', label: 'Mi Reserva Actual' }
        ]
      }
    });
  });

  it('renders legend items correctly', () => {
    const legendItems = wrapper.findAll('.legend-item');
    
    expect(legendItems.length).toBe(3);
    expect(legendItems.at(0).text()).toContain('Disponible');
    expect(legendItems.at(1).text()).toContain('Reservado');
    expect(legendItems.at(2).text()).toContain('Mi Reserva Actual');
  });

  it('renders the correct color for each legend item', () => {
    const availableItem = wrapper.find('.legend-color.available');
    const reservedItem = wrapper.find('.legend-color.reserved');
    const myReservationItem = wrapper.find('.legend-color.my-reservation');

    expect(availableItem.exists()).toBe(true);
    expect(reservedItem.exists()).toBe(true);
    expect(myReservationItem.exists()).toBe(true);
  });

  it('sets the correct aria-label for each legend item', () => {
    const legendItems = wrapper.findAll('.legend-item');

    expect(legendItems.at(0).attributes('aria-label')).toBe('Tipo de reserva: Disponible');
    expect(legendItems.at(1).attributes('aria-label')).toBe('Tipo de reserva: Reservado');
    expect(legendItems.at(2).attributes('aria-label')).toBe('Tipo de reserva: Mi Reserva Actual');
  });

  it('renders no items when an empty items array is passed', () => {
    const emptyWrapper = shallowMount(ReservationLegend, {
      propsData: { items: [] }
    });

    const legendItems = emptyWrapper.findAll('.legend-item');
    expect(legendItems.length).toBe(0);
  });
});
