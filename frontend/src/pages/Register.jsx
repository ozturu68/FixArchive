import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="text-center">
        <h1 className="text-2xl">Kayıt Ol Sayfası</h1>
        <p className="text-zinc-500 mt-2">Bu alan geliştirilme aşamasındadır.</p>
        <Link to="/login" className="text-blue-400 mt-4 block">Giriş'e Dön</Link>
      </div>
    </div>
  );
};
export default Register;