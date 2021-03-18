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
    const properties = {
        ticket_id: 1
    };
    client.request.invoke('deleteSchedule', properties).then(function (data) {
        console.info('Ticket create successfull');
        console.info(JSON.stringify(data));
        showNotification('success', `Ticket created successfully! Ticket ID: ${data.response.data.id}`);
    }).catch(function (error) {
        console.error('Ticket create error');
        console.error(JSON.stringify(error));
        showNotification('danger', 'Failed to create ticket.');
    });
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
