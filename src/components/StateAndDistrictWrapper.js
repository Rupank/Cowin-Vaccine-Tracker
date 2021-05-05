import React, {  useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import useCowinVaccineDataRequest from '../hooks/useCowinVaccineDataRequest/';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import * as _ from 'lodash';
const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    button: {
        color: '#ffffff',
    }
}));

function StateAndDistrictWrapper({setDistrictCallback}) {
    const classes = useStyles();
    const [{ states, districts }, { getAllStatesData, getAllDistrictData }] = useCowinVaccineDataRequest();
    const [open, setOpen] = React.useState(true);
    const [state, setState] = React.useState('');
    const [district, setDistrict] = React.useState('');
    useEffect(() => {
        getAllStatesData();
    }, []);

    useEffect(() => {
        if(!open && district){
            setDistrictCallback(district);
        }
    }, [open])
    useEffect(() => {
        if (state) {
            getAllDistrictData(state);
        }
    }, [state])
    const handleStateChange = (event) => {
        setState(Number(event.target.value) || '');
    };

    const handleDistrictChange = (event) => {
        setDistrict(Number(event.target.value) || '');
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    
    let stateObject = _.find(states, (dist)=> {return dist.state_id === state})
    let districtObject = _.find(districts, (dist)=> {return dist.district_id === district})
    return (
        <div>
            <div className = "location_filter">
                <Button onClick={handleClickOpen} className = {classes.button} variant = "outlined" color="primary">
                    Change State and District 
                </Button>
                <div>State - {stateObject && stateObject.state_name}</div>
                <div>District - {districtObject && districtObject.district_name}</div>
            </div>
            <Dialog disableBackdropClick disableEscapeKeyDown open={open} onClose={handleClose}>
                <DialogTitle>Select State And District</DialogTitle>
                <DialogContent>
                    <form className={classes.container}>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="demo-dialog-native">State</InputLabel>
                            <Select
                                native
                                value={state}
                                onChange={handleStateChange}
                                input={<Input id="demo-dialog-native" />}
                            >
                                <option aria-label="None" value="" />
                                {
                                    states.map(state => (
                                        <option key={state.state_id} value={state.state_id}>{state.state_name}</option>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="demo-dialog-select-label">District</InputLabel>
                            <Select
                                native
                                value={district}
                                onChange={handleDistrictChange}
                                input={<Input />}
                            >
                                <option aria-label="None" value="" />
                                {
                                    districts.map(dis => (
                                        <option key={dis.district_id} value={dis.district_id}>{dis.district_name}</option>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
              </Button>
                    <Button onClick={handleClose} color="primary">
                        Ok
              </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default StateAndDistrictWrapper
