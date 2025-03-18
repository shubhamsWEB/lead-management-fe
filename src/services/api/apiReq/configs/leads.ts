const getAllLeads = (params:any) => ({
  url: `/leads`,
  method: "get",
  params:{...params}
});

const getLeadById = (params:any) => ({
  url: `/leads/${params.id}`,
  method: "get",
  params:{...params}
});

const createLead = (params:any) => ({
  url: `/leads`,
  method: "post",
  data:{...params}
});

const updateLead = (params:any) => ({
  url: `/leads/${params.id}`,
  method: "put",
  data:{...params}
});

const deleteLead = (params:any) => ({
  url: `/leads/${params.id}`,
  method: "delete",
  data:{...params}
});

const exportLeads = (params:any) => ({
  url: `/leads/export`,
  method: "get",
  params:{...params}
});

export { getAllLeads, getLeadById, createLead, updateLead, deleteLead, exportLeads };

