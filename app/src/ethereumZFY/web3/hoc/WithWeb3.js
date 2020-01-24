import React, { Component } from 'react';
import _ from 'lodash';
import { getWeb3, getNetwork } from "../util/getWeb3";
import {
    MMNotFound,
    InvalidNetwork,
    Web3Loading,
    MetamaskLocked,
} from '../../metamask';
import LoadingBar from 'react-top-loading-bar';

class WithWeb3 extends Component {
    state = {
        loading: true,
        loadingWeb3: true,
        web3: undefined,
        info: {
            network: undefined,
            isEnabled: false,
            isUnlocked: false,
            networkVersion: undefined,
            onboardingComplete: false,
            isWeb3Injected: false,
            isConnected: false,
            isValidNetwork: false,
        }
    }

    createCurrentInfo = async (web3, web3State) => {
        const { network } = this.props;
        const {
            isEnabled,
            isUnlocked,
            networkVersion,
            onboardingcomplete = false,
        } = web3State;

        const publicConfigStoreState = web3.currentProvider.publicConfigStore._state;

        const info = {
            isEnabled,
            isUnlocked,
            networkVersion,
            onboardingComplete: onboardingcomplete,
            isWeb3Injected: web3 !== undefined,
            isConnected: isEnabled && onboardingcomplete, //&& isUnlocked,
            isValidNetwork: network.toUpperCase() === getNetwork(networkVersion),
            networkId: await web3.eth.net.getId(),
            network: getNetwork(networkVersion),
        }
        console.log("componentDidMount createCurrentInfo: ", info);
        return info;
    }

    async componentDidMount() {
        const web3 = await getWeb3();
        console.log("componentDidMount web3: ", web3)

        const isWeb3Injected = !_.isNull(web3) && !_.isUndefined(web3) && !_.isNull(web3.givenProvider) && !_.isUndefined(web3.givenProvider);
        console.log("componentDidMount isWeb3Injected: ", isWeb3Injected)
        if(!isWeb3Injected) {
            const info = {
                isEnabled: false,
                isUnlocked: false,
                networkVersion: undefined,
                onboardingComplete: false,
                isWeb3Injected,
                isConnected: false,
                isValidNetwork: false,
                networkId: undefined,
                network: undefined,
            };
            this.setState({
                web3,
                info,
                loading: false
            })
            return;
        }

        web3.givenProvider.publicConfigStore.on('update', async data => {
            console.log('On metamask update.');
            console.log(data);
            const info = await this.createCurrentInfo(web3, data);
            this.setState({
                ...this.state,
                info,
                loading: !info.onboardingComplete
            });
        });

       const info = await this.createCurrentInfo(web3, web3.currentProvider.publicConfigStore._state);
        
        this.setState({
            web3,
            info,
            loading: !info.onboardingComplete
        })
    }

    connectWeb3 = () => {
        window.ethereum.enable()
    };

    render() {
        const { info, loading, web3 } = this.state;
        const { isWeb3Injected, isUnlocked, isValidNetwork } = info;
        const { config } = this.props;
        const size = 'small';

        /*
        1- Metamask connected.
        2- Metamask locked.
        3- Metamask not installed.
        4- Invalid network.
        */

        if (loading || !isUnlocked){
            // Metamask locked.
            // return <Web3Loading size={size} />
            return <MetamaskLocked onClick={this.connectWeb3} size={size} />
        }

        if (!isWeb3Injected || web3 === undefined) {
            // Metamask not installed.
            return <MMNotFound onClick={this.connectWeb3} size={size} />
        }

        // if (!isUnlocked) {
        //     return <MetamaskLocked onClick={this.connectWeb3} size={size} />
        // }

        if (!isValidNetwork){
            // Invalid network.
            const networkName = this.state.info.network.toLowerCase()
            return <InvalidNetwork>
                    You are currently connected to the {networkName.charAt(0).toUpperCase() + networkName.slice(1)} network.
                    The app is expecting you to connect to the '{config.name}' network.
                    Please change networks in MetaMask.
                </InvalidNetwork>
            ;
        }

        return this.props.children({web3Cleared: true});
    }
}

export default WithWeb3;
