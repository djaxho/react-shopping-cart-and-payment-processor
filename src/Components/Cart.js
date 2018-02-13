import React from 'react';
import money from 'money-math';

var Cart = React.createClass({

    handleQuantityChange: function(productId, e) {

        this.props.handleQuantityChange(productId, e.target.value);
    },

    onRemoveFromCart: function($productId) {
        this.props.onRemoveFromCart($productId);
    },

    render : function() {

        var placeholder =
                <tr>
                    <td colSpan="5">Cart is empty</td>
                </tr>
            ;

        var cartNodes = this.props.cart.map(function(product) {
            return (
                <tr key={product.id}>
                    <td data-th="Product">
                        <div className="row">
                            <div className="col-sm-12">
                                <span className="cart-product-text">{product.title}</span>
                            </div>
                        </div>
                    </td>
                    <td data-th="Price">
                        <span className="cart-product-text">${money.format("USD", money.floatToAmount(product.price))}</span>
                    </td>
                    <td data-th="Quantity">
                        <input
                            type="number"
                            className="form-control text-center"
                            value={product.quantity}
                            onChange={this.handleQuantityChange.bind(this, product.id)}
                            disabled={this.props.universalApplicationDisabled}
                        />
                    </td>
                    <td data-th="Subtotal" className="text-center">
                        <span className="cart-product-text">{money.format("USD", money.mul(money.floatToAmount(product.price), money.floatToAmount(product.quantity)))}</span>
                    </td>
                    <td className="actions text-right" >
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={this.props.onRemoveFromCart.bind(null, product.id)}
                            disabled={this.props.universalApplicationDisabled}
                        >
                            <i className="fa fa-trash-o"></i>
                        </button>
                    </td>
                </tr>
            );
        }, this);

        var actionButtonNode =

            <button
                disabled={this.props.cart.length < 1}
                onClick={(this.props.cart.length > 0) ? this.props.actionButtonFunction : null}
                className="btn btn-success btn-block"
                title={(this.props.cart.length < 1) ? "You must add items to cart before continuing" : null}
                disabled={this.props.universalApplicationDisabled}
            >
                {this.props.actionButtonText} <i className="fa fa-angle-right"></i>
            </button>
            ;

        return (
            <div>
                <h3>Shopping Cart</h3>
                <table className="cart table table-hover table-condensed">
                    <thead>
                        <tr>
                            <th style={{width: "50%"}}>Product</th>
                            <th style={{width: "10%"}}>Price</th>
                            <th style={{width: "5%"}}>Quantity</th>
                            <th style={{width: "30%"}} className="text-center">Subtotal</th>
                            <th style={{width: "5%"}}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {(this.props.cart.length > 0) ? cartNodes : placeholder}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="3" className="hidden-xs"></td>
                            <td className="hidden-xs text-center"><span className="cart-product-text"><strong>Total ${money.format("USD", money.floatToAmount(this.props.totalPrice))}</strong></span></td>
                            <td>
                                {(this.props.actionButton) ? actionButtonNode : ''}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        );
    }
})

export default Cart
