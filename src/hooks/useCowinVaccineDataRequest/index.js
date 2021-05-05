import { useReducer, useCallback, useState, useEffect } from "react";
import reducer, { initialState } from "./reducer";
import { loading, success, error, successStates, successDistrict } from "./actionCreators";
import * as _ from 'lodash';

const PINCODE_URL = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?";
const DISTRICT_URL = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?";
const GETAllSTATES_URL = "https://cdn-api.co-vin.in/api/v2/admin/location/states";
const GETDISTRICTSINSTATE_URL = "https://cdn-api.co-vin.in/api/v2/admin/location/districts/";
const useCowinVaccineDataRequest = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [notifications, setNotifications] = useState([]);

    const showNotification = ({ pincode, center_name, block_name, date, vaccine }) => {
        let notification = new Notification('VACCINATION SLOT OPEN', {
            body: pincode + ':' + vaccine + '\n' + center_name + '\n' + block_name + '\n' + date,
            renotify: true,
            tag: 'COWIN_NOTIFICATION',
            requireInteraction: true
        });
        setNotifications(...notifications, notification);
    };

    const closeNotification = () => {
        notifications.forEach(notification => {
            if (notification) {
                notification.close();
            }
        });
        setNotifications([]);
    }

    useEffect(() => {
        if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification");
        } else {
            Notification.requestPermission();
        }
        return () => {
            closeNotification();
        }
    }, [])

    const makeRequest = useCallback(async (params = {}) => {
        dispatch(loading());
        try {
            var date = new Date(Date.now()).toLocaleDateString('en-gb').replaceAll('/', '-');
            const { isSearchedByPinCode, value } = params;
            let url = '';
            if (isSearchedByPinCode) {
                url = `${PINCODE_URL}pincode=${value}&date=${date}`;
            } else {
                url = `${DISTRICT_URL}district_id=${value}&date=${date}`;
            }
            let response = await fetch(
                    url,
                    {
                        headers: {
                            accept: 'application/json, text/plain, */*',
                            'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
                            'sec-fetch-dest': 'empty',
                            'sec-fetch-mode': 'cors',
                            'sec-fetch-site': 'cross-site',
                            'sec-gpc': '1',
                        },
                        referrer: 'https://www.cowin.gov.in/',
                        referrerPolicy: 'strict-origin-when-cross-origin',
                        body: null,
                        method: 'GET',
                        mode: 'cors',
                        credentials: 'omit',
                    }
                );
            let data = await response.json();
            var allCenters = [];
            var availableCenters = [];
            var centerLen = data.centers.length;
            for (var i = 0; i < centerLen; i++) {
                var center = data.centers[i];
                var sessionLen = center.sessions.length;
                for (var j = 0; j < sessionLen; j++) {
                    var session = center.sessions[j];
                    var centerData = {
                        center_id: center.center_id,
                        center_name: center.name,
                        address: center.address,
                        state: center.state_name,
                        district_name: center.district_name,
                        block_name: center.block_name,
                        pincode: center.pincode,
                        fee_type: center.fee_type,
                        date: session.date,
                        available_capacity: session.available_capacity,
                        min_age_limit: session.min_age_limit,
                        vaccine: session.vaccine,
                        vaccine_fees: center.vaccine_fees
                    }
                    if (
                        session.available_capacity > 0 &&
                        session.min_age_limit === 18
                    ) {
                        availableCenters.push(centerData);
                        showNotification(centerData);
                    }
                    allCenters.push(centerData);
                }
            }
            dispatch(success({
                pincode: center.pincode,
                pincodesList: [center.pincode],
                availableCenters: _.sortBy(availableCenters, 'center_name'),
                allCenters: allCenters,
                isLoading: false,
                errorMsg: ''
            }));
        } catch (err) {
            dispatch(error({
                errorMsg: err.message
            }));
        }
    }, []);

    const getAllStatesData = useCallback(async ()=>{
        dispatch(loading());
        try {
            let response = await fetch(
                GETAllSTATES_URL,
                {
                    headers: {
                        accept: 'application/json, text/plain, */*',
                        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
                        'sec-fetch-dest': 'empty',
                        'sec-fetch-mode': 'cors',
                        'sec-fetch-site': 'cross-site',
                        'sec-gpc': '1',
                    },
                    referrer: 'https://www.cowin.gov.in/',
                    referrerPolicy: 'strict-origin-when-cross-origin',
                    body: null,
                    method: 'GET',
                    mode: 'cors',
                    credentials: 'omit',
                }
            );
        let data = await response.json();
        dispatch(successStates({
            states: data.states,
            isLoading: false,
            errorMsg: ''
        }));
        } catch (err) {
            dispatch(error({
                errorMsg: err.message
            }));   
        }

    }, []);

    const getAllDistrictData = useCallback(async (stateId)=>{
        dispatch(loading());
        try {
            let response = await fetch(
                `${GETDISTRICTSINSTATE_URL}${stateId}`,
                {
                    headers: {
                        accept: 'application/json, text/plain, */*',
                        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
                        'sec-fetch-dest': 'empty',
                        'sec-fetch-mode': 'cors',
                        'sec-fetch-site': 'cross-site',
                        'sec-gpc': '1',
                    },
                    referrer: 'https://www.cowin.gov.in/',
                    referrerPolicy: 'strict-origin-when-cross-origin',
                    body: null,
                    method: 'GET',
                    mode: 'cors',
                    credentials: 'omit',
                }
            );
        let data = await response.json();
        dispatch(successDistrict({
            districts: data.districts,
            isLoading: false,
            errorMsg: ''
        }));
        } catch (err) {
            dispatch(error({
                errorMsg: err.message
            }));   
        }

    }, []);


    return [state,{makeRequest, getAllStatesData, getAllDistrictData}];
}
export default useCowinVaccineDataRequest;

