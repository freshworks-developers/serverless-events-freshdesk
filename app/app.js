function showNotification(type, message) {
    client.interface.trigger("showNotify", {
        type: type,
        message: message
    }).catch(function (error) {
        console.error('failed to show notification');
        console.error(error);
    });
};

function deleteSchedule() {
    client.data.get("ticket").then(
        function (data) {
            client.request.invoke('deleteSchedule', { ticket_id: data.ticket.id }).then(function (data) {
                console.info('Ticket create successfull');
                console.info(JSON.stringify(data));
                showNotification('success', `Ticket created successfully! Ticket ID: ${data.response.data.id}`);
            }).catch(function (error) {
                console.error('Ticket create error');
                console.error(JSON.stringify(error));
                showNotification('danger', 'Failed to create ticket.');
            });
        },
        function (error) {
            console.error('Error: Failed to get ticket information');
            console.error(error);
            showNotification('danger', 'Failed to get ticket information.');
        }
    );

};

function onDocumentReady() {
    app.initialized()
        .then(function (_client) {
            window.client = _client;
            client.events.on('app.activated',
                function () {

                });
        });
};

document.addEventListener("DOMContentLoaded", onDocumentReady);
