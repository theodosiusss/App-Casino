import Route from '@ember/routing/route';

export default class GamesSlotDuelRoute extends Route {
  model(params: { id: string }) {
    // hol das parent-model (games)
    const games = this.modelFor('games') as Array<{ id: string; name: string; icons: string[] }>;
    return games.find((g) => g.id === params.id) ?? null;
  }
}
