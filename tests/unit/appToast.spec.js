import { shallowMount } from '@vue/test-utils';
import AppToast from '@/components/AppToast.vue';

describe('AppToast.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(AppToast);
  });

  it('displays the toast with the correct message and type', async () => {
    await wrapper.vm.showToast('Test message', 'success', 3000);

    expect(wrapper.text()).toContain('Test message');
    expect(wrapper.classes()).toContain('success');
    expect(wrapper.vm.show).toBe(true);
  });

  it('auto-closes after the specified duration', async () => {
    jest.useFakeTimers();
    await wrapper.vm.showToast('Auto-close message', 'error', 2000);

    expect(wrapper.vm.show).toBe(true);
    jest.advanceTimersByTime(2000);

    expect(wrapper.vm.show).toBe(false);
    jest.useRealTimers();
  });

  it('pauses the timeout when mouse enters the toast', async () => {
    jest.useFakeTimers();
    await wrapper.vm.showToast('Pausing test', 'info', 3000);

    await wrapper.find('.toast').trigger('mouseenter');
    
    expect(wrapper.vm.isPaused).toBe(true);
    jest.useRealTimers();
  });

  it('resumes the timeout when mouse leaves the toast', async () => {
    jest.useFakeTimers();
    await wrapper.vm.showToast('Resuming test', 'info', 3000);

    await wrapper.find('.toast').trigger('mouseenter');
    await wrapper.find('.toast').trigger('mouseleave');

    expect(wrapper.vm.isPaused).toBe(false);
    jest.useRealTimers();
  });

  it('closes the toast when the close button is clicked', async () => {
    await wrapper.vm.showToast('Click to close', 'error', 3000);

    await wrapper.find('.toast-close').trigger('click');

    expect(wrapper.vm.show).toBe(false);
  });

  it('adds the correct class for error type', async () => {
    await wrapper.vm.showToast('Error type test', 'error', 3000);

    expect(wrapper.classes()).toContain('error');
  });

  it('adds the correct class for success type', async () => {
    await wrapper.vm.showToast('Success type test', 'success', 3000);

    expect(wrapper.classes()).toContain('success');
  });

  it('does not show the toast initially', () => {
    expect(wrapper.vm.show).toBe(false);
  });
});
