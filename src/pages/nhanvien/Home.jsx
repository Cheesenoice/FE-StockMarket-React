import Navbar from "../../components/nhanvien/Navbar";
import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <Navbar />
      <div className="p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
