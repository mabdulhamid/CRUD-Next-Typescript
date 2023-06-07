import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkAction, Action } from '@reduxjs/toolkit';
import { User } from '../redux/store';
import { fetchUsers, deleteUserData, selectUser, RootState, AppDispatch } from '../redux/store';
import { useRouter } from 'next/router';
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Button,
  Typography,
  Breadcrumbs,
  Link,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

const UserManagement = () => {
  const router = useRouter();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState('');
  const [userId, setUserId] = useState<number | undefined>(undefined);



  const handleEditUser = (user: any) => {
    dispatch(selectUser(user));
    router.push(`/edit-user/${user?.id}`);
    // router.push({
    //   pathname: `/edit-user/${user?.id}`,
    //   query: { user: JSON.stringify(user) },
    // });
  };

  const handleDeleteConfirmation = (email: any) => {
    setDeleteEmail(email);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteUser = async () => {
    try {
      if (typeof userId === 'number') {
        await (dispatch as AppDispatch)(deleteUserData(userId) as any);
        console.log('User deletion successful');
        window.alert('User deleted successfully!');
        // Perform any additional actions after successful deletion
      }
    } catch (error) {
      console.error('User deletion failed');
      window.alert('User deletion failed. Please try again.');
    }
    setShowDeleteConfirmation(false);
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    (dispatch as AppDispatch)(fetchUsers({ skip: newPage * rowsPerPage, limit: rowsPerPage }));
    setPage(newPage);
  };


  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    (dispatch as AppDispatch)(fetchUsers({ skip: 0, limit: newRowsPerPage }));
  };

  const dispatch = useDispatch();
  const { loading, users, error, total } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    (dispatch as AppDispatch)(fetchUsers({ skip: 0, limit: 5 }));
  }, [dispatch]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <Typography variant="h6" color='blue'>User Management</Typography>
          <Breadcrumbs>
            <Link color="inherit" href="/dashboard">
              Dashboard
            </Link>
            <Typography color="textPrimary">User</Typography>
          </Breadcrumbs>
        </div>
        <Button variant="contained" startIcon={<Add />} color="primary" onClick={() => router.push(`/AddUser`)}>
          Add User
        </Button>
      </div>

      <div>
        <Paper elevation={4} style={{ padding: 20 }}>
          <TableContainer style={{ backgroundColor: 'white' }}>
            <Typography variant="h6" style={{ marginBottom: '1rem', fontWeight: 'bold' }}>
              User List
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Phone</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Address</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Company</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users?.map((user: User) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.firstName} {user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user?.address?.address}</TableCell>
                    <TableCell>{user?.company?.name}</TableCell>
                    <TableCell>
                      <IconButton aria-label="Edit" onClick={() => handleEditUser(user)}>
                        <Edit />
                      </IconButton>
                      <IconButton aria-label="Delete" onClick={() => {
                        handleDeleteConfirmation(user.email);
                        setUserId(user?.id)
                      }}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Rows per page"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
            nextIconButtonProps={{ 'aria-label': 'next page' }}
            backIconButtonProps={{ 'aria-label': 'previous page' }}
          />
        </Paper>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirmation} onClose={() => setShowDeleteConfirmation(false)}>
        <DialogTitle>Are You Sure</DialogTitle>
        <DialogContent>
          <DialogContentText>
            User with email {deleteEmail} will be deleted
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteConfirmation(false)} color="inherit">
            Cancel
          </Button>
          <Button color='warning' autoFocus onClick={() => handleDeleteUser()}>
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Background Blur */}
      {showDeleteConfirmation && <div className="backdrop" />}
    </div>
  );
};

export default UserManagement;
