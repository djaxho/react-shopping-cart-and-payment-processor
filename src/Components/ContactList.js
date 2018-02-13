import React from 'react';

var ContactList = React.createClass({

    handleContactSelection : function(contact) {

        this.props.handleContactSelection(contact);

    },

    render : function() {
        var contactNodes = this.props.contacts.map(function(contact) {
            return (
                <li className={(this.props.selectedContactId === contact.Id) ? 'selected' : ''} key={contact.Id} onClick={this.handleContactSelection.bind(null, contact)} >
                    <div>
                        <span className="contactName">{contact.FirstName} {contact.LastName}</span> (Id: {contact.Id})
                    </div>
                    <div>
                        Email: {contact.Email} Phone: {contact.Phone1}
                    </div>
                </li>
            );
        }, this);
        return (
            <div >
                <ol className="ContactList">
                    {contactNodes}
                </ol>
            </div>
        );
    }
});

export default ContactList