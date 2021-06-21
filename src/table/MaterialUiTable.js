import React, {useEffect} from 'react';
import { makeStyles, withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import EnhancedTableHead from './EnhancedTableHead';
import EnhancedTableToolbar from './EnhancedTableToolbar';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import TableHead from '@material-ui/core/TableHead';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InfoIcon from '@material-ui/icons/Info';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);


function createData(name, calories, fat, carbs, protein, price, status) {
  return {
    name,
    calories,
    fat,
    carbs,
    status,
    protein,
    price,
    history: [
      { date: '2020-01-05', customerId: '11091700', amount: 3, amountb: 35, amountc: 36 },
      { date: '2020-01-02', customerId: 'Anonymous', amount: 1, amountb: 33, amountc: 39 },
    ],
  };
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function MaterialUiTable() {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = React.useState([]);
  const [current, setCurrent] = React.useState(undefined);
  const [rows, setRows] = React.useState([]);
  const [tRows, setTRows] = React.useState([]);
  const [loaded, setLoaded] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const items = [30,90,60,100,50,40,70,70];
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const API = 'http://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline';

  useEffect(() => {
    if(!loaded){
      fetch(API)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong ...');
        }
      })
      .then(data => {
        console.log(data);
        let rData = [];
        data.forEach(element => {
          const newEntry = createData(element.name, element.product_type, element.brand, element.price, element.id, element.price, element.price);
          rData = [...rData, newEntry];
        });
        setRows(rData);
        setTRows(rData);
        setLoaded(true);
      })
      .catch(error => setLoaded(true));
    } 
  }, [loaded]);

const searchFilter = (e) => {
  e.preventDefault();
  console.log({name: e.target.name, value: e.target.value});
    const name = e.target.name;
    const val = e.target.value;
    const data = tRows.filter(r => r[name] == val);
    setRows(data);
}

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
  
  const formatStatus = (status) => {
    if(status <= 39)
    {
      return (<img src="https://ucarecdn.com/57d53b22-4701-4aac-a854-a8282d4b8ec3/"/> );
    }
      
    else if(status >= 40 && status <= 69)
    {
      return (<img src="https://ucarecdn.com/730c4505-4e5d-4e03-85f8-b7125b964b02/"/> );
    }
    
    else if(status >= 70 && status <= 100)
      {
        return (<img src="https://ucarecdn.com/aec75ae2-163a-4ce8-8340-6be084c0b082/"/> );
      }
    else
      {return (null );}
  }
  return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <EnhancedTableToolbar numSelected={selected.length} searchFilter={searchFilter}/>
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size="medium"
              aria-label="collapsible table"
            >
              <EnhancedTableHead
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              
              <TableBody>
                
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.name);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    const key = index;
                    return (
                      <>
                     

                      <TableRow
                        
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.name}
                        selected={isItemSelected}
                      >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={isItemSelected}
                                inputProps={{ 'aria-labelledby': labelId }}
                                onClick={(event) => handleClick(event, row.name)}
                              />
                            </TableCell>
                            <TableCell>
                            <IconButton aria-label="expand row" size="small" onClick={() => 
                              {
                                let newIsOpen = [...open];      //copy array
                                newIsOpen[key] = !newIsOpen[key]; //toggle flag
                                setOpen(newIsOpen);             //set new state
                                setCurrent(key);
                                console.log(current);
                              }}>
                              {open[key] && (current===key) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                          </TableCell>
                          <TableCell component="th" id={labelId} scope="row">
                            {row.name}
                          </TableCell>
                          <TableCell align="right">{row.calories}</TableCell>
                          <TableCell align="right">{formatStatus(items[Math.floor(Math.random()*items.length)])}</TableCell>
                          <TableCell align="right">{row.fat}</TableCell>
                          <TableCell align="right"><span style={{borderRadius:'20px', width:'130px', paddingRight:'12px', 
                           paddingLeft:'12px', paddingTop:'8px', paddingBottom:'8px',
                          borderBlockStyle:'solid', borderColor:'#f1f5f8', borderWidth:'5px'}}>{row.carbs}</span></TableCell>
                          <TableCell align="right">{row.protein}</TableCell>
                          <TableCell align="right"><IconButton
                                        aria-controls="customized-menu"
                                        aria-haspopup="true"
                                        variant="contained"
                                        color="primary"
                                        onClick={handleMenuClick}><MoreVertIcon/></IconButton></TableCell>
                          <StyledMenu
                                  id="customized-menu"
                                  anchorEl={anchorEl}
                                  keepMounted
                                  open={Boolean(anchorEl)}
                                  onClose={handleMenuClose}
                                >
                                  <StyledMenuItem>
                                    <ListItemIcon>
                                      <InfoIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary="view" />
                                  </StyledMenuItem>
                                  <StyledMenuItem>
                                    <ListItemIcon>
                                      <EditIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary="edit" />
                                  </StyledMenuItem>
                                  <StyledMenuItem>
                                    <ListItemIcon>
                                      <DeleteIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary="delete" />
                                  </StyledMenuItem>
                                </StyledMenu>

                          
                        </TableRow>
                        <TableRow className="cver">
                          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6} className="cver">
                            <Collapse in={open[key] && (current===key)} timeout="auto" unmountOnExit className="cver addborder">
                              <Box margin={2} padding={1} border={0}>
                                
                                <Table size="small" aria-label="purchases" className="cver">
                                  
                                  <TableBody className="cver"> 
                                    {row.history.map((historyRow) => (
                                      <TableRow key={historyRow.date} className="cver">
                                        <TableCell padding="checkbox" className="cver" className="cver">
                                          <Checkbox
                                            // checked={isItemSelected}
                                            // inputProps={{ 'aria-labelledby': labelId }}
                                          />
                                        </TableCell>
                                        <TableCell component="th" scope="row" className="cver" className="cver">
                                          {historyRow.date}
                                        </TableCell>
                                        <TableCell className="cver" className="cver">{historyRow.customerId}</TableCell>
                                        <TableCell align="right" className="cver">{historyRow.amount}</TableCell>
                                        <TableCell align="right" className="cver">
                                          {Math.round(historyRow.amount * row.price * 100) / 100}
                                        </TableCell>

                                        <TableCell align="right" className="cver">
                                               {formatStatus(items[Math.floor(Math.random()*items.length)])}
                                           </TableCell>

                                        <TableCell align="right" className="cver">
                                        <span style={{borderRadius:'20px', width:'130px', paddingRight:'15px', 
                                              paddingLeft:'15px', paddingTop:'8px', paddingBottom:'8px',
                                              borderBlockStyle:'solid', borderColor:'#ffffff', backgroundColor:'#ffffff'}}>{historyRow.amountc}</span>
                                        </TableCell>
                                        
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Collapse>
                          </TableCell>
                      </TableRow>
                      </>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 70 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
  );
}
