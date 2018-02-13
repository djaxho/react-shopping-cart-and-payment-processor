import React from 'react';

import ProcessingButton from './ProcessingButton'
import ContactList from './ContactList'

var CustomerLookup = React.createClass({

    getDefaultProps: function() {
        return {
            value: 'default value'
        };
    },

    handleFormSubmission: function(e) {

        e.preventDefault();

        this.props.handleFormSubmission(e);
    },

    handleSearchInputChange: function(e) {
        this.props.handleContactSearchInputChange(e);
    },

    render : function() {
        return (
            <div className="CustomerLookup">
                <h3>Look-up Existing Customer</h3>

                <div className="row">

                    <form onSubmit={this.props.handleContactSearch} >
                        <div className="col-sm-6">
                            <input
                                value={this.props.contactSearchInputVal}
                                className="form-control input-lg"
                                required
                                onChange={this.props.handleSearchInputChange}
                                id="contactSearch"
                                name="contactSearch"
                                placeholder="Enter customer Contact Id, Email, or Name"
                                disabled={this.props.universalApplicationDisabled}
                            />
                        </div>
                        <div className="col-sm-6 text-left">
                            <ProcessingButton
                                buttonStatus={this.props.searchButtonStatus} // 1 (initial), 2 (processing), 3 (processed)
                                disabled={this.props.universalApplicationDisabled}
                                buttonClassName="btn btn-default btn-lg"
                                initialIconClassName="fa fa-search"
                                initialButtonText="Search"
                                processingIconClassName="fa fa-circle-o-notch fa-spin"
                                processingButtonText="Searching..."
                                completedIconClassName="fa fa-check"
                                completedButtonText="Saved"
                            />
                            <button
                                onClick={this.props.handleStartOver}
                                className="btn btn-default btn-lg"
                                style={{'marginLeft': "6px"}}
                                disabled={this.props.universalApplicationDisabled}
                            >
                                Start Over
                            </button>
                        </div>
                    </form>

                </div>
                <div className={this.props.hasError ? "row" : "hidden" } >
                    <div className="col-sm-12 contact-search-status-msg">
                        <div className="alert alert-warning" role="alert">
                            <strong>Sorry</strong>, {this.props.searchErrorMessage}
                        </div>
                    </div>
                </div>

                <div className={this.props.hasMultipleContactSearchResults ? "row" : "hidden" }>
                    <div className="col-sm-12 multiple-results-msg">
                        Found {this.props.contactSearchResults.length} contacts that match your criteria. Please click one below:
                        <hr />
                    </div>
                    <div className="col-sm-12">
                        <ContactList
                            contacts={this.props.contactSearchResults}
                            handleContactSelection={this.props.handleContactSelection}
                            selectedContactId={this.props.selectedContactId}
                        />
                    </div>
                </div>

                <div className={this.props.hasSingleContactSearchResult ? "row" : "hidden" }>
                    <div className="col-sm-12 contact-search-status-msg">
                        <div className="alert alert-success" role="alert">
                            <strong>Success</strong>, the contact info below has been automatically filled out. Please verify the info and continue to next step
                        </div>
                    </div>
                </div>
           </div>
        );
    }
})

export default CustomerLookup
