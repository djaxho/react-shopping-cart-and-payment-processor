import React from 'react';
import ReactDOM from 'react-dom';
import { Tab, Tabs } from 'react-bootstrap';
import money from 'money-math';

import ProfileForm from './modules/ProfileForm'
import CustomerLookup from './modules/CustomerLookup'
import ProductSelection from './modules/ProductSelection'
import Cart from './modules/Cart'
import CreditCards from './modules/CreditCards'
import Payments from './modules/Payments'

var App = React.createClass({

    getInitialState: function() {
        return {
            key: 3,
            universalApplicationDisabled: false,
            invoiceId: null,
            products: [
                {id: 456, title: 'Prod1', price: 19.99},
                {id: 229, title: 'Prod2', price: 32.99}
            ],
            cart: [
                /*{id: 1234, title: 'Prod1', price: 19.99, quantity: 1},
                {id: 4545, title: 'Prod2', price: 32.99, quantity: 3}*/
            ],
            creditCards: [],
            paymentMethods: [],
            cartTotalPrice: '0.00',
            cartTotalAppliedToPayments: '0.00',
            currentOrderItems: [],
            profileFormHasBeenAutoPopd: false,
            selectedContactId: null,
            searchStatus: 1,
            contactDetailsSaveStatus: 1,
            isSameBillingAddress: true,
            contactSearchInput: '',
            searchError: false,
            searchErrorMessage: '',
            formSaveError: false,
            formSaveErrorMessage: '',
            contactSearchResults: [],
            hasMultipleContactSearchResults: false,
            hasSingleContactSearchResult: false,
            processPaymentButtonStatus: 1,
            processPaymentSuccess: null,

            contact: {
                "Id":"",
                "FirstName":"",
                "LastName":"",
                "Phone1":"",
                "Phone2":"",

                "StreetAddress1":"",
                "StreetAddress2":"",
                "City":"",
                "State":"",
                "PostalCode":"",

                "Address2Street1":"",
                "Address2Street2":"",
                "City2":"",
                "State2":"",
                "PostalCode2":"",
            },
        };
    },

    disableApplication: function() {
        this.setState({universalApplicationDisabled: true});
    },
    enableApplication: function() {
        this.setState({universalApplicationDisabled: false});
    },
    cartQuantityChange: function(productId, val) {
        // only allow if qty is going to be greater than 0
        // if user wants to delete item (0qty) use trash button
        if (val > 0) {

            // Get current cart contents
            var updatedCart = this.state.cart;

            updatedCart.map(function(cartItem) {
                // find the intended cart item to edit
                if (cartItem.id == productId) {
                    if (val >= 0) {
                        cartItem.quantity = val;
                    }
                }
            });

            this.setState({cart: updatedCart});
            this.calcTotalPrice();
        }

    },
    removeFromCart: function(productId) {

        var currentCart = this.state.cart;

        var updatedCart = currentCart.filter(function(cartItem) {
            return cartItem.id !== productId;
        });

        this.setState({cart: updatedCart});

        var totalPrice = '0.00';

        updatedCart.map(function(product) {
            totalPrice = money.add(totalPrice, (money.mul(money.floatToAmount(product.price), money.floatToAmount(product.quantity))));
        });

        this.setState({cartTotalPrice: totalPrice});
    },

    calcTotalPrice: function() {
        var totalPrice = '0.00';
        
        this.state.cart.map(function(product) {
            totalPrice = money.add(totalPrice, (money.mul(money.floatToAmount(product.price), money.floatToAmount(product.quantity))));
        });

        this.setState({cartTotalPrice: totalPrice});

        this.adjustCartCharges();
    },

    /**
     * When the cart is updated (qty of items, deletions, additions)
     * the amount applied to payments might become invalid (above invoice price)
     */
    adjustCartCharges: function() {

        //var balance = money.subtract(this.state.cartTotalPrice, this.state.totalAppliedToPayments);
        var cartTotal = this.state.cartTotalPrice;
        var paymentsTotal = this.state.totalAppliedToPayments;
        var balance = paymentsTotal-cartTotal;
        console.log(balance);
        if (balance < 0.00) {
            console.log('negative balance');
            //this.state.paymentMethods.map(function(paymentMethod) {
            //    totalAppliedToPayments = money.add(totalAppliedToPayments, money.floatToAmount(paymentMethod.amount));
            //});

        } else {
            console.log('positive balance');
        }


    },

    calcTotalAppliedToPayments: function() {
        var totalAppliedToPayments = '0.00';

        this.state.paymentMethods.map(function(paymentMethod) {
            totalAppliedToPayments = money.add(totalAppliedToPayments, money.floatToAmount(paymentMethod.amount));
        });

        /*if ((money.cmp(totalAppliedToPayments, this.state.cartTotalPrice))) {*/
            this.setState({cartTotalAppliedToPayments: totalAppliedToPayments});
        /*}*/

    },

    addToCart: function(productId) {

        // Get current cart contents
        var updatedCart = this.state.cart;

        // Get available products
        var products = this.state.products;

        // Loop through the available products
        products.map(function(product) {

            // Check if the product Id of the item we are attempting to add to cart is
            // is the same as the current product in the iteration
            if(product.id == productId) {

                var itemAlreadyInCart = false;

                // Loop through the current items in the cart
                updatedCart.map(function(cartItem) {

                    // If this item is already in the cart, simple increment it's quantity
                    if(cartItem.id == product.id) {
                        itemAlreadyInCart = true;
                    }
                });

                if (itemAlreadyInCart) {
                    product.quantity = Number(product.quantity)+Number(1);
                } else {
                    product.quantity = 1;
                    updatedCart.push(product);
                }
            }

        });

        this.setState({cart: updatedCart});
        this.calcTotalPrice();
    },

    /**
     * Add a credit card to order. The card object should contain
     * BillAddress1, BillAddress2, BillCity, BillName, BillState,
     * BillZip, CardType, ExpirationMonth, ExpirationYear, Id, Last4
     * NameOnCard, Status, type
     * @param cardData
     */
    addCreditCardToOrder: function(cardData) {

        cardData.type = 'card';

        this.addToPaymentMethods(cardData);
    },

    /**
     * Add a manual payment to the order
     * We set type and id to the same string since there
     * is no extra data related to these payment types
     * @param string type either 'check' or 'cash'
     */
    addManualPaymentToOrder: function(type) {

        // set up the payment object
        var paymentObject = {};
        // set the sype and id of paymentobject
        paymentObject.type = type;
        paymentObject.Id = type;
        //add the payment object to the order
        this.addToPaymentMethods(paymentObject);
    },

    /**
     * This will add either a credit card, check, or cash payment to the order
     * */
    addToPaymentMethods: function(paymentMethodToAdd) {

        // Snapshot of current state
        var currentMethods = this.state.paymentMethods;

        var addingUniquePaymentMethod = true;

        // find a match that we are attempting to update
        // so we can avoid adding the same method twice
        currentMethods.map(function (paymentMethod) {
            if (paymentMethod.Id == paymentMethodToAdd.Id) {
                addingUniquePaymentMethod = false;
            }
        }.bind(this));

        if (addingUniquePaymentMethod) {
            // set a default amount of money to be paid with this amount (take the orde balance)
            paymentMethodToAdd.amount = money.subtract(money.floatToAmount(this.state.cartTotalPrice), money.floatToAmount(this.state.cartTotalAppliedToPayments));
            // Add the item to the paymentMethods
            currentMethods.push(paymentMethodToAdd);

            // Update the state
            this.setState({paymentMethods: currentMethods});
            // realculate the total amount of money pledged to this order
            this.calcTotalAppliedToPayments();
        }
    },

    handleContactSelection: function(contact) {
        if (! this.state.universalApplicationDisabled) {
            this.updateContactData(contact);
            this.setState({selectedContactId: contact.Id});
            this.setState({profileFormHasBeenAutoPopd: true});
            this.getCreditCards(contact.Id);
        }
    },

    handleTotalStartOver: function() {

        this.resetContactSearchSelectionOrder();
        this.enableApplication();
        if(this.state.key != 1) {
            this.setState({key: 1});
        }

    },

    handleSoftStartOver: function() {

        this.resetCartAndOrder();
        this.enableApplication();
        if(this.state.key != 2) {
            this.setState({key: 2});
        }

    },

    resetContactSearchSelectionOrder: function() {

        var clearedContact = {};
        for (var key in this.state.contact){
            if (this.state.contact.hasOwnProperty(key)){
                clearedContact.key = '';
            }
        }
        this.setState({
            contact: clearedContact,
            selectedContactId: null,
            profileFormHasBeenAutoPopd: false,
            searchError: false,
            searchErrorMessage: "",
            contactSearchResults: [],
            hasMultipleContactSearchResults: false,
            hasSingleContactSearchResult: false,
            cart: [],
            cartTotalPrice: '0.00',
            cartTotalAppliedToPayments: '0.00',
            contactSearchInput: "",
            paymentMethods: [],
            creditCards: [],
            processPaymentSuccess: null,
        });
    },

    resetCartAndOrder: function() {
        this.setState({
            processPaymentResults: null,
            processPaymentSuccess: null,
            paymentMethods: [],
            cartTotalAppliedToPayments: '0.00',
            cartTotalPrice: '0.00',
            cart: []
        });
    },

    updateContactData: function(data) {

        var updatedContact = this.state.contact;

        // Basic Info
        updatedContact.Id = data.Id;
        updatedContact.FirstName = data.FirstName;
        updatedContact.LastName = data.LastName;
        updatedContact.Email = data.Email;
        updatedContact.Phone1 = data.Phone1;
        updatedContact.Phone2 = data.Phone2;

        // Billing
        updatedContact.StreetAddress1 = data.StreetAddress1;
        updatedContact.StreetAddress2 = data.StreetAddress2;
        updatedContact.City = data.City;
        updatedContact.State = data.State;
        updatedContact.PostalCode = data.PostalCode;

        // Shipping
        updatedContact.Address2Street1 = data.Address2Street1;
        updatedContact.Address2Street2 = data.Address2Street2;
        updatedContact.City2 = data.City2;
        updatedContact.State2 = data.State2;
        updatedContact.PostalCode2 = data.PostalCode2;


        this.setState({contact: updatedContact});
    },

    handleTabSelect(key) {
        console.log('selected ' + key);
        this.setState({key});
    },

    handleNextTab() {
        var nextTabKey = Number(this.state.key) + Number(1);
        this.setState({key: nextTabKey});
    },

    handleContactSearch: function(e) {

        e.preventDefault();

        this.resetContactSearchSelectionOrder();

        this.setState({searchStatus: 2});

        var contactIdentifier = this.state.contactSearchInput;

        this.disableApplication();

        $.ajax({
            url: "/contacts/find/"+contactIdentifier,
            type: 'POST',
            dataType: 'json',
            cache: false,
            success: function(data) {

                this.setState({searchStatus: 1});

                this.enableApplication();

                if(data.length === 1) {

                    this.updateContactData(data[0]);
                    this.setState({profileFormHasBeenAutoPopd: true});

                    this.setState({searchError: false});
                    this.setState({contactSearchResults: data});
                    this.setState({hasMultipleContactSearchResults: false});
                    this.setState({hasSingleContactSearchResult: true});

                }
                else if(data.length > 1) {
                    this.setState({searchError: false});
                    this.setState({contactSearchResults: data});
                    this.setState({hasMultipleContactSearchResults: true});
                    this.setState({hasSingleContactSearchResult: false});

                } else {
                    this.setState({hasSingleContactSearchResult: false});
                    this.setState({hasMultipleContactSearchResults: false});
                    this.setState({searchError: true});
                    this.setState({searchErrorMessage: 'no contacts were found, please create a new contact using the form below.'});
                }

            }.bind(this),
            error: function(xhr, status, err) {
                this.setState({searchStatus: 1});
                this.enableApplication();
                console.log(xhr);
                console.log(status);
                console.log(err);
                this.setState({hasSingleContactSearchResult: false});
                this.setState({hasMultipleContactSearchResults: false});
                this.setState({searchError: true});
                this.setState({searchErrorMessage: 'there was an error with the search, please refresh page and try again'});
            }.bind(this)
        });
    },

    handleSameBillingAddress: function(val) {
        this.setState({isSameBillingAddress: val});
    },

    /**
     * Updates the states in the model data for given fields of the model
     * @param data array
     */
    updateModelState: function(data) {
        // make a copy of the model
        var updatedModelData = this.state.contact;
        // check if we are updating 1 or all
        for (var k in data) {
            if (data.hasOwnProperty(k)) {
                updatedModelData[k] = data[k];
            }
        }
        this.setState({contact: updatedModelData});
    },

    updateModelData: function() {

        // Show that we are currently saving the data to infusionsoft
        this.setState({contactDetailsSaveStatus: 2});

        // Since our contact state is in-sync with the form, we can use the state instead of
        // pulling values from the form inputs
        var data = this.state.contact;

        // Use same shipping & billing address if checkbox selected
        if (data && this.state.isSameBillingAddress) {
            data.Address2Street1 = data.StreetAddress1;
            data.Address2Street2 = data.StreetAddress2;
            data.City2 = data.City;
            data.State2 = data.State;
            data.PostalCode2 = data.PostalCode;
        }

        // Check if we are dealing with an existing infusionsoft contact
        if (this.state.contact.Id) {
            // Laravel uses the PUT method to call the 'update' method on its resourceful controlers
            data._method = 'PUT';
            var url = "contacts/" + this.state.contact.Id;
        } else {
            // Create a new contact using the 'store' method on the laravel controller
            var url = "contacts";
        }

        this.disableApplication();

        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: data,
            cache: false,
            success: function(data) {

                this.setState({contactDetailsSaveStatus: 1});
                this.enableApplication();
                this.setState({formSaveError: false});
                setTimeout(function() { this.setState({key: 2}); }.bind(this), 500);
                console.log(data);

            }.bind(this),
            error: function(xhr, status, err) {
                this.setState({contactDetailsSaveStatus: 1});
                this.enableApplication();
                this.setState({formSaveError: true});
                this.setState({formSaveErrorMessage: 'there was an error with the search, please refresh page and try again'});
                console.log(xhr);
                console.log(status);
                console.log(err);
            }.bind(this)
        });
    },
    handleSearchInputChange: function(e) {
        this.setState({contactSearchInput: e.target.value});
    },

    newCreditCard: function() {

    },

    removeCreditCardFromOrder: function(cardData) {

        this.removeFromPaymentMethods(cardData);
    },

    removeFromPaymentMethods: function(item) {
        // Copy the current state of paymentMethods
        var paymentMethods = this.state.paymentMethods;

        var updatedPaymentMethods = paymentMethods.filter(function(paymentMethod) {
            return paymentMethod.Id !== item.Id;
        });

        var totalAppliedToPayments = '0.00';

        updatedPaymentMethods.map(function(paymentMethod) {
            totalAppliedToPayments = money.add(money.floatToAmount(totalAppliedToPayments), money.floatToAmount(paymentMethod.amount));
        });

        // Update the state
        this.setState({
            paymentMethods: updatedPaymentMethods,
            cartTotalAppliedToPayments: money.floatToAmount(totalAppliedToPayments)
        });
    },

    updatePaymentMethodAmount: function(paymentMethodToUpdate, newAmount) {

        if (newAmount >= 0) {
            // Snapshot of current state
            var currentMethods = this.state.paymentMethods;

            // find a match that we are attempting to update the amount of
            currentMethods.map(function (paymentMethod) {
                if (paymentMethod.Id == paymentMethodToUpdate.Id) {
                    paymentMethod.amount = newAmount;
                }
            }.bind(this));

            var totalAppliedToPayments = '0.00';

            currentMethods.map(function(paymentMethod) {
                totalAppliedToPayments = money.add(money.floatToAmount(totalAppliedToPayments), money.floatToAmount(paymentMethod.amount));
            });

            if (Number(totalAppliedToPayments) <= Number(this.state.cartTotalPrice)) {
                this.setState({
                    paymentMethods: currentMethods,
                    cartTotalAppliedToPayments: money.floatToAmount(totalAppliedToPayments)
                });
            }
        }
    },

    getCreditCards: function(contactId) {

        console.log('fetching credit cards');

        var url = "/invoice/getCreditCards/"+contactId;

        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({creditCards: data});
                console.log(this.state.creditCards);
            }.bind(this),
            error: function(xhr, status, err) {
                console.log(xhr);
                console.log(status);
                console.log(err);
            }.bind(this)
        });
    },

    appendChargeDataToPaymentMethodsObj: function() {

    },

    /**
     * Process the entire order
     **/
    processPayment: function() {

        // check to ensure no balance on order
        if(! this.state.contact.Id) {

            this.setState({processPaymentResults: "You must select or create a contact in Step 1"});
            return;

        } else if (this.state.cartTotalPrice <= 0) {

            this.setState({processPaymentResults: "The cart is empty"});
            return;

        } else if (this.state.cartTotalPrice > this.state.cartTotalAppliedToPayments) {

            this.setState({processPaymentResults: "There is still a balance on this order. Please add a card/cash/check to cover the total amount of the order."});
            return;
        }

        // In case there was already a notice showing from the previous 'process payment' attempt made
        this.setState({
            processPaymentResults: null,
            processPaymentSuccess: null,
        });

        // change button to Processing state
        this.setState({processPaymentButtonStatus: 2});
        this.disableApplication();

        // set up the POST data
        var data = {
            'invoiceId': this.state.invoiceId,
            'contact': this.state.contact,
            'cart': this.state.cart,
            'paymentMethods': this.state.paymentMethods
        };

        console.log(data);

        $.ajax({
            url: '/invoice/processorder',
            type: 'POST',
            dataType: 'json',
            data: data,
            cache: false,
            success: function(data) {

                this.setState({processPaymentButtonStatus: 1});
                if( ! data.success ) {
                    this.enableApplication();
                }
                this.setState({invoiceId: data.invoiceId});
                // Store the overall success of the invoicing
                this.setState({processPaymentSuccess: data.success});
                // Update the state of the paymentMethods
                this.setState({paymentMethods: data.paymentMethods});
                console.log(data);

            }.bind(this),
            error: function(data) {

                this.setState({processPaymentButtonStatus: 1});
                this.enableApplication();
                console.log('processorder ajax call failed');
                console.log(data);
                //this.setState({processPaymentResults: err});

            }.bind(this)
        });
    },

    render() {
        return (
            <Tabs className="pos-app" activeKey={this.state.key} onSelect={this.handleTabSelect} id="controlled-tab-example">
                <Tab eventKey={1} title="1. Find or Create Contact">
                    <hr />
                    <div className="col-sm-12">
                        <CustomerLookup
                            selectedContactId={this.state.selectedContactId}
                            handleContactSelection={this.handleContactSelection}
                            handleContactSearch={this.handleContactSearch}
                            handleStartOver={this.handleTotalStartOver}
                            handleSearchInputChange={this.handleSearchInputChange}
                            contactSearchInputVal={this.state.contactSearchInput}
                            searchButtonStatus={this.state.searchStatus}
                            hasError={this.state.searchError}
                            searchErrorMessage={this.state.searchErrorMessage}
                            contactSearchResults={this.state.contactSearchResults}
                            hasMultipleContactSearchResults={this.state.hasMultipleContactSearchResults}
                            hasSingleContactSearchResult={this.state.hasSingleContactSearchResult}
                            universalApplicationDisabled={this.state.universalApplicationDisabled}
                        />
                    </div>
                    <div className="col-sm-12">
                        <hr />
                        <h3>{(this.state.profileFormHasBeenAutoPopd) ? "Confirm or Edit Customer Details" : "Enter details for new customer"}</h3>
                        <ProfileForm
                            profileFormHasBeenAutoPopd={this.state.profileFormHasBeenAutoPopd}
                            updateModelData={this.updateModelData}
                            updateModelState={this.updateModelState}
                            handleSameBillingAddress={this.handleSameBillingAddress}
                            isSameBillingAddress={this.state.isSameBillingAddress}
                            contact={this.state.contact}
                            formSaveStatus={this.state.contactDetailsSaveStatus}
                            saveButtonText={(this.state.profileFormHasBeenAutoPopd) ? "Confirm and Continue" : "Save and Continue"}
                            universalApplicationDisabled={this.state.universalApplicationDisabled}
                        />
                    </div>
                </Tab>
                <Tab eventKey={2} title="2. Select Product (s)">
                    <div className="row">
                        <div className="col-sm-5">
                            <ProductSelection
                                products={this.state.products}
                                contact={this.state.contact}
                                onAddToCart={this.addToCart}
                                universalApplicationDisabled={this.state.universalApplicationDisabled}
                            />
                        </div>
                        <div className="col-sm-2 text-left">
                        </div>
                        <div className="col-sm-5">
                            <Cart
                                handleQuantityChange={this.cartQuantityChange}
                                onRemoveFromCart={this.removeFromCart}
                                cart={this.state.cart}
                                handleNextStep={this.handleNextTab}
                                totalPrice={this.state.cartTotalPrice}
                                actionButton={true}
                                actionButtonFunction={this.handleNextTab}
                                actionButtonText="Go"
                                universalApplicationDisabled={this.state.universalApplicationDisabled}
                            />
                        </div>
                        {/*(this.props.contact.Id) ? productSelect : warningMessage*/}
                    </div>


                </Tab>
                <Tab eventKey={3} title="3. Process Payment">

                    <div>
                        <div className="row">
                            <div className="col-sm-4">
                                <CreditCards
                                    creditCards={this.state.creditCards}
                                    handleNewCreditCard={this.newCreditCard}
                                    handleAddCreditCardToOrder={this.addCreditCardToOrder}
                                    universalApplicationDisabled={this.state.universalApplicationDisabled}
                                />
                            </div>
                            <div className="col-sm-3">
                            </div>
                            <div className="col-sm-5">
                                <Cart
                                    handleQuantityChange={this.cartQuantityChange}
                                    onRemoveFromCart={this.removeFromCart}
                                    cart={this.state.cart}
                                    handleNextStep={this.handleNextTab}
                                    totalPrice={this.state.cartTotalPrice}
                                    actionButton={false}
                                    actionButtonFunction={this.handleNextTab}
                                    actionButtonText="Process Payment"
                                    universalApplicationDisabled={this.state.universalApplicationDisabled}
                                />
                            </div>
                        </div>

                        <div className="row">

                            <div className="col-sm-12">
                                <Payments
                                    paymentMethods={this.state.paymentMethods}
                                    updatePaymentMethodAmount={this.updatePaymentMethodAmount}
                                    totalPrice={this.state.cartTotalPrice}
                                    totalAppliedToPayments={this.state.cartTotalAppliedToPayments}
                                    handleRemoveCreditCardFromOrder={this.removeCreditCardFromOrder}
                                    handleAddManualPaymentToOrder={this.addManualPaymentToOrder}
                                    handleProcessPayment={this.processPayment}
                                    processPaymentButtonStatus={this.state.processPaymentButtonStatus}
                                    processPaymentSuccess={this.state.processPaymentSuccess}
                                    universalApplicationDisabled={this.state.universalApplicationDisabled}
                                    handleTotalStartOver={this.handleTotalStartOver}
                                    handleSoftStartOver={this.handleSoftStartOver}
                                />
                            </div>

                        </div>
                    </div>
                </Tab>
            </Tabs>
        );
    }
});

var MainApp =React.createClass({
    render: function() {
        return (
            <div className="container">
                <div className="col-sm-12">
                    <App />
                </div>
            </div>
        );
    }
});

ReactDOM.render(<MainApp />, document.getElementById('App'));