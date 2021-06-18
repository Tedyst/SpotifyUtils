import React from 'react';
import {
    makeStyles,
    Container,
    Typography,
    TextField,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    Button,
} from '@material-ui/core';
import {
    Link,
    Redirect,
} from 'react-router-dom';
import Avatar from '../Avatar';
import { NoUsernameCompareInterface } from './CompareInterfaces';

function copyToClipboard() {
    const copyText = document.getElementById('link-to-be-copied') as HTMLInputElement;

    if (copyText === null) {
        return;
    }
    copyText.select();
    copyText.setSelectionRange(0, 99999);

    document.execCommand('copy');
}

function getLink(code: string) {
    return `${window.location.protocol}//${window.location.host}/compare/${code}`;
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        position: 'relative',
        overflow: 'auto',
        maxHeight: 400,
        backgroundColor: theme.palette.background.paper,
        'color-scheme': 'dark',
    },
    spacer: {
        height: 100,
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    grid: {
        width: '100%',
        marginTop: '10px',
    },
    selected: {
        color: theme.palette.info.light,
    },
}));

export default function NoUsername(props: {
    compare: NoUsernameCompareInterface | undefined,
    enableRedirect?: boolean,
}) {
    const classes = useStyles();
    const [Word, setWord] = React.useState<string>();
    const [RedirectURL, setRedirectURL] = React.useState<string>();
    const { compare, enableRedirect } = props;
    if (compare === undefined) {
        return null;
    }
    if (RedirectURL !== undefined && enableRedirect) {
        let url = `/compare/${String(RedirectURL)}`;
        if (String(RedirectURL).includes('/compare/')) {
            url = `/compare/${String(RedirectURL).split('/compare/')[1]}`;
        }
        return <Redirect to={url} />;
    }
    const friends: any[] = [];
    if (compare.Friends !== null) {
        Object.values(compare.Friends).forEach((value) => {
            friends.push(
                <ListItem
                    classes={{
                        root: classes.selected,
                    }}
                    component={Link}
                    key={`friend-${value.Username}`}
                    to={`/compare/${value.Code}`}
                >
                    <Avatar image={value.Image} name={value.Name} />
                    <ListItemText
                        primary={value.Name}
                        secondary={value.Code}
                    />
                </ListItem>,
            );
        });
    }

    const changeWord = (event: { target: { value: string | undefined; }; }) => {
        setWord(event.target.value);
    };

    const mySubmitHandler = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (Word !== undefined) {
            setRedirectURL(Word);
        }
    };

    return (
        <>
            <Container disableGutters fixed maxWidth="md">
                <Typography align="center" color="textPrimary" variant="h4">
                    Your code is
                    {' '}
                    <b>
                        {compare.Code}
                    </b>
                </Typography>
                <Typography align="center" color="textSecondary" variant="h5">
                    Send it to your friends and compare your music taste to theirs!
                </Typography>
                <br />
                <br />
                <TextField
                    InputProps={{
                        readOnly: true,
                    }}
                    fullWidth
                    id="link-to-be-copied"
                    label="Click to copy"
                    onClick={() => { copyToClipboard(); }}
                    value={getLink(compare.Code)}
                    variant="outlined"
                />

            </Container>
            <Container maxWidth="xs">
                <form
                    className={classes.form}
                    noValidate
                    onSubmit={mySubmitHandler}
                >
                    <TextField
                        className={classes.grid}
                        defaultValue={Word}
                        id="standard-basic"
                        label="Enter an user code to compare to it"
                        onChange={changeWord}
                        variant="outlined"
                    />
                    <Button
                        className={classes.submit}
                        color="primary"
                        fullWidth
                        type="submit"
                        variant="contained"
                    >
                        Search
                    </Button>
                </form>
            </Container>
            <Container className={classes.spacer}>
                <br />
            </Container>
            <Container disableGutters fixed maxWidth="xs">
                <List className={classes.root} disablePadding subheader={<li />}>
                    <ListSubheader color="default">
                        Your friends
                    </ListSubheader>
                    <ul>
                        {friends}
                    </ul>
                </List>
            </Container>
        </>
    );
}

NoUsername.defaultProps = {
    enableRedirect: true,
};
