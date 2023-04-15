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

type DialogProps = {
  title: string;
  content: string;
};

type DataProps = {
  id: string;
  login: string;
  name: string;
  salary: number;
};

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
  const [showEditForm, setShowEditForm] = useState({
    open: false,
    data: {
      id: '',
      login: '',
      name: '',
      salary: 0
    }
  });
  const [file, setFile] = useState<File | null>(null);

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
      type: 'actions',
      headerAlign: 'center',
      sortable: false,
      resizable: false,
      filterable: false,
      editable: false,
      renderCell: (params) => {
        return (
          <>
            <IconButton onClick={() => handleEditForm(params.row)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeletion([params.row.id])}>
              <DeleteIcon />
            </IconButton>
          </>
        );
      }
    }
  ];

  const handleOnChange = (e: Event) => {
    const inputElement = e.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      setFile(file);
    }
  };

  const handleUploadCsv = async (e: Event) => {
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

  const handleDeletion = async (ids: string[]) => {
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

  const handleDialog = ({ title, content }: DialogProps) => {
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

  const handleEditForm = (params: DataProps) => {
    console.log('params', params);
    setShowEditForm({
      open: true,
      data: params
    });
  };

  const handleSubmitForm = async () => {
    try {
      const res = await fetch(
        `${apiUrl}/api/employees/${showEditForm.data.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(showEditForm.data)
        }
      );

      if (res.ok) {
        handleDialog({
          title: 'Update successful',
          content: 'Employee has been successfully updated'
        });

        refreshData();
      } else {
        handleDialog({
          title: 'Update failed',
          content: 'Employee has not been updated'
        });
        console.error('Update failed:', res.status, await res.text());
      }
    } catch (error) {
      handleDialog({
        title: 'Update failed',
        content: 'Employee has not been updated'
      });
      console.error('Error', error);
    }

    setShowEditForm({
      ...showEditForm,
      open: false
    });
  };

  const handleSelectionModelChange = (newSelection: DataProps[]) => {
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

      <Box
        px={2}
        pb={2}
        sx={{ minHeight: '100vh', backgroundColor: colors.background.paper }}
      >
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
                  borderRadius: 0
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

        {/* DIALOG - EDIT */}
        <Dialog open={showEditForm.open}>
          <DialogTitle>EDIT</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
              <TextField
                label="ID"
                value={showEditForm.data.id}
                sx={{ m: 1 }}
                onChange={(e) => {
                  setShowEditForm({
                    ...showEditForm,
                    data: {
                      ...showEditForm.data,
                      id: e.target.value
                    }
                  });
                }}
              />
              <TextField
                label="Login"
                value={showEditForm.data.login}
                sx={{ m: 1 }}
                onChange={(e) => {
                  setShowEditForm({
                    ...showEditForm,
                    data: {
                      ...showEditForm.data,
                      login: e.target.value
                    }
                  });
                }}
              />
            </Box>
            <TextField
              label="Name"
              value={showEditForm.data.name}
              sx={{ m: 1 }}
              onChange={(e) => {
                setShowEditForm({
                  ...showEditForm,
                  data: {
                    ...showEditForm.data,
                    name: e.target.value
                  }
                });
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <TextField
                label="Salary"
                value={showEditForm.data.salary}
                type="number"
                sx={{ m: 1 }}
                onChange={(e) => {
                  setShowEditForm({
                    ...showEditForm,
                    data: {
                      ...showEditForm.data,
                      salary: e.target.value
                    }
                  });
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setShowEditForm({ ...showEditForm, open: false })}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitForm}>Ok</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default Employees;

export const getServerSideProps = async () => {
  const res = await fetch(
    `${apiUrl}/api/employees?minSalary=0&offset=0&limit=30&sort=+id`
  );
  const data = await res.json();

  return {
    props: {
      data
    }
  };
};
