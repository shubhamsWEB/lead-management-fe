import { getAllLeads, getLeadById, createLead, updateLead, deleteLead, exportLeads } from "../configs/leads";
import RequestHandler from "../../requestsHandler";

// Helper function to filter out empty values from params
const filterEmptyParams = (params: any) => {
  if (!params) return params;
  
  const filteredParams = Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);
  
  return filteredParams;
};

const getAllLeadsService = (params: any) =>
  new RequestHandler("apiServer", getAllLeads(filterEmptyParams(params)))
    .call()
    .then((data: any) => ({ data: data }))
    .catch((error: any) => {
      throw error;
    });

const getLeadByIdService = (params: any) =>
  new RequestHandler("apiServer", getLeadById(filterEmptyParams(params)))
    .call()
    .then((data: any) => ({ data: data }))
    .catch((error: any) => {
      throw error;
    });

const createLeadService = (params: any) =>
  new RequestHandler("apiServer", createLead(filterEmptyParams(params)))
    .call()
    .then((data: any) => ({ data: data }))
    .catch((error: any) => {
      throw error;
    });

const updateLeadService = (params: any) =>
  new RequestHandler("apiServer", updateLead(filterEmptyParams(params)))
    .call()
    .then((data: any) => ({ data: data }))
    .catch((error: any) => {
      throw error;
    });

const deleteLeadService = (params: any) =>
  new RequestHandler("apiServer", deleteLead(filterEmptyParams(params)))
    .call()
    .then((data: any) => data)
    .catch((error: any) => {
      throw error;
    });

const exportLeadsService = (params: any) =>
  new RequestHandler("apiServer", exportLeads(filterEmptyParams(params)))
    .call()
    .then((data: any) => data)
    .catch((error: any) => {
      throw error;
    });

export { getAllLeadsService, getLeadByIdService, createLeadService, updateLeadService, deleteLeadService, exportLeadsService };

