import React from "react";
import "./Stripe.scss";
import client from "../../utils/mqtt";

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
        console.log(`Subscribing to: ${this.props.topic}`)
        client.subscribe(`${this.props.topic}/v`, function (err) {
            if (err) {
                console.log("Something went wrong when subscribing to the topic.", err)
            }
        });

        client.on('message', (topic, message) => {
            if (topic.indexOf(this.props.topic) > -1) {
                console.log(topic);
                this.setState({ currentValue: Number.parseInt(message, 10) })
            }
        })

        client.publish(`${this.props.topic}/g`, "0");
    };

    handleClick = (type) => {
        switch (type) {
            case "toggle":
                console.log("toggle");
                client.publish(`${this.props.topic}/t`, "0");
                break;

            case "on":
                console.log("toggle");
                client.publish(`${this.props.topic}/u`, "0");
                break;

            case "off":
                console.log("toggle");
                client.publish(`${this.props.topic}/d`, "0");
                break;
            default:
                break;
        }
    }

    handleManualValue(event) {
        console.log(event.target.value);
        client.publish(`${this.props.topic}/s`, event.target.value.toString());
    }

    render() {
        if (this.state.currentValue !== null) {
            return (
                <div className="stripe">
                    <h3>{this.props.topic}</h3>
                    <h4>{this.state.currentValue}</h4>
                    <div className="buttons">
                        <button onClick={() => this.handleClick("toggle")}>TOGGLE</button>
                        <button onClick={() => this.handleClick("on")}>ON</button>
                        <button onClick={() => this.handleClick("off")}>OFF</button>
                        <input type="range" min="0" max="4095" onChange={this.handleManualValue} ></input>
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