import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Box, 
  TextField, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  MenuItem, 
  Select,
  IconButton,
  Paper,
  ClickAwayListener
} from '@mui/material';
import MDButton from 'components/MDButton';
import { useMaterialUIController } from 'context';
import MDTypography from 'components/MDTypography';
import Icon from '@mui/material/Icon';
import { Avatar } from "@mui/material";

export default function ShareModal({ open, onClose, sessionId }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [sharedUsers, setSharedUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
  
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const usersResponse = await fetch('/api/compartidos/getSharedUsers');
        if (!usersResponse.ok) throw new Error('Failed to fetch users');
        const usersData = await usersResponse.json();
        const allUsers = usersData.users || [];

        const sharedUsers = allUsers
          .filter(user => sessionId in (user.shared || {}))
          .map(user => ({
            ...user,
            permission: user.shared[sessionId]
          }));
  
        setAllUsers(allUsers);
        setSharedUsers(sharedUsers);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [open, sessionId]);

  const filteredUsers = allUsers.filter(user =>
    !sharedUsers.some(sharedUser => sharedUser.uid === user.uid) &&
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddUser = (user) => {
    setSharedUsers([...sharedUsers, { ...user, permission: 'Viewer' }]);
    setSearchTerm('');
    setShowSearchResults(false);
    setAllUsers(allUsers.filter(u => u.uid !== user.uid));
  };

  const handleRemoveUser = (userUid) => {
    setAllUsers([...allUsers, sharedUsers.find(user => user.uid === userUid)]);
    setSharedUsers(sharedUsers.filter(user => user.uid !== userUid));

  };

  const handlePermissionChange = (userUid, newPermission) => {
    setSharedUsers(sharedUsers.map(user => 
      user.uid === userUid ? { ...user, permission: newPermission } : user
    ));
  };

  const handleSave = async() => {
    setIsLoading(true);
    await fetch('/api/compartidos/synchronizeUserPermissions', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        sharedUsers,
        allUsers,
      }),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to synchronize permissions');
      }
      return response.json();
    })
    .then((data) => {
      console.log('Permissions synchronized successfully:', data);
    })
    setIsLoading(false);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: !darkMode ? 'background.paper' : 'rgba(31, 40, 62, 1)',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <MDTypography variant="h5" mb={2} textAlign="center">
          Gestionar Accesos
        </MDTypography>

        <Box sx={{ position: 'relative', mb: 3 }}>
          <TextField 
            disabled={isLoading}
            fullWidth
            color="error"
            placeholder="Buscar usuarios para agregar..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSearchResults(e.target.value.length > 0);
            }}
            onFocus={() => setShowSearchResults(searchTerm.length > 0)}
            InputProps={{
              startAdornment: (
                <Icon color='white' sx={{ mr: 1 }}>search</Icon>
              ),
            }}
          />
          
          {showSearchResults && filteredUsers.length > 0 && (
            <ClickAwayListener onClickAway={() => setShowSearchResults(false)}>
              <Paper
                sx={{
                  position: 'absolute',
                  width: '100%',
                  maxHeight: 200,
                  overflow: 'auto',
                  zIndex: 1,
                  mt: 1,
                  backgroundColor: darkMode ? 'rgb(27, 38, 63)' : 'white',
                  borderRadius: 1,
                  boxShadow: 3,
                  border: `1px solid ${darkMode ? 'rgba(31, 40, 62, 1)' : '#ccc'}`,
                  '&::-webkit-scrollbar': {
                    width: 8,
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: darkMode ? '#555' : '#ccc',
                    borderRadius: 4,
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: darkMode ? '#333' : '#f0f0f0',
                  },
                  '&:hover': {
                    backgroundColor: darkMode ? 'rgba(31, 40, 62, 1)' : '#f9f9f9',
                  },
                  '&:focus': {
                    outline: 'none',
                    boxShadow: darkMode ? '0 0 0 2px rgba(31, 40, 62, 1)' : '0 0 0 2px rgba(0, 0, 0, 0.1)',
                  },
                  
                }}
              >
                <List>
                  {filteredUsers.map((user) => (
                    <ListItem
                      key={user.uid}
                      button
                      onClick={() => handleAddUser(user)}
                      sx={{mt: 0.5, mb: 0.5, pl: 2, pr: 2}}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {user.photoUrl ? (
                              <Avatar 
                                alt={user.name} 
                                src={user.photoUrl} 
                                sx={{ width: 40, height: 40 }} 
                              />
                            ) : (
                              <Avatar alt={user.name} sx={{ width: 40, height: 40 }}>
                                <Icon>account_circle</Icon>
                              </Avatar>
                            )}
                            <MDTypography 
                              variant="body1" 
                              color={darkMode ? "white" : "dark"}
                              sx={{ fontWeight: 'medium' }}
                            >
                              {user.name}
                            </MDTypography>
                          </Box>
                        }
                        secondary={
                          <MDTypography 
                            variant="caption" 
                            color={darkMode ? "white" : "dark"}
                            sx={{ 
                              display: 'block',
                              marginLeft: 7, // Adjust to align with name
                              marginTop: 0.5 
                            }}
                          >
                            {user.email}
                          </MDTypography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </ClickAwayListener>
          )}
        </Box>

        {/* Shared Users List */}
        <Box sx={{ flex: 1, overflow: 'auto', mb: 3 }}>
          <MDTypography variant="h6" mb={1}>
            Usuarios con acceso
          </MDTypography>
          
          {sharedUsers.length > 0 ? (
            <List>
              {sharedUsers.map((user) => (
                <React.Fragment key={user.uid}>
                  <ListItem
                    secondaryAction={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Select
                          value={user.permission}
                          onChange={(e) => handlePermissionChange(user.uid, e.target.value)}
                          size="small"
                          sx={{ mr: 2, width: 120 }}
                        >
                          <MenuItem value="Viewer">Lectura</MenuItem>
                          <MenuItem value="Editor">Escritura</MenuItem>
                        </Select>
                        <IconButton
                          onClick={() => handleRemoveUser(user.uid)}
                          color="error"
                        >
                          <Icon>delete</Icon>
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {user.photoUrl ? (
                            <Avatar 
                              alt={user.name} 
                              src={user.photoUrl} 
                              sx={{ width: 40, height: 40 }} 
                            />
                          ) : (
                            <Avatar alt={user.name} sx={{ width: 40, height: 40 }}>
                              <Icon>account_circle</Icon>
                            </Avatar>
                          )}
                          <MDTypography 
                            variant="body1" 
                            color={darkMode ? "white" : "dark"}
                            sx={{ fontWeight: 'medium' }}
                          >
                            {user.name}
                          </MDTypography>
                        </Box>
                      }
                      secondary={
                        <MDTypography 
                          variant="caption" 
                          color={darkMode ? "white" : "dark"}
                          sx={{ 
                            display: 'block',
                            marginLeft: 7, // Adjust to align with name
                            marginTop: 0.5 
                          }}
                        >
                          {user.email}
                        </MDTypography>
                      }
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          ) : (
            <MDTypography variant="body2" textAlign="center" sx={{ py: 2 }}>
              No hay usuarios con acceso
            </MDTypography>
          )}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <MDButton disabled={isLoading} onClick={onClose} color={darkMode ? "white" : "dark"} variant="outlined">
            Cerrar
          </MDButton>
          <MDButton disabled={isLoading} onClick={handleSave} color={darkMode ? "white" : "dark"} variant="outlined">
            Sincronizar permisos
          </MDButton>
        </Box>
      </Box>
    </Modal>
  );
}