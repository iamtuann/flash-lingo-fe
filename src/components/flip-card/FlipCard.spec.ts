import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import FlipCard from "./FlipCard.vue";
import type { Term } from "@/types";

describe('# FlipCard', () => {
  const mockTerm: Term = { id: 1, topicId: 1, term: 'Hello', pronunciation: '/heˈləʊ/', definition: 'Xin chào', rank: 1, example: 'Hello! I am Tuan' }
  const mountComponent = () => {
    return mount(FlipCard, {
      props: { term: mockTerm }
    })
  }
  it('should render props correctly', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('Hello')
    expect(wrapper.text()).toContain('/heˈləʊ/')
    expect(wrapper.text()).toContain('Xin chào')
    expect(wrapper.text()).toContain('Hello! I am Tuan')
  })

  it('should toggles flip when button is clicked', async () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.flip-card-inner').classes()).not.toContain('flipped');
    await wrapper.find('#flip-btn').trigger('click');
    expect(wrapper.find('.flip-card-inner').classes()).toContain('flipped');
    await wrapper.find('#flip-btn').trigger('click');
    expect(wrapper.find('.flip-card-inner').classes()).not.toContain('flipped');
  });

  it('should reset to front face when term changes', async () => {
    const wrapper = mountComponent()
    await wrapper.find('#flip-btn').trigger('click');
    const newTerm = {...mockTerm, term: 'new term'}
    await wrapper.setProps({term: newTerm})
    expect(wrapper.find('.flip-card-inner').classes()).toContain('no-transition');
    expect(wrapper.find('.flip-card-inner').classes()).not.toContain('flipped');
    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(wrapper.find('.flip-card-inner').classes()).not.toContain('no-transition');
  })
})