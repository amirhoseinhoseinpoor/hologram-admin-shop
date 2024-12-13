// src/components/ActiveUsersCard.js

import React from 'react';
import useActiveUsers from '@/hooks/useActiveUsers';
import { Box, Typography, CircularProgress } from '@mui/material';

const ActiveUsersCard = () => {
  const { activeUsers, error } = useActiveUsers();

  return (
    <Box
      sx={{
        p: 3,
        border: '1px solid #ddd',
        borderRadius: '10px',
        textAlign: 'center',
        boxShadow: '2px 2px 12px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
        width: '250px',
      }}
    >
      <Typography className="VodeoDisSizing" style={{fontFamily : "unset"}} variant="h6" gutterBottom>
        کاربر های فعال
      </Typography>
      {error ? (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      ) : activeUsers === 0 ? (
        <CircularProgress />
      ) : (
        <Typography variant="h3" color="primary">
          {activeUsers}
        </Typography>
      )}
    </Box>
  );
};

export default ActiveUsersCard;
