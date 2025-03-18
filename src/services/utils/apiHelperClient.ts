export const apiGetAllLeads = async (data: any) => {
  return fetch(`/api/leads/all`, {
    method: "POST",
    body: JSON.stringify(data),
  }).then((res) => res.json());
};


export const apiCreateLead = async (data: any) => {
  return fetch(`/api/leads/create`, {
    method: "POST",
    body: JSON.stringify(data),
  }).then((res) => res.json());
};

export const apiUpdateLead = async (data: any) => {
  return fetch(`/api/leads/update`, {
    method: "POST",
    body: JSON.stringify(data),
  }).then((res) => res.json());
};

export const apiDeleteLead = async (data: any) => {
  return fetch(`/api/leads/delete`, {
    method: "POST",
    body: JSON.stringify({id:data}),
  }).then((res) => res.json());
};

export const apiExportLeads = async (data: any) => {
  return fetch(`/api/leads/export`, {
    method: "POST",
    body: JSON.stringify(data),
  }).then((res) => res.json());
};

export const apiLogin = async (data: any) => {
  return fetch(`/api/auth/login`, {
    method: "POST",
    body: JSON.stringify(data),
  }).then((res) => res.json());
};

export const apiRegister = async (data: any) => {
  return fetch(`/api/auth/register`, {
    method: "POST",
    body: JSON.stringify(data),
  }).then((res) => res.json());
};

export const apiGetMe = async () => {
  return fetch(`/api/me`, {
    method: "POST",
  }).then((res) => res.json());
};

