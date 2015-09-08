import Ember from 'ember';

export default Ember.Service.extend({
  performance: performance, // jshint ignore:line
  Date: Date, // jshint ignore:line

  init() {
    this._super(...arguments);

    this._timers = {};
  },

  getTime() {
    if (this.performance && this.performance.now) {
      return this.performance.now();
    } else {
      return this.Date.now();
    }
  },

  startTimer(label) {
    return this._timers[label] = { start: this.getTime(), end: null };
  },

  stopTimer(label) {
    if (!this._timers[label]) {
      throw new Error('You called `stopTimer` without having called `startTimer` first.');
    }

    this._timers[label].end = this.getTime();

    return this._timers[label];
  },

  timedRender(label) {
    let result = this.startTimer(label);

    Ember.run.schedule('afterRender', () => {
      this.stopTimer(label);
    });

    return result;
  }
});
