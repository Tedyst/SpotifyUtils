import React from 'react';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, } from '@material-ui/core/styles';
interface RadialBarProps {
    values: number[],
};
const RadialBar: React.SFC<RadialBarProps> = ({
    values
}) => {
    const useStyles = makeStyles(theme => ({
        root: {
            display: 'grid',
            alignItems: 'center',
            padding: theme.spacing(2),
        },
        circle: {
            gridRow: 1,
            gridColumn: 1,
            display: 'grid',
            alignItems: 'center',
            height: '100%',
            width: '100%',
        },
        bar: {
            gridRow: 1,
            gridColumn: 1,
            margin: '0 auto',
            zIndex: 1,
        },
        track: {
            gridRow: 1,
            gridColumn: 1,
            margin: '0 auto',
            color: theme.palette.action.hover,
        },
    }));
    let max = 0;
    for (let i = 0; i < values.length; i++) {
        if (max < values[i])
            max = values[i];
    }
    const classes = useStyles();
    return (
        <Box
            className={classes.root}
        >
            {
                values.map((value: number, index: number) => {
                    const size = 100 - index / values.length * 100;
                    const newVal = value / max * 100;
                    console.log(newVal);
                    const thickness = (10 / values.length) * 10 / (10 - index * (10 / values.length));
                    return (
                        <Box
                            key={index}
                            className={classes.circle}
                        >
                            <CircularProgress
                                size={`${size}%`}
                                value={newVal}
                                thickness={thickness}
                                variant="static"
                                color="primary"
                                className={classes.bar}
                            />
                            <CircularProgress
                                size={`${size}%`}
                                value={100}
                                thickness={thickness}
                                variant="static"
                                className={classes.track}
                            />
                        </Box>
                    );
                })
            }
        </Box>
    );
};
export default RadialBar;