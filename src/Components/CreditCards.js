import React from 'react';

var CreditCards = React.createClass({

    render : function() {

        var placeholder =
                <tr>
                    <td colSpan="4">No cards on record</td>
                </tr>
            ;
        var cardNodes = this.props.creditCards.map(function(card) {
            return (

                <tr key={card.Id}>
                    <td><i className="fa fa-credit-card" aria-hidden={true}></i></td>
                    <td>{card.CardType}</td>
                    <td>{card.Last4}</td>
                    <td className="text-right">
                        <button
                            onClick={this.props.handleAddCreditCardToOrder.bind(null, card)}
                            className="btn btn-success btn-xs"
                            disabled={this.props.universalApplicationDisabled}
                        >
                            + Use
                        </button>
                    </td>
                </tr>

            );
        }, this);

        return (
            <div>
                <h3>Cards</h3>
                <table className=" table table-hover table-condensed">
                    <thead>
                    <tr>
                        <th colSpan="2">Card Type</th>
                        <th>Last 4</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                        {(this.props.creditCards.length > 0) ? cardNodes : placeholder}
                    </tbody>
                </table>
                <div className="text-right">
                    <button
                        className="btn btn-primary btn-sm"
                        disabled={this.props.universalApplicationDisabled}
                    >
                        + Add New Credit Card
                    </button>
                </div>
            </div>
        );
    }
})

export default CreditCards
