import { useRouter } from 'next/router';
import EditUserPage from '../EditUserPage';

const EditUser = () => {
  const router = useRouter();
  const { userId } = router.query;

  if (typeof userId !== 'string') {
    return null;
  }

  return <EditUserPage userId={userId} />;
};

export default EditUser;
