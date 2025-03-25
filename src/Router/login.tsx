import { useMatches } from ".";

const Login = () => {
  const match = useMatches();
  console.log(match, "mmm");

  return (
    <div>
      <div>Login</div>
    </div>
  );
};

export default Login;
