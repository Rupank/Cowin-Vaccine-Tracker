import React, {useState, useEffect} from 'react'
import useCowinVaccineDataRequest from '../hooks/useCowinVaccineDataRequest/';
import SearchByPincode from './SearchByPincode';
import StateAndDistrictWrapper from './StateAndDistrictWrapper';
import TableGrid from './TableGrid';
const MINUTE_MS = 60000;
function Tracker() {
   
    const [pincodeUI, setPincodeUI] = useState();
    const [districtOnUI, setDistrictOnUI] = useState();
    const [{isLoading, errorMsg, availableCenters}, {makeRequest}] = useCowinVaccineDataRequest();
    const [refreshInterval, setRefreshInterval] = useState({});

    useEffect(() => {
      if(pincodeUI && pincodeUI.length === 6){
        if(refreshInterval){
          clearInterval(refreshInterval);
        }
        makeRequest({isSearchedByPinCode: true, value: pincodeUI});
        let interval = setInterval(() => {
          makeRequest({isSearchedByPinCode: true, value: pincodeUI});
        }, MINUTE_MS );
        setRefreshInterval(interval);
      }
      return () => {
        if(refreshInterval){
          clearInterval(refreshInterval);
        }
      }
    }, [pincodeUI])

    useEffect(() => {
      if(districtOnUI){
        if(refreshInterval){
          clearInterval(refreshInterval);
        }

        makeRequest({isSearchedByPinCode: false, value: districtOnUI});
        let interval = setInterval(() => {
          makeRequest({isSearchedByPinCode: false, value: districtOnUI});
        }, MINUTE_MS );
        setRefreshInterval(interval);
      }
      return () => {
        if(refreshInterval){
          clearInterval(refreshInterval);
        }
      }
    }, [districtOnUI])

    const setPincode = (pincode) => {
      setPincodeUI(pincode);
    }

    const setDistrictCallback = (district) =>{
      setDistrictOnUI(district);
    }

    return (
        <div>
          <SearchByPincode setPincode = {setPincode}/>
          <StateAndDistrictWrapper setDistrictCallback = {setDistrictCallback}/>
          {isLoading && 
          <div>LOADING.......</div> 
          }
        {errorMsg && <div>Error....... {errorMsg}</div>}
        {!isLoading && !errorMsg && availableCenters &&  availableCenters.length > 0  && (
          <TableGrid availableCenters={availableCenters}/>
        )}
        {availableCenters && availableCenters.length === 0 && (
          <div className = "not_available_div">No slots available at the moment for selection. Status gets refreshed every {MINUTE_MS/1000} seconds</div>
        )}
        </div>
    )
}

export default Tracker;
