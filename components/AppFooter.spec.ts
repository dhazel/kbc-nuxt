import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
// @ts-ignore
import AppFooter from './AppFooter.vue'

describe('AppFooter', () => {
  it('renders the footer', () => {
    const wrapper = mount(AppFooter)
    expect(wrapper.exists()).toBe(true)
  })
})