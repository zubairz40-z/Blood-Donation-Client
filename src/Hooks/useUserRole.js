import useDBUser from "./useDBUser";

const useUserRole = () => {
  const { dbUser, dbUserLoading, dbUserError } = useDBUser();

  return {
    dbUser,
    role: dbUser?.role ?? null,
    status: dbUser?.status ?? null,
    roleLoading: dbUserLoading,
    roleError: dbUserError,
  };
};

export default useUserRole;
