import DHackathonFactory from "../contracts/DHackathonFactory.json";
import DHackathon from "../contracts/DHackathon.json";


export const config = {
    maxGas: 6500000,
    confirmations: 1,
    allowChangeNetwork: true,
    network: 'unknown',
    name: 'Local Ganache',
    // explorer: {
    //     tx: 'https://ropsten.etherscan.io/tx/',
    //     address: 'https://ropsten.etherscan.io/address/'
    // },
    // urls: {
    //     backend: 'http://localhost:8080/api/v1',
    // },
    contracts: [
        {
            name: 'DHackathonFactory',
            abi: DHackathonFactory,
            address: '0x7614f5ED7B3b7e09d0D0d74Db809d6bEBC711A9D'
        },
        {
            name: 'DHackathon',
            abi: DHackathon,
            address: undefined
        }
    ]
};
