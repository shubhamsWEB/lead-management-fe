const login = (params:any) => ({
  url: `/auth/login`,
  method: "post",
  data:{...params}
});

const register = (params:any) => ({
  url: `/auth/register`,
  method: "post",
  data:{...params}
});

const logout = () => ({
  url: `/auth/logout`,
  method: "get",
});

export { login, register, logout };
