import {
  ClientConcreteValues,
  ClientCustomFields,
  ClientTags
} from "../../../functions/src/types";
import ClientAvatar from "../Client/ClientAvatar";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import { makeStyles } from "@material-ui/core/styles";
import { MouseEvent, MouseEventHandler, useState } from "react";
import { Data } from "react-firebase-hooks/firestore/dist/firestore/types";
import { useHistory } from "react-router-dom";

// Sorting List Functions
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
  return order === "desc"
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

//List view header titles
const headCells = [
  {
    id: "firstName",
    numeric: false,
    disablePadding: false,
    label: "First Name"
  },
  { id: "lastName", numeric: false, disablePadding: false, label: "Last Name" },
  { id: "category", numeric: false, disablePadding: false, label: "Category" },
  { id: "email", numeric: false, disablePadding: false, label: "Email" },
  { id: "phone", numeric: false, disablePadding: false, label: "Phone" },
  { id: "notes", numeric: false, disablePadding: false, label: "Notes" }
];

// Generate table rows for list view
function createData(id, firstName, lastName, category, email, phone, notes) {
  return { id, firstName, lastName, category, email, phone, notes };
}

type Ordering = "asc" | "desc";
interface EnhancedTabledHeadProps {
  onRequestSort: (event: MouseEvent, property: string) => void;
  order: Ordering;
  orderBy: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%"
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 750
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1
  },
  avatar: {
    marginRight: 15,
    marginLeft: 15
  }
}));

interface ListViewProps {
  clientData: Data<
    ClientConcreteValues &
      ClientTags &
      ClientCustomFields & {
        id: string;
      },
    "",
    ""
  >[];
}

// List View Table
const ListView = ({ clientData }: ListViewProps) => {
  const classes = useStyles();
  const history = useHistory();
  const [order, setOrder] = useState<Ordering>("asc");
  const [orderBy, setOrderBy] = useState("firstName");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const listRows = clientData.map((client) => {
    return createData(
      client.id,
      client.firstName,
      client.lastName,
      client.category,
      client.email,
      client.phone,
      client.notes
    );
  });

  const handleRequestSort = (_event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = (event, id) => {
    history.push(`/client/${id}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, listRows.length - page * rowsPerPage);

  const EnhancedTableHead = (props: EnhancedTabledHeadProps) => {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler =
      (property: string): MouseEventHandler =>
      (event) => {
        onRequestSort(event, property);
      };

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="none"></TableCell>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? "right" : "left"}
              padding={headCell.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={"medium"}
            aria-label="Contacts"
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {stableSort(listRows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)} // Send to client page when clicked
                      key={row.id}
                    >
                      {/* Image*/}
                      <TableCell align="center" padding="none">
                        <div className={classes.avatar}>
                          <ClientAvatar
                            firstName={row.firstName}
                            lastName={row.lastName}
                            email={row.email}
                            size={45}
                          />
                        </div>
                      </TableCell>

                      {/*Contact Information*/}
                      <TableCell component="th" id={labelId} scope="row">
                        {row.firstName}
                      </TableCell>
                      <TableCell align="left">{row.lastName}</TableCell>
                      <TableCell align="left">{row.category}</TableCell>
                      <TableCell align="left">{row.email}</TableCell>
                      <TableCell align="left">{row.phone}</TableCell>
                      <TableCell align="left">{row.notes}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15, 25]}
          component="div"
          count={listRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default ListView;
