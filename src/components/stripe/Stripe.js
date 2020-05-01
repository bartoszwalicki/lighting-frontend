import React from "react";
import "./Stripe.scss";

import Toggle from 'react-toggle'
import { Slider, Paper, CircularProgress } from '@material-ui/core';

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

    handleManualValue(event, value) {
        client.publish(`${this.props.topic}/s`, value.toString());
    }

    render() {
        if (this.state.currentValue !== null) {
            return (
                <Paper className="stripe">
                    <h3>{this.props.topic}</h3>
                    <h4>{this.state.currentValue}</h4>

                    <Slider
                        className="slider"
                        defaultValue={this.state.currentValue}
                        value={this.state.currentValue}
                        step={5}
                        min={0}
                        max={4095}
                        onChangeCommitted={this.handleManualValue}
                    />


                    <Toggle
                        className="toggle"
                        checked={this.state.currentValue > 0}
                        onChange={() => this.handleClick("toggle")} />



                </Paper>
            )
        }
        return (
            <div className="stripe">
                <CircularProgress />
            </div>)
    }
}