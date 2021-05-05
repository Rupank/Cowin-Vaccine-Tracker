import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import VaccineAvailablityCard from './VaccineAvailablityCard';
import CenterNameCard from './CenterNameCard';
import * as _ from 'lodash';

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
    container: {
      maxHeight: 660,
    },
  });

  function createDataForVaccineAvailablity(availableCenters){
    var rowsData = [];
    let dateFilteredData = _.groupBy(availableCenters, "date");
    let dateFilteredDataKeys = _.keys(dateFilteredData);

    let centerFilteredData = _.groupBy(availableCenters, "center_name");
    Object.entries(centerFilteredData).forEach((data, index)=>{
      let centerData = [];
      let object = data[1];
      let infoObject = object[0];
      let dataFilterdObject = _.groupBy(object, 'date');
      for(let i=0;i<dateFilteredDataKeys.length;i++){
        let objectValueOnDate = dataFilterdObject[dateFilteredDataKeys[i]];
        if(objectValueOnDate){
          centerData.push(objectValueOnDate[0]);
        }else{
          centerData.push(null);
        }
      }
      rowsData.push({name: data[0], centerInfo:infoObject, values: centerData})
    });
    return rowsData;
  }
export default function TableGrid({availableCenters}) {
    const classes = useStyles();
    const dateMapObject = _.groupBy(availableCenters, "date");
    const uniqueDates = _.keys(dateMapObject);
    const rowsDataForTable = createDataForVaccineAvailablity(availableCenters);
    return (
        <TableContainer component={Paper} className={classes.container}>
          <Table className={classes.table} size="small" aria-label="a dense table" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Center Name</TableCell>
                {
                    uniqueDates.map(date=>(
                        <TableCell key = {date} align="center">{date}</TableCell>
                    ))
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {rowsDataForTable.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    <CenterNameCard  name={row.name} infoObject= {row.centerInfo}/>
                  </TableCell>
                  {
                    row.values.map((val,index)=>(
                      <TableCell align="center" key = {val.availableCapacity+'_'+index}>
                        <VaccineAvailablityCard card={val} />
                        </TableCell>
                    ))
                  }
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
}
