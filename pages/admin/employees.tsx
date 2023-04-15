import Header from '@/components/global/Header';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
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
  // const [showDialogDelete, setShowDialogDelete] = useState(false);
  const [showDialogDelete, setShowDialogDelete] = useState({
    open: false
  });
  const [showDialog, setShowDialog] = useState(false);
  const [showDialogError, setShowDialogError] = useState(false);
  const [file, setFile] = useState(null);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'login', headerName: 'Login', width: 130 },
    { field: 'name', headerName: 'Name', width: 250 },
    {
      field: 'salary',
      headerName: 'Salary',
      width: 180,
      type: 'number',
      valueFormatter: ({ value }) =>
        new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: 'SGD'
        }).format(value)
    },
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
            <IconButton onClick={() => handleDeletion([params.id])}>
              <DeleteIcon />
            </IconButton>
          </>
        );
      }
    }
  ];

  const test = (data) => {
    console.log(data);
  };

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

  const handleDeletion = async (ids) => {
    try {
      const res = await fetch(`${apiUrl}/api/employees`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ids)
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

  const handleDeletionDialog = () => {
    setShowDialogDelete(true);
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

      <Box px={2} pb={2} sx={{ backgroundColor: colors.background.paper }}>
        <Box>
          <Header title="Employees" subtitle="Manage employees" />
        </Box>
        <Box
          p={2}
          sx={{
            backgroundColor: colors.background.default,
            borderRadius: 2,
            boxShadow: 0
          }}
        >
          <Box>
            <Box pb={2} display="flex">
              <Box pr={2}>
                <Paper>
                  <IconButton
                    sx={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: colors.background.paper
                    }}
                    onClick={() => setShowDialogCsv(true)}
                  >
                    <UploadFileIcon />
                  </IconButton>
                </Paper>
              </Box>
              <Box pr={2}>
                <Paper>
                  <IconButton
                    sx={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: colors.background.paper
                    }}
                    onClick={() => setShowDialogDelete(true)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Paper>
              </Box>
            </Box>
          </Box>
          <Box>
            <DataGrid
              checkboxSelection
              autoHeight
              columns={columns}
              rows={data}
              // paginationMode="client"
              // paginationModel={{ page: 0, pageSize: 10 }}
              // pageSizeOptions={[10, 20, 50]}
              rowSelectionModel={selectionModel}
              onRowSelectionModelChange={handleSelectionModelChange}
              // slots={{ toolbar: GridToolbar }}
              sx={{
                border: 'none',
                borderRadius: 0,
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: colors.background.paper,
                  borderColor: colors.background.paper,
                  borderRadius: 0
                },
                '& .MuiDataGrid-columnsContainer': {
                  borderBottom: 1,
                  borderBottomColor: colors.divider,
                  baclgroundColor: colors.background.paper
                },
                '& .MuiDataGrid-cell': {
                  borderBottom: 1,
                  borderBottomColor: colors.divider
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
          open={showDialogDelete.open}
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
            <Button onClick={() => handleDeletion(selectionModel)}>Yes</Button>
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
