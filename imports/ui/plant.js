import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
 
import { Plants } from '../api/plants.js';
 
import './plant.html';


Template.plant.helpers({
  isOwner() {
    return this.owner === Meteor.userId();
  },
});
 
Template.plant.events({
  'click .toggle-checked'() {
    // Set the checked property to the opposite of its current value
     Meteor.call('plants.setChecked', this._id, !this.checked);
  },
  'click .delete'() {
     Meteor.call('plants.remove', this._id);
  },
  'click .toggle-private'() {
    Meteor.call('plants.setPrivate', this._id, !this.private);
  },
});