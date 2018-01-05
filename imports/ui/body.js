import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Plants } from '../api/plants.js';
 
import './plant.js'; 
import './body.html';

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('plants');
});
 
Template.body.helpers({
  plants() {
  	const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {
      // If hide completed is checked, filter tasks
      return Plants.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    }
    return Plants.find({}, { sort: { createdAt: -1 } });
  },
  incompleteCount() {
    return Plants.find({ checked: { $ne: true } }).count();
  },
});

Template.body.events({
  'submit .new-plant'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const name = target.name.value;

 
    // Insert a task into the collection
    Meteor.call('plants.insert', name);
 
    // Clear form
    target.name.value = '';
  },
  'change .hide-completed input'(event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  },
});