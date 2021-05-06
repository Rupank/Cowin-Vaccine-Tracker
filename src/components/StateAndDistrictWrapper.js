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
    const [open, setOpen] = React.useState(false);
    const [state, setState] = React.useState(sessionStorage.getItem('stateId') || '');
    const [district, setDistrict] = React.useState(sessionStorage.getItem('districtId') || '');
    const [age, setAge] = React.useState(0);
    useEffect(() => {
        getAllStatesData();
        if(!state || !district){
            setState('');
            setDistrict('');
            setOpen(true);
        }
    }, []);

    useEffect(() => {
        if(!open && district){
            sessionStorage.setItem('districtId',district);
            setDistrictCallback(district);
        }
    }, [open])
    useEffect(() => {
        if (state) {
            sessionStorage.setItem('stateId',state);
            getAllDistrictData(state);
        }
    }, [state])
    const handleStateChange = (event) => {
        setState(Number(event.target.value) || '');
    };

    const handleDistrictChange = (event) => {
        setDistrict(Number(event.target.value) || '');
    }

    const handleAgeChange = (event) => {
        setAge(Number(event.target.value) || '');
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    
    let stateObject = _.find(states, (dist)=> {return dist.state_id === state}) || JSON.parse(sessionStorage.getItem('stateObject'));
    if(stateObject && stateObject.state_name){
        sessionStorage.setItem('stateObject',JSON.stringify(stateObject) );
    }
    let districtObject = _.find(districts, (dist)=> {return dist.district_id === district})|| JSON.parse(sessionStorage.getItem('districtObject'));
    if(districtObject && districtObject.district_name){
        sessionStorage.setItem('districtObject',JSON.stringify(districtObject) );
    }
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
                <DialogTitle>Select State, District</DialogTitle>
                <DialogContent>
                    <form className={classes.container}>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="state-dropdown-label">State</InputLabel>
                            <Select
                                native
                                value={state}
                                onChange={handleStateChange}
                                input={<Input id="state-dropdown" />}
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
                            <InputLabel htmlFor="district-dropdown-label">District</InputLabel>
                            <Select
                                native
                                value={district}
                                onChange={handleDistrictChange}
                                input={<Input id="district-dropdown"/>}
                            >
                                <option aria-label="None" value="" />
                                {
                                    districts.map(dis => (
                                        <option key={dis.district_id} value={dis.district_id}>{dis.district_name}</option>
                                    ))
                                }
                            </Select>
                        </FormControl>

                        {/* <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="age-dropdown-label">Age</InputLabel>
                            <Select
                                native
                                value={age}
                                onChange={handleAgeChange}
                                input={<Input id="age-dropdown"/>}>
                                <option value={0}>All</option>
                                <option value={18}>18 to 44</option>
                                <option value={45}>45+</option>
                            </Select>
                        </FormControl> */}
                        
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
