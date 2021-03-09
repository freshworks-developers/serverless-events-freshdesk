exports = {

  events: [
    { event: 'onTicketCreate', callback: 'onTicketCreateHandler' },
    { event: 'onTicketUpdate', callback: 'onTicketUpdateHandler' },
    { event: "onScheduledEvent", callback: "onScheduledEventHandler" }
  ],

  onTicketCreateHandler: function (args) {
    const newDate = new Date();
    $schedule.create({
      name: "ticket_reminder_" + args.data.ticket.id,
      data: { ticket_id: args.data.ticket.id },
      schedule_at: new Date(newDate.setMinutes(newDate.getMinutes() + 6)).toISOString(),
    })
      .then(function (data) {
        console.log('successfully scheduled the reminder')
        console.log(data);
      }, function (error) {
        console.error('Error: Failed to schedule the event');
        console.error(error);
      });
  },

  onTicketUpdateHandler: function (args) {
    const ticketChanges = args.data.ticket.changes;
    if (ticketChanges.status && (ticketChanges.status[1] === 4 || ticketChanges.status[1] === 5)) {
      $schedule.delete({
        name: "ticket_reminder_" + args.data.ticket.id,
      })
        .then(function (data) {
          console.log('Successfully deleted schedule');
          console.log(data);
        }, function (error) {
          if (error.status === 404) {
            console.error('Schedule does not exist for the ticket:', args.data.ticket.id);
          } else {
            console.error('Error: Failed to delete the schedule');
          }
          console.error(error);
        });
    } else {
      console.log('ticket is not resolved or closed yet')
    }
  },

  onScheduledEventHandler: function (args) {
    console.log('scheduled event triggered');
    console.log(args);
    $request.post(`https://${args.domain}/api/v2/tickets/${args.data.ticket_id}/notes`, {
      headers: {
        Authorization: "Basic <%= encode(iparam.api_key) %>"
      },
      json: {
        private: false,
        notify_emails: [args.iparams.notification_to],
        body: "Guess what! You forgot to reply to this ticket",
      }
    }).then(data => {
      console.info('Successfully added private note for reminder');
      console.log(data);
    }, error => {
      console.error('Error: Failed to add private note for reminder');
      console.error(JSON.stringify(error));
    });
  }

};
