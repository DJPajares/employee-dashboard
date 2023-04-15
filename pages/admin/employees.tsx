import Header from '@/components/global/Header';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Toolbar,
  Typography,
  useTheme
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Head from 'next/head';
import { InferGetServerSidePropsType } from 'next';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { useRouter } from 'next/router';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const Employees = ({
  data
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const theme = useTheme();
  const colors = theme.palette;
  const route = useRouter();

  const [selectionModel, setSelectionModel] = useState<any[]>([]);
  const [showDialogCsv, setShowDialogCsv] = useState(false);
  const [showDialogDelete, setShowDialogDelete] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showDialogError, setShowDialogError] = useState(false);
  const [file, setFile] = useState(null);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'login', headerName: 'Login', width: 130 },
    { field: 'name', headerName: 'Name', width: 250 },
    { field: 'salary', headerName: 'Salary', width: 180 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      sortable: false,
      resizable: false,
      filterable: false,
      editable: false,
      type: 'actions',
      renderCell: (params) => {
        return (
          <>
            <IconButton>
              <EditIcon />
            </IconButton>
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </>
        );
      }
    }
  ];

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadCsv = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('csv', file);

    try {
      const res = await fetch(`${apiUrl}/api/employees`, {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        setShowDialogCsv(false);
        setShowDialog(true);

        refreshData();
      } else {
        setShowDialogError(true);
        console.error('Upload failed:', res.status, await res.text());
      }
    } catch (error) {
      setShowDialogError(true);
      console.error('Upload failed', error);
    }
  };

  const handleDeletion = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/employees`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectionModel)
      });

      if (res.ok) {
        setShowDialogDelete(false);
        setShowDialog(true); // fixme: show dialog with deletion success message

        refreshData();
      } else {
        console.error('Deletion failed:', res.status, await res.text());
        setShowDialogError(true); // fixme: show dialog with deletion error message
      }
    } catch (error) {
      console.error('Deletion failed', error);
      setShowDialogError(true); // fixme: show dialog with deletion error message
    }
  };

  const handleSelectionModelChange = (newSelection: any) => {
    setSelectionModel(newSelection);
  };

  const refreshData = () => {
    route.replace(route.asPath);
  };

  return (
    <>
      <Head>
        <title>Employees</title>
      </Head>

      <Box p={2}>
        <Header title="Employees" subtitle="Manage employees" />
        <Box py={4}>
          <Box pb={2}>
            <Toolbar
              variant="dense"
              disableGutters
              sx={{
                backgroundColor: colors.background.paper,
                borderRadius: 1,
                px: 1
              }}
            >
              <Box display="flex" justifyContent="space-between" width="100%">
                <Box>
                  <IconButton onClick={() => setShowDialogCsv(true)}>
                    <UploadFileIcon />
                  </IconButton>
                  <IconButton onClick={() => setShowDialogDelete(true)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </Toolbar>
          </Box>
          <Box>
            <DataGrid
              checkboxSelection
              autoHeight
              columns={columns}
              rows={data}
              rowSelectionModel={selectionModel}
              onRowSelectionModelChange={handleSelectionModelChange}
              sx={{
                borderColor: colors.background.paper,
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: colors.background.paper,
                  borderColor: colors.background.paper
                },
                '& .MuiDataGrid-cell': {
                  borderColor: colors.background.paper
                },
                '& .MuiDataGrid-footerContainer': {
                  backgroundColor: colors.background.paper,
                  borderColor: colors.background.paper
                }
              }}
            />
          </Box>
        </Box>

        {/* DIALOG - CSV */}
        <Dialog open={showDialogCsv} onClose={() => setShowDialogCsv(false)}>
          <DialogTitle>UPLOAD CSV</DialogTitle>
          <DialogContent>
            <TextField
              type="file"
              inputProps={{ accept: '.csv' }}
              onChange={handleOnChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDialogCsv(false)}>Cancel</Button>
            <Button onClick={(e) => handleUploadCsv(e)}>Ok</Button>
          </DialogActions>
        </Dialog>

        {/* DIALOG - DELETION */}
        <Dialog
          open={showDialogDelete}
          onClose={() => setShowDialogDelete(false)}
        >
          <DialogTitle>DELETE</DialogTitle>
          <DialogContent>
            <Typography variant="subtitle1">
              Are you sure you want to delete?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDialogDelete(false)}>No</Button>
            <Button onClick={handleDeletion}>Yes</Button>
          </DialogActions>
        </Dialog>

        {/* DIALOG - SUCCESS */}
        <Dialog open={showDialog}>
          <DialogTitle>SUCCESS</DialogTitle>
          <DialogContent>
            <Typography variant="subtitle1">
              Employee data successfully uploaded!
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDialog(false)}>Ok</Button>
          </DialogActions>
        </Dialog>

        {/* DIALOG - ERROR */}
        <Dialog open={showDialogError}>
          <DialogTitle>ERROR</DialogTitle>
          <DialogContent>
            <Typography variant="subtitle1">
              Employee data upload failed!
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDialogError(false)}>Ok</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default Employees;

export const getServerSideProps = async () => {
  const res = await fetch(`${apiUrl}/api/employees`);
  const data = await res.json();

  return {
    props: {
      data
    }
  };
};
