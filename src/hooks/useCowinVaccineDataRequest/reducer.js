import { DATA_LOADING, DATA_FAILED, DATA_SUCCEESS , State_SUCCEESS, District_SUCCEESS} from './types';
export const initialState = {
    pincode: '',
    pincodesList: [],
    availableCenters: [],
    allCenters: [],
    isLoading: false,
    errorMsg: '',
    states: [],
    districts: []
}

const reducer =  (state = initialState, action = {}) => {
    switch (action.type) {
        case DATA_LOADING:{
            return { ...state, isLoading: true }
        }
        case State_SUCCEESS:{
            return {...state, isLoading: false, errorMsg: null,
            states: action.payload.states
            }
        }
        case District_SUCCEESS:{
            return {...state, isLoading: false, errorMsg: null,
            districts: action.payload.districts
            }
        }
        case DATA_SUCCEESS:{
            let obj =  {
                ...state,
                isLoading: false,
                errorMsg: null, 
                availableCenters: action.payload.availableCenters,
                allCenters: action.payload.allCenters,
                pincode: action.payload.pincode,
                pincodesList: action.payload.pincodesList
            };
            if(action.payload.availableCenters.length === 0){
                obj.availableCenters = [];
            }
            return obj;
        }
           
        case DATA_FAILED:
            return { ...state, isLoading: false, errorMsg: action.payload.errorMsg };
        default:
            return initialState;
    }
}
export default reducer;