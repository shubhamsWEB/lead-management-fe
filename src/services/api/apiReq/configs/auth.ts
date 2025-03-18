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

export { login, register };
