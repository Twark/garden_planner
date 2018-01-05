import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Plants = new Mongo.Collection('plants');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('plants', function plantsPublication() {
    return Plants.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId },
      ],
    });
  });
}

Meteor.methods({
  'plants.insert'(name) {
    check(name, String);
 
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
 
    Plants.insert({
      name,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
  },
  'plants.remove'(plantId) {
    check(plantId, String);
 
    const plant = Plants.findOne(plantId);
    if (plant.private && plant.owner !== this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }
    Plants.remove(plantId);
  },
  'plants.setChecked'(plantId, setChecked) {
    check(plantId, String);
    check(setChecked, Boolean);
 
    const plant = Plants.findOne(plantId);
    if (plant.private && plant.owner !== this.userId) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error('not-authorized');
    }
    Plants.update(plantId, { $set: { checked: setChecked } });
  },
  'plants.setPrivate'(plantId, setToPrivate) {
    check(plantId, String);
    check(setToPrivate, Boolean);

    const plant = Plants.findOne(plantId);

    // Make sure only the task owner can make a task private
    if (plant.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Plants.update(plantId, { $set: { private: setToPrivate } });
  },
});