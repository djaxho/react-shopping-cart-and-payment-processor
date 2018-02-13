import React from 'react';
import money from 'money-math';
import ProcessingButton from './ProcessingButton'

var Payments = React.createClass({

    handlePaymentAmountChange: function(paymentMethod, e) {
        this.props.updatePaymentMethodAmount(paymentMethod, e.target.value);
    },

    handleAddCashPaymentToOrder: function() {
        this.props.handleAddManualPaymentToOrder('cash');
    },

    handleAddCheckPaymentToOrder: function() {
        this.props.handleAddManualPaymentToOrder('check');
    },

    paymentMethodIcon: function(type) {

        var iconClass = 'fa fa-credit-card';

        if (type == 'cash') {
            iconClass = "fa fa-money";
        } else if (type == 'check') {
            iconClass = "fa fa-list-alt";
        }

        return iconClass;
    },

    invoiceBalanceColor: function() {
        if (this.props.totalPrice > this.props.totalAppliedToPayments) {
            return "red";
        } else {
            return "green";
        }
    },

    getProcessButtonText: function() {

        var buttonText;

        if (this.props.processPaymentSuccess === 'false' || this.props.processPaymentSuccess === false) {
            buttonText = "Retry Payment";
        } else {
            buttonText = "Process Payment" ;
        }

        return buttonText;
    },

    userMessage: function() {

        var alertbox, alertTitle, alertContent, alertClassName, options;

        if (this.props.processPaymentSuccess !== null) {

            if (this.props.processPaymentSuccess === 'true' || this.props.processPaymentSuccess === true) {

                alertTitle = "Success";
                alertClassName = "alert alert-success";
                // default value for success
                alertContent = "Your order was processed";
                options = (
                    <div >
                        <button
                            className="btn btn-success btn-sm"
                            onClick={this.props.handleTotalStartOver}
                        >
                            <i className="fa fa-plus-square" aria-hidden={true}></i> Start Over
                        </button>
                        <button
                            className="btn btn-success btn-sm"
                            style={{'marginLeft': '10px'}}
                            onClick={this.props.handleSoftStartOver}
                        >
                            <i className="fa fa-plus-square-o" aria-hidden={true}></i> New order for the same customer
                        </button>
                    </div>
                );

            }  if (this.props.processPaymentSuccess === false || this.props.processPaymentSuccess === 'false') {

                alertTitle = "Error";
                alertClassName = "alert alert-danger";
                // default value for failed
                alertContent = "Your order failed";
                options = <div></div>;

            }

            if(this.props.processPaymentResults) {

                if (typeof this.props.processPaymentResults === 'string' || this.props.processPaymentResults instanceof String) {
                    alertContent = (this.props.processPaymentResults) ? this.props.processPaymentResults : "Your order was processed";
                } else {
                    var alertNodes = this.props.processPaymentResults.map(function (chargeResult) {
                        return (
                            <li>{chargeResult.userMessage}</li>
                        );
                    });
                    alertContent = <ul>{alertNodes}</ul>;
                }
            }

            alertbox =  (
                <div className={alertClassName}>
                    <div><strong>{alertTitle}</strong>! {alertContent}</div>
                    <br/>
                    {options}
                </div>
            );
        }

        return alertbox;
    },

    paymentMethodChargeStatus: function(status) {

        if(status === true) {
            return 'success';
        } else if(status === false) {
            return 'danger';
        }

    },

    paymentMethodChargeIconClass: function(status) {

        if(status === true) {
            return 'text-green fa fa-check-square-o';
        } else if(status === false) {
            return 'text-red fa fa-times';
        }

    },

    render : function() {

        var paymentNodes = this.props.paymentMethods.map(function(paymentMethod) {
            return (

                <tr key={paymentMethod.Id} className={this.paymentMethodChargeStatus(paymentMethod.chargeSuccess)} >
                    <td><i className={this.paymentMethodIcon(paymentMethod.type)} aria-hidden={true}></i></td>
                    <td>{(paymentMethod.CardType) ? paymentMethod.CardType : paymentMethod.Id}</td>
                    <td>{paymentMethod.Last4}</td>
                    <td>
                        <strong>
                            <i className={this.paymentMethodChargeIconClass(paymentMethod.chargeSuccess)} aria-hidden={true}></i> {paymentMethod.userMessage}
                        </strong>
                    </td>
                    <td className="text-right">
                        <div className="input-group">
                            <span className="input-group-addon"><i className="fa fa-usd"></i></span>
                            <input
                                className="form-control"
                                type="number"
                                step="0.01"
                                value={paymentMethod.amount}
                                onChange={this.handlePaymentAmountChange.bind(this, paymentMethod)}
                                disabled={this.props.universalApplicationDisabled}
                            />
                        </div>
                    </td>
                    <td className="actions text-right" >
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={this.props.handleRemoveCreditCardFromOrder.bind(null, paymentMethod)}
                            disabled={this.props.universalApplicationDisabled}
                        >
                            <i className="fa fa-trash-o"></i>
                        </button>
                    </td>
                </tr>

            );
        }, this);

        return (
            <div className="container">
                <div className="row">
                    <h3>Process Payment</h3>
                </div>
                <div className="row">
                    <table className=" table table-hover table-condensed">
                        <thead>
                        <tr >
                            <th colSpan="3" style={{width: "15%"}}>Card</th>
                            <th style={{width: "65%"}}></th>
                            <th>Amount</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                            {paymentNodes}
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colSpan="4"></td>
                            <td className="text-right">
                                <strong>Total: {money.format("USD", money.floatToAmount(this.props.totalPrice))}</strong><br/>
                                Balance: <span style={{'color': this.invoiceBalanceColor(), 'fontWeight': 'bold'}} >{money.format("USD", money.subtract(money.floatToAmount(this.props.totalPrice), money.floatToAmount(this.props.totalAppliedToPayments)))}</span>
                            </td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
                <div className="row">
                    <div className="col-sm-6">
                        <button
                            onClick={this.handleAddCashPaymentToOrder}
                            className="btn btn-success"
                            disabled={this.props.universalApplicationDisabled}
                        >
                            + Use Cash
                        </button>
                        <button
                            onClick={this.handleAddCheckPaymentToOrder}
                            className="btn btn-success"
                            style={{'marginLeft': "6px"}}
                            disabled={this.props.universalApplicationDisabled}
                        >
                            + Use Check
                        </button>
                    </div>
                    <div className="col-sm-6 text-right">
                        <ProcessingButton
                            buttonStatus={this.props.processPaymentButtonStatus} // 1 (initial), 2 (processing), 3 (processed)
                            disabled={this.props.universalApplicationDisabled}
                            buttonClassName="btn btn-info btn-lg"
                            initialIconClassName="fa fa-paper-plane-o"
                            initialButtonText={this.getProcessButtonText()}
                            processingIconClassName="fa fa-circle-o-notch fa-spin"
                            processingButtonText="Processing..."
                            completedIconClassName="fa fa-check"
                            completedButtonText="Order Processed"
                            processingCallBackMethod={this.props.handleProcessPayment}
                        />
                    </div>
                </div>

                <div className="row" style={{'marginTop': "12px"}}>
                    { this.userMessage() }
                </div>

            </div>
        );
    }
})

export default Payments
