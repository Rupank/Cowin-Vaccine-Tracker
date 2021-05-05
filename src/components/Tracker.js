import React, {useState, useEffect} from 'react'
import useCowinVaccineDataRequest from '../hooks/useCowinVaccineDataRequest/';
import SearchByPincode from './SearchByPincode';
import StateAndDistrictWrapper from './StateAndDistrictWrapper';
import TableGrid from './TableGrid';
const MINUTE_MS = 30000;
function Tracker() {
   
    const [pincodeUI, setPincodeUI] = useState();
    const [districtOnUI, setDistrictOnUI] = useState();
    const [{isLoading, errorMsg, availableCenters}, {makeRequest}] = useCowinVaccineDataRequest();
    const [refreshInterval, setRefreshInterval] = useState(null);

    useEffect(() => {
      if(pincodeUI && pincodeUI.length === 6){
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
          <div className = "not_available_div">Vaccines Not Available at the moment for selection</div>
        )}
        </div>
    )
}

export default Tracker;
