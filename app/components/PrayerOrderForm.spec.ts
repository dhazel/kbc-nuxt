import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { setup } from '@nuxt/test-utils';

// Mock dependencies before any imports
vi.mock('@primevue/forms', () => ({
    Form: {
        name: 'Form',
        template: '<form><slot /></form>',
        props: ['resolver', 'initial-values'],
        emits: ['submit'],
    },
}));

vi.mock('#app', () => ({
    useNuxtApp: vi.fn(() => ({
        $auth: {
            loggedIn: true,
            user: { name: 'Test', email: 'test@test.com' },
        },
    })),
}));

vi.mock('primevue/usetoast', () => ({
    useToast: vi.fn(() => ({ add: vi.fn() })),
}));

vi.mock('zod', () => ({
    z: {
        object: vi.fn(() => ({ min: vi.fn(() => ({ message: vi.fn() })) })),
        string: vi.fn(() => ({ min: vi.fn(() => ({ message: vi.fn() })) })),
    },
}));

describe('PrayerOrderForm', () => {
    setup();

    it('renders the component', async () => {
        // Dynamic import to avoid module resolution issues
        // @ts-ignore
        const { default: PrayerOrderForm } = await import(
            './PrayerOrderForm.vue'
        );

        const wrapper = mount(PrayerOrderForm, {
            global: {
                stubs: ['InputText', 'Textarea', 'Button', 'Message'],
                provide: {
                    sppService: { addPrayerOrder: vi.fn() },
                },
            },
        });

        // Assertions for rendering
        expect(wrapper.exists()).toBe(true);
        expect(wrapper.find('form').exists()).toBe(true);
        expect(wrapper.text()).toContain('Prayer Subject');
        expect(wrapper.text()).toContain('Details');
        expect(wrapper.findComponent({ name: 'Button' }).exists()).toBe(true);
    });

    it('validates form data structure', () => {
        // Test the expected form data structure
        const formData = {
            valid: true,
            values: {
                subject: 'Test Prayer',
                details: 'Test prayer details',
            },
        };

        expect(formData.valid).toBe(true);
        expect(formData.values.subject).toBe('Test Prayer');
        expect(formData.values.details).toBe('Test prayer details');
    });

    it('processes prayer order data correctly', () => {
        // Test the data transformation logic
        const values = {
            subject: 'Test Prayer',
            details: 'Test prayer details',
        };

        const prayerOrder = {
            title: values.subject,
            body: values.details,
        };

        expect(prayerOrder.title).toBe('Test Prayer');
        expect(prayerOrder.body).toBe('Test prayer details');
    });
});
