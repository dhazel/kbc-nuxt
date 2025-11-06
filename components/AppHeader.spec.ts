import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
// @ts-ignore
import AppHeader from './AppHeader.vue'

describe('AppHeader', () => {
  it('renders the header component', () => {
    const wrapper = mount(AppHeader, {
        global: {
          mocks: {
            $auth: { loggedIn: true, user: { picture: 'test.jpg' } },
            $userService: { getUserProfileByEmail: vi.fn() }
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
           $auth: { loggedIn: false },
           $userService: { getUserProfileByEmail: () => Promise.resolve(null) }
         },
         stubs: ['NuxtLink', 'Button', 'Avatar', 'MegaMenu']
       }
    })
    expect(wrapper.exists()).toBe(true)
  })
})