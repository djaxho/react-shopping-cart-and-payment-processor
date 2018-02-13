import React from 'react';

var CustomerLookup = React.createClass({

    getInitialState: function() {

        return {
            selectedProduct: ''
        };
    },

    handleProductSelect: function(e) {

        this.setState({selectedProduct: e.target.value});
    },

    handleAddToCart : function(e) {

        e.preventDefault();

        var selectedProduct = this.state.selectedProduct;

        if (!selectedProduct) {
            return;
        }

        this.props.onAddToCart(selectedProduct);

        this.setState({selectedProduct: ''});
    },

    render : function() {

        var productNodes = this.props.products.map(function(product) {
            return (
                <option key={product.id} value={product.id} >
                    {product.title}
                </option>
            );
        });

        var productSelect = (
            <select
                className="form-control input-lg"
                name="product-select"
                id="product-select"
                onChange={this.handleProductSelect}
                value={this.state.selectedProduct}
                disabled={this.props.universalApplicationDisabled}
            >
                <option defaultValue>Select Product</option>
                {productNodes}
            </select>
        );

        var warningMessage =
                <div><h5><strong>Warning</strong>, You must first select a contact or create a new one in Step 1</h5></div>
        ;

        return (

            <div>
                <h3>Add Products to Order</h3>
                <form onSubmit={this.handleAddToCart}>
                    <div className="col-sm-11">
                        {productSelect}
                    </div>
                    <div className="col-sm-1">
                        <button
                            type="submit"
                            className="btn btn-default btn-lg"
                            disabled={this.props.universalApplicationDisabled}
                        >
                            + Add
                        </button>
                    </div>
                </form>
            </div>

        );
    }
})

export default CustomerLookup
