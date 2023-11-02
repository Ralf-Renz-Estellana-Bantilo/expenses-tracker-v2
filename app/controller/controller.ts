import axios from 'axios';
import { MasterSelectPayloadType, SaveDataPayloadType } from '../types/type';

const URL_SAVEDATA = '/api/savedata'
const URL_MASTERSELECT = '/api/masterselect'

export const fetchSaveData = async <T> ( payload: SaveDataPayloadType ): Promise<T> =>
{
   try
   {
      const response = await axios.post( URL_SAVEDATA, payload )
      return response.data
   } catch ( error )
   {
      console.log( error )
      throw error
   }

}

export const fetchMasterSelect = async <T> ( payload: MasterSelectPayloadType ): Promise<T> =>
{

   try
   {
      const result = await axios.post( URL_MASTERSELECT, payload );
      return result.data;
   } catch ( error )
   {
      throw error;
   }
}