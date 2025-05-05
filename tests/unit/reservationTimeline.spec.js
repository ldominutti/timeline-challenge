import { shallowMount } from '@vue/test-utils';
import ReservationTimeline from '@/components/ReservationTimeline.vue';

beforeEach(() => {
  window.vis = {
    Timeline: jest.fn().mockImplementation(() => ({
      on: jest.fn(),
      off: jest.fn(),
      destroy: jest.fn(),
      getWindow: jest.fn().mockReturnValue({ start: new Date(), end: new Date() }),
      setWindow: jest.fn()
    })),
    DataSet: jest.fn().mockImplementation(() => ({
      clear: jest.fn(),
      add: jest.fn()
    }))
  };
});

describe('ReservationTimeline.vue', () => {
  const baseProps = {
    reservations: [
      {
        id: 1,
        start: '2024-01-01T09:00:00',
        end: '2024-01-01T10:00:00',
        createdBy: 1234
      },
      {
        id: 2,
        start: '2024-01-01T11:00:00',
        end: '2024-01-01T12:00:00',
        createdBy: 5678
      }
    ],
    currentDate: '2024-01-01'
  };

  it('renders the component without crashing', () => {
    const wrapper = shallowMount(ReservationTimeline, { propsData: baseProps });
    expect(wrapper.exists()).toBe(true);
  });

  it('passes correct legend items to ReservationLegend', () => {
    const wrapper = shallowMount(ReservationTimeline, { propsData: baseProps });
    const legend = wrapper.findComponent({ name: 'ReservationLegend' });
    expect(legend.exists()).toBe(true);
    expect(legend.props('items')).toHaveLength(3);
  });

  it('calls move() when navigation arrow is clicked', async () => {
    const wrapper = shallowMount(ReservationTimeline, { propsData: baseProps });
    const moveSpy = jest.spyOn(wrapper.vm, 'move');
    await wrapper.find('.navigation-arrow.left').trigger('click');
    expect(moveSpy).toHaveBeenCalledWith(0.2);
    await wrapper.find('.navigation-arrow.right').trigger('click');
    expect(moveSpy).toHaveBeenCalledWith(-0.2);
  });

  it('emits date-change when timeline range changes', async () => {
    const wrapper = shallowMount(ReservationTimeline, { propsData: baseProps });
    wrapper.vm.timeline = { on: (event, cb) => cb({ start: '2024-01-01' }) };
    wrapper.vm.handleRangeChange({ start: '2024-01-01' });
    expect(wrapper.emitted('date-change')[0]).toEqual(['2024-01-01']);
  });

  it('applies correct style for user reservation', () => {
    const wrapper = shallowMount(ReservationTimeline, { propsData: baseProps });
    const processed = wrapper.vm.processReservations();
    expect(processed[0].style).toContain('#91feb5');
    expect(processed[1].style).toContain('#fff48c');
  });

  it('updates timeline items when reservations change', async () => {
    const wrapper = shallowMount(ReservationTimeline, { propsData: baseProps });
  
    const addSpy = jest.spyOn(wrapper.vm.timelineItems, 'add');
  
    await wrapper.setProps({
      reservations: [
        ...baseProps.reservations,
        { id: 3, start: '2024-01-01T13:00:00', end: '2024-01-01T14:00:00', createdBy: 9999 }
      ]
    });
  
    await wrapper.vm.$nextTick();
  
    expect(addSpy).toHaveBeenCalled();
  });
  

  it('moves to new date when currentDate changes', async () => {
    const wrapper = shallowMount(ReservationTimeline, { propsData: baseProps });
  
    const setWindowSpy = jest.spyOn(wrapper.vm.timeline, 'setWindow');
  
    await wrapper.setProps({ currentDate: '2024-01-02' });
  
    await wrapper.vm.$nextTick();
  
    expect(setWindowSpy).toHaveBeenCalledWith(
      expect.any(Date),
      expect.any(Date),
      { animation: true }
    );
  });
  
});