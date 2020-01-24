
const getConfig = function (network) {
    const { config } = require(`./${network.toLowerCase()}`);
    console.log(`Loading configuration for network '${network}' / ${config.name}.`);
    return config;
};

export function getCurrentConfig () {
    const currentNetwork = process.env.REACT_APP_DEFAULT_NETWORK;
    if(currentNetwork === undefined) {
        throw new Error(`Please set REACT_APP_DEFAULT_NETWORK value in your .env file.`);
    }
    return getConfig(currentNetwork.toLowerCase());
};