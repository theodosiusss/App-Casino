import Route from '@ember/routing/route';

export default class GamesRoute extends Route {
  model() {
    return [
      {
        id: 'slot1',
        price: 1000,
        cost: 100,
        name: 'Slot Machine Leaugue Teams',
        icons: [
          '/assets/images/img.png',
          '/assets/images/img_1.png',
          '/assets/images/img_2.png',
          '/assets/images/img_3.png',
          '/assets/images/img_4.png',
          '/assets/images/img_5.png',
        ]
      },
      {
        id: 'slot2',
        name: 'Slot Machine Cat',
        price: 500,
        cost: 50,
        icons: [
          '/assets/images/img_6.png',
          '/assets/images/img_7.png',
          '/assets/images/img_8.png',
          '/assets/images/img_9.png',

        ]
      },
      {
        id: 'slot3',
        name: 'Slot Machine MLP',
        price: 100,
        cost: 10,
        icons: [
          '/assets/images/img_10.png',
          '/assets/images/img_11.png',
          '/assets/images/img_12.png',
        ]
      },
    ];
  }
}
