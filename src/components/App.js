import React from "react";
import "./App.scss";

import Stripe from "./stripe/Stripe";

export default class App extends React.Component {
    render() {
        return (
            <div className="container">
                <Stripe topic={"kitchen/sink"} />
                <Stripe topic={"kitchen/wine"} />
                <Stripe topic={"bathroom/shower"} />
                <Stripe topic={"bathroom/mirror"} />
            </div>
        );
    }
}