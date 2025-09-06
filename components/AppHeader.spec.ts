import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
// @ts-ignore
import AppHeader from './AppHeader.vue'

describe('AppHeader', () => {
  it('renders the header component', () => {
    const wrapper = mount(AppHeader, {
      global: {
        mocks: {
          $auth: { loggedIn: false }
        },
        stubs: ['NuxtLink', 'Button', 'Avatar', 'MegaMenu']
      }
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'MegaMenu' }).exists()).toBe(true)
  })

  it('renders with auth mock', () => {
    const wrapper = mount(AppHeader, {
      global: {
        mocks: {
          $auth: { loggedIn: true, user: { picture: 'test.jpg' } }
        },
        stubs: ['NuxtLink', 'Button', 'Avatar', 'MegaMenu']
      }
    })
    expect(wrapper.exists()).toBe(true)
  })
})