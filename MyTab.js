Tabs = new Meteor.Collection('tabs');
Drinks = new Meteor.Collection('drinks');

if (Meteor.isClient) {
  Meteor.Router.add({
    '/': function () {
      return 'home';
    },

    '/tabs/:id':  function (id) {
      Session.set('tabId', id);
      return 'tab';
    }
  });

  Template.tab.drinks_menu = function(){
    return Drinks.find({});
  };

  Template.tab.ordered_drinks = function () {
    var tab = Tabs.findOne(Session.get('tabId'));

    if (!tab) return [];

    console.log("Drinks: ", tab.ordered_drinks);
    return tab.ordered_drinks;
  };

  Template.drink_from_menu.events({
    'click .buy_drink': function () {
      var drink = {name: this.name, price: this.price};

      console.log("this = ", this);

      // using 'this' doesn't work because it already has a '_id' field and 
      // you would be trying to render multiple drinks with the same id
      // which causes Spark to throw the "Can't create second landmark 
      // in same branch" error
      //Tabs.update({_id:Session.get('tabId')}, {$push: {ordered_drinks: this}});
      
      // either ensure that the objects you want Spark to render have a 
      // unique id or leave off the _id completely and let Spark do it for you
      Tabs.update({_id:Session.get('tabId')}, {$push: {ordered_drinks: drink}});
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Meteor.Router.add({
      '/tabs/:id.xml': function(id) {
        return Tabs.findOne(id).owner;
      }
    });

    if (Tabs.find().count() === 0) {
      Tabs.insert({_id:"1", ordered_drinks:[]});
    }

    if (Drinks.find().count() === 0) {
      Drinks.insert({name: "Screwdriver", price: "5.00"});
      Drinks.insert({name: "Rum and Coke", price: "5.50"});
      Drinks.insert({name: "Kilkenny's", price: "8.00"});
    }
  });
}
