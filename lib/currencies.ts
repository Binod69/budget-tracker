export const Currencies = [
  {
    value: 'NPR',
    label: 'रु NPR',
    locale: 'ne_Np',
  },
  {
    value: 'INR',
    label: '₹ INR',
    locale: 'en-IN',
  },
  {
    value: 'USD',
    label: '＄ Dollar',
    locale: 'en-US',
  },
  {
    value: 'EUR',
    label: '€ Euro',
    locale: 'de-DE',
  },

  {
    value: 'JPY',
    label: '¥ Yen',
    locale: 'ja-JP',
  },
];

export type Currency = (typeof Currencies)[0];
