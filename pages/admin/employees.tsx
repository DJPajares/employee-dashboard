import Header from '@/components/global/Header';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputBase,
  Paper,
  TextField,
  Typography,
  alpha,
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
import CustomDialog from '@/components/global/Dialog';

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
  const [showDialog, setShowDialog] = useState({
    title: '',
    content: '',
    open: false,
    onClose: () => {},
    actions: <></>
  });
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

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadCsv = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (file) {
      formData.append('csv', file);
    }

    try {
      const res = await fetch(`${apiUrl}/api/employees`, {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        setShowDialogCsv(false);
        handleDialog({
          title: 'Upload successful',
          content: 'Employees have been successfully uploaded'
        });

        refreshData();
      } else {
        handleDialog({
          title: 'Upload failed',
          content: 'Employees have not been uploaded'
        });
        console.error('Upload failed:', res.status, await res.text());
      }
    } catch (error) {
      handleDialog({
        title: 'Upload failed',
        content: 'Employees have not been uploaded'
      });
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
        handleDialog({
          title: 'Deletion successful',
          content: 'Employees have been successfully deleted'
        });

        refreshData();
      } else {
        handleDialog({
          title: 'Deletion failed',
          content: 'Employees have not been deleted'
        });
        console.error('Deletion failed:', res.status, await res.text());
      }
    } catch (error) {
      handleDialog({
        title: 'Deletion failed',
        content: 'Employees have not been deleted'
      });
      console.error('Deletion failed', error);
    }
  };

  const handleDialog = ({ title, content }) => {
    const actions = (
      <>
        <Button
          onClick={() => {
            setShowDialog({
              ...showDialog,
              open: false
            });
          }}
        >
          Close
        </Button>
      </>
    );

    setShowDialog({
      title,
      content,
      open: true,
      onClose: () => {
        setShowDialog({
          ...showDialog,
          open: false
        });
      },
      actions
    });
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
          {/* TOOLBAR */}
          <Box
            pb={2}
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Box display="flex">
              <Box pr={2}>
                <Paper>
                  <IconButton
                    sx={{
                      width: '48px',
                      height: '48px'
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
                      height: '48px'
                    }}
                    onClick={() => setShowDialogDelete(true)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Paper>
              </Box>
            </Box>

            <Box display="flex">
              <Box
                sx={{
                  ml: 2,
                  px: 2,
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 0.5,
                  backgroundColor: colors.background.paper,
                  '&:hover': {
                    backgroundColor: alpha(colors.background.paper, 0.5)
                  }
                }}
              >
                <InputBase placeholder="Min. Salary" />
              </Box>
              <Box
                sx={{
                  ml: 2,
                  px: 2,
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 0.5,
                  backgroundColor: colors.background.paper,
                  '&:hover': {
                    backgroundColor: alpha(colors.background.paper, 0.5)
                  }
                }}
              >
                <InputBase placeholder="Max. Salary" />
              </Box>
            </Box>
          </Box>

          {/* DATA GRID */}
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
            <Button onClick={() => handleDeletion(selectionModel)}>Yes</Button>
          </DialogActions>
        </Dialog>

        {/* DIALOG - GENERIC */}
        <CustomDialog
          title={showDialog.title}
          content={showDialog.content}
          open={showDialog.open}
          onClose={showDialog.onClose}
          actions={showDialog.actions}
        />
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
