import React from "react";
import "./Stripe.scss";
import client from "../../utils/mqtt";
import Toggle from 'react-toggle'

export default class Stripe extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            currentValue: null
        }

        this.handleManualValue = this.handleManualValue.bind(this);
    }

    componentDidMount() {
        this.getState();
    }

    getState = () => {
        client.subscribe(`${this.props.topic}/v`, function (err) {
            if (err) {
                console.log("Something went wrong when subscribing to the topic.", err)
            }
        });

        client.on('message', (topic, message) => {
            if (topic.indexOf(this.props.topic) > -1) {
                this.setState({ currentValue: Number.parseInt(message, 10) })
            }
        })

        client.publish(`${this.props.topic}/g`, "0");
    };

    handleClick = (type) => {
        switch (type) {
            case "toggle":
                client.publish(`${this.props.topic}/t`, "0");
                break;

            case "on":
                client.publish(`${this.props.topic}/u`, "0");
                break;

            case "off":
                client.publish(`${this.props.topic}/d`, "0");
                break;
            default:
                break;
        }
    }

    handleManualValue(event) {
        client.publish(`${this.props.topic}/s`, event.target.value.toString());
    }

    render() {
        if (this.state.currentValue !== null) {
            return (
                <div className="stripe">
                    <h3>{this.props.topic}</h3>
                    <h4>{this.state.currentValue}</h4>
                    <div className="buttons">

                        <input value={this.state.currentValue} type="range" min="0" max="4095" onChange={this.handleManualValue} ></input>

                        <Toggle
                            className="toggle"
                            checked={this.state.currentValue > 0}
                            onChange={() => this.handleClick("toggle")} />


                    </div>
                </div>
            )
        }
        return (
            <div className="stripe">
                <h3>Loading...</h3>
            </div>)
    }
}