import assert from 'assert';
import { EventBus, Subscription } from '../src/index.js';

describe('EventBus', () => {
  it('only accepts Subscriptions', () => {
    const eventBus = new EventBus();
    assert.throws(() => eventBus.subscribe(), Error);
    assert.throws(() => eventBus.subscribe({}), Error);
    assert.throws(() => eventBus.subscribe({ address: '', onNext: () => {} }), Error);
  });

  it('does not add duplicate subscriptions', () => {
    const eventBus = new EventBus();
    const subscription = new Subscription('test', () => {});
    eventBus.subscribe(subscription);
    assert.equal(eventBus.subscribers.length, 1);
    eventBus.subscribe(subscription);
    assert.equal(eventBus.subscribers.length, 1);
  });

  it('addsMultipleSubscriptions', () => {
    const eventBus = new EventBus();
    const subscription1 = new Subscription('test', () => {});
    const subscription2 = new Subscription('test', () => {});
    eventBus.subscribe(subscription1);
    eventBus.subscribe(subscription2);
    assert.equal(eventBus.subscribers.length, 2);
  });

  it('unsubscribes', () => {
    const eventBus = new EventBus();
    const subscription = new Subscription('test', () => {});
    eventBus.subscribe(subscription);
    assert.equal(eventBus.subscribers.length, 1);
    eventBus.unsubscribe(subscription);
    assert.equal(eventBus.subscribers.length, 0);
  });

  it('calls onNext', () => {
    const eventBus = new EventBus();
    const calledValues = [];
    const subscription = new Subscription('test', msg => calledValues.push(msg.val));
    eventBus.subscribe(subscription);
    eventBus.publish({ address: 'test', val: 1 });
    eventBus.publish({ address: 'test', val: '2' });
    eventBus.publish({ address: 'something', val: 3 });
    assert.deepEqual(calledValues, [ 1, '2' ]);
  });
});
