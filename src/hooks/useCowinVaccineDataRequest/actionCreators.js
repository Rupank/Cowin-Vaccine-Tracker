import { DATA_LOADING, DATA_FAILED, DATA_SUCCEESS, State_SUCCEESS, District_SUCCEESS } from './types';

export const loading = () => ({type: DATA_LOADING});
export const success = (response) => ({type: DATA_SUCCEESS, payload: response});
export const successStates = (response) => ({type: State_SUCCEESS, payload: response});
export const successDistrict = (response) => ({type: District_SUCCEESS, payload: response});
export const error = (response) => ({type: DATA_FAILED, payload: {response}});