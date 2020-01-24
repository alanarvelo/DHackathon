import { withStyles } from '@material-ui/styles';
import React from 'react';
import Color from 'color';
import { Button, Flex, Heading, Box, MetaMaskButton, UPortButton, } from "rimble-ui";

class MetamaskLocked extends React.Component {
    render() {
        const { classes, network } = this.props;
        console.log(network);
        return (
            <div className={classes.wrapper}>
                <div className={classes.inner}>
					<header className={classes.header}>
						<h1></h1>
                    <p>Sign-in with your preferred wallet or identity provider</p>
                    </header>
                    <Flex width={1} style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}} >
                        <Box width={1/3} className={classes.box}>
                            <Button disabled>
                                Connect with Blockstack
                            </Button>
                            <p style={{fontSize: 10}}>coming soon</p>
                        </Box>
                        <Box width={1/3} className={classes.boxV}>
                            <MetaMaskButton.Solid onClick={() => this.props.onClick()}>
                                Connect with MetaMask
                            </MetaMaskButton.Solid>
                        </Box>
                        <Box width={1/3} className={classes.box}>
                            <UPortButton.Solid disabled>
                                Connect with Uport
                            </UPortButton.Solid>
                            <p style={{fontSize: 10}}>coming soon</p>
                        </Box>
                    </Flex>
                </div>
            </div>
        );
    }
}

const styles = theme => ({
    wrapper: {
        padding: '6rem 0 4rem 0',
    },
    inner: {
        margin: '0 auto',
		maxWidth: 'calc(100% - 10rem)',
        width: '80rem',
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
    },
    header: {
        borderBottom: '1px solid',
		margin: '0 auto 2rem auto',
		maxWidth: '80%',
		textAlign: 'center',
		width: '45.7142857143rem',
        '& h1': {
            fontSize: '3rem',
            fontFamily: "'Fjalla One', sans-serif",
            fontWeight: 400,
            lineHeight: 1.5,
            margin: '0 0 1.5rem 0',
            textTransform: 'uppercase',
            letterSpacing: '0.25rem',
        },
        '& p': {
            fontSize: '1.5rem',
            color: '#4468ca',
        },
    },
    div: {
	    display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        borderRadius: '5px',
        textAlign: 'center',
        margin: 0
    },
    box: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    boxV: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    }
});

export default withStyles(styles)(MetamaskLocked);
