import { useRouter } from 'next/router';
import Login from './login'
import styles from './login.module.css'

const HomePage = () => {
  const router = useRouter();

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    // <div>
    //   <body className={styles.body}>
    //     <div className={styles.grayDiv}>
    <Login />
    //     </div>
    //   </body>
    // </div>
  );
};

export default HomePage;
