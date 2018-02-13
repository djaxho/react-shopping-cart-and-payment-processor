import React from 'react';

var ProcessingButton = React.createClass({

    iconClass: function() {

        switch(this.props.buttonStatus) {
            case 2:
                return this.props.processingIconClassName;
            case 3:
                return this.props.completedIconClassName;
            default:
                return this.props.initialIconClassName;
        }

    },

    buttonText: function() {

        switch(this.props.buttonStatus) {
            case 2:
                return this.props.processingButtonText;
            case 3:
                return this.props.completedButtonText;
            default:
                return this.props.initialButtonText;
        }

    },

    render: function() {

        return (
            <button
                type="submit"
                className={this.props.buttonClassName}
                disabled={this.props.disabled}
                onClick={this.props.processingCallBackMethod}
            >
                <i className={this.iconClass()}></i> {this.buttonText()}
            </button>
        );
    }
})

export default ProcessingButton