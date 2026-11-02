// src/components/ActiveUsersCard.js

import useActiveUsers from "@/hooks/useActiveUsers";
import GroupsIcon from "@mui/icons-material/Groups";
import StatCard from "./StatCard";

const ActiveUsersCard = () => {
  const { activeUsers, error } = useActiveUsers();

  return (
    <StatCard
      label="کاربر های فعال"
      value={activeUsers}
      error={error}
      icon={<GroupsIcon />}
    />
  );
};

export default ActiveUsersCard;
