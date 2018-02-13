import React from 'react';
import ProcessingButton from './ProcessingButton'

var ProfileForm = React.createClass({
    getInitialState: function() {
        return {
            saveButtonStatus: 'save',
            focusFirstInput: false
        };
    },
    handleEmailChange: function(e) {
        this.props.updateModelState({Email: e.target.value});
    },
    handleFirstNameChange: function(e) {
        this.props.updateModelState({FirstName: e.target.value});
    },
    handleLastNameChange: function(e) {
        this.props.updateModelState({LastName: e.target.value});
    },
    handlePhone1Change: function(e) {
        this.props.updateModelState({Phone1: e.target.value});
    },
    handlePhone2Change: function(e) {
        this.props.updateModelState({Phone2: e.target.value});
    },
    handleStreetAddress1Change: function(e) {
        this.props.updateModelState({StreetAddress1: e.target.value});
    },
    handleStreetAddress2Change: function(e) {
        this.props.updateModelState({StreetAddress2: e.target.value});
    },
    handleCityChange: function(e) {
        this.props.updateModelState({City: e.target.value});
    },
    handleStateChange: function(e) {
        this.props.updateModelState({State: e.target.value});
    },
    handlePostalCodeChange: function(e) {
        this.props.updateModelState({PostalCode: e.target.value});
    },
    handleAddress2Street1Change: function(e) {
        this.props.updateModelState({Address2Street1: e.target.value});
    },
    handleAddress2Street2Change: function(e) {
        this.props.updateModelState({Address2Street2: e.target.value});
    },
    handleCity2Change: function(e) {
        this.props.updateModelState({City2: e.target.value});
    },
    handleState2Change: function(e) {
        this.props.updateModelState({State2: e.target.value});
    },
    handlePostalCode2Change: function(e) {
        this.props.updateModelState({PostalCode2: e.target.value});
    },
    handleBillingAddressCheckbox: function(e) {
        this.props.handleSameBillingAddress(e.target.checked);
    },

    handleSubmit: function(e)
    {
        e.preventDefault();

        this.props.updateModelData();
    },
    componentDidUpdate: function(prevProps, prevState) {

        if((prevProps.profileFormHasBeenAutoPopd === false) && this.props.profileFormHasBeenAutoPopd){
            this._input.focus();
        }

    },
    render: function() {
        return (
            <form className="form-horizontal" onSubmit={this.handleSubmit}>
                <h5>General Info</h5>
                <div className="form-group">
                    <label for="FirstName" className="col-sm-1 control-label">Name</label>
                    <div className="col-sm-3">
                        <input  type="text"
                                className="form-control input-lg"
                                id="FirstName"
                                name="FirstName"
                                placeholder="First"
                                value={this.props.contact.FirstName}
                                onChange={this.handleFirstNameChange}
                                ref={(c) => this._input = c}
                                required
                                disabled={this.props.universalApplicationDisabled}
                        />
                    </div>
                    <div className="col-sm-3">
                        <input  type="text" className="form-control input-lg" id="LastName" name="LastName" placeholder="Last"
                                value={this.props.contact.LastName}
                                onChange={this.handleLastNameChange}
                                required
                                disabled={this.props.universalApplicationDisabled}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label for="Email" className="col-sm-1 control-label">Email</label>
                    <div className="col-sm-6">
                        <input type="Email" className="form-control input-lg" id="Email" name="Email" placeholder="Email Address"
                               value={this.props.contact.Email}
                               onChange={this.handleEmailChange}
                               required
                               disabled={this.props.universalApplicationDisabled}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label for="Phone1" className="col-sm-1 control-label">Phone 1</label>
                    <div className="col-sm-6">
                        <input  type="tel" className="form-control input-lg" id="Phone1" name="Phone1" placeholder="Primary Phone Number"
                                value={this.props.contact.Phone1}
                                onChange={this.handlePhone1Change}
                                required
                                disabled={this.props.universalApplicationDisabled}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label for="Phone2" className="col-sm-1 control-label">Phone 2</label>
                    <div className="col-sm-6">
                        <input  type="tel" className="form-control input-lg"
                                id="Phone2" name="Phone2"
                                placeholder="Secondary Phone Number"
                                value={this.props.contact.Phone2}
                                onChange={this.handlePhone2Change}
                                disabled={this.props.universalApplicationDisabled}
                        />
                    </div>
                </div>
                <h5>Billing Address</h5>
                <div className="form-group">
                    <label for="StreetAddress1" className="col-sm-1 control-label">Street</label>
                    <div className="col-sm-4">
                        <input  type="text" className="form-control input-lg"
                                id="StreetAddress1" name="StreetAddress1"
                                placeholder="Street Address"
                                value={this.props.contact.StreetAddress1}
                                onChange={this.handleStreetAddress1Change}
                                required
                                disabled={this.props.universalApplicationDisabled}
                        />
                    </div>
                    <div className="col-sm-2">
                        <input  type="text" className="form-control input-lg"
                                id="StreetAddress2"
                                name="StreetAddress2"
                                placeholder="#"
                                value={this.props.contact.StreetAddress2}
                                onChange={this.handleStreetAddress2Change}
                                disabled={this.props.universalApplicationDisabled}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label for="City" className="col-sm-1 control-label">City</label>
                    <div className="col-sm-2">
                        <input  type="text" className="form-control input-lg"
                                id="City"
                                name="City"
                                placeholder="City"
                                value={this.props.contact.City}
                                onChange={this.handleCityChange}
                                required
                                disabled={this.props.universalApplicationDisabled}
                        />
                    </div>
                    <div className="col-sm-2">
                        <select name="State" id="State" className="form-control input-lg"
                                value={this.props.contact.State}
                                onChange={this.handleStateChange}
                                required
                                disabled={this.props.universalApplicationDisabled}
                        >
                            <option value="" defaultValue disabled>State</option>
                            <option value="NY">NY</option>
                            <option value="CA">CA</option>
                        </select>
                    </div>
                    <div className="col-sm-2">
                        <input  type="text" className="form-control input-lg" id="PostalCode" name="PostalCode" placeholder="Zip"
                                value={this.props.contact.PostalCode}
                                onChange={this.handlePostalCodeChange}
                                required
                                disabled={this.props.universalApplicationDisabled}
                        />
                    </div>
                </div>
                <input
                    onChange={this.handleBillingAddressCheckbox}
                    type="checkbox"
                    name="billing"
                    value="billing"
                    checked={this.props.isSameBillingAddress}
                    disabled={this.props.universalApplicationDisabled}
                /> Billing address same as shipping address?
                <div className={(this.props.isSameBillingAddress) ? 'hidden' : null}>
                    <h5>Shipping Address</h5>
                    <div className="form-group">
                        <label for="Address2Street1" className="col-sm-1 control-label">Street</label>
                        <div className="col-sm-4">
                            <input  type="text" className="form-control input-lg" id="Address2Street1" name="Address2Street1" placeholder="Street Address"
                                    value={this.props.contact.Address2Street1}
                                    onChange={this.handleAddress2Street1Change}
                                    disabled={this.props.universalApplicationDisabled}
                            />
                        </div>
                        <div className="col-sm-2">
                            <input  type="text" className="form-control input-lg" id="Address2Street2" name="Address2Street2" placeholder="#"
                                    value={this.props.contact.Address2Street2}
                                    onChange={this.handleAddress2Street2Change}
                                    disabled={this.props.universalApplicationDisabled}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label for="City2" className="col-sm-1 control-label">City</label>
                        <div className="col-sm-2">
                            <input  type="text" className="form-control input-lg" id="City2" name="City2" placeholder="City"
                                    value={this.props.contact.City2}
                                    onChange={this.handleCity2Change}
                                    disabled={this.props.universalApplicationDisabled}
                            />
                        </div>
                        <div className="col-sm-2">
                            <select name="State" id="State2" className="form-control input-lg"
                                    value={this.props.contact.State2}
                                    onChange={this.handleState2Change}
                                    disabled={this.props.universalApplicationDisabled}
                            >
                                <option value="" defaultValue disabled>State</option>
                                <option value="NY">NY</option>
                                <option value="CA">CA</option>
                            </select>
                        </div>
                        <div className="col-sm-2">
                            <input  type="text" className="form-control input-lg" id="PostalCode2" name="PostalCode2" placeholder="Zip"
                                    value={this.props.contact.PostalCode2}
                                    onChange={this.handlePostalCode2Change}
                                    disabled={this.props.universalApplicationDisabled}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-7 text-right">
                        <ProcessingButton
                            buttonStatus={this.props.formSaveStatus} // 1 (initial), 2 (processing), 3 (processed)
                            disabled={this.props.universalApplicationDisabled}
                            buttonClassName="btn btn-default btn-lg"
                            initialIconClassName="fa fa-floppy-o"
                            initialButtonText={this.props.saveButtonText}
                            processingIconClassName="fa fa-circle-o-notch fa-spin"
                            processingButtonText="Saving..."
                            completedIconClassName="fa fa-check"
                            completedButtonText="Saved"
                        />
                    </div>
                </div>

            </form>
        );
    }
})

export default ProfileForm