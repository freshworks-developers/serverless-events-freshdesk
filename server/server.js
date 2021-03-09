exports = {

  events: [
    { event: 'onTicketCreate', callback: 'onTicketCreateHandler' }
  ],

  onTicketCreateHandler: function(args) {
    console.log('Hello ' + args['data']['requester']['name']);
  }

};
