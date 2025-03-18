import { getAllLeads, getLeadById, createLead, updateLead, deleteLead, exportLeads } from "../configs/leads";
import RequestHandler from "../../requestsHandler";

// Helper function to filter out empty values from params

const getAllLeadsService = (params: any) =>
  new RequestHandler("apiServer", getAllLeads(params))
    .call()
    .then((data: any) => ({ data: data }))
    .catch((error: any) => {
      throw error;
    });

const getLeadByIdService = (params: any) =>
  new RequestHandler("apiServer", getLeadById(params))
    .call()
    .then((data: any) => ({ data: data }))
    .catch((error: any) => {
      throw error;
    });

const createLeadService = (params: any) =>
  new RequestHandler("apiServer", createLead(params))
    .call()
    .then((data: any) => ({ data: data }))
    .catch((error: any) => {
      throw error;
    });

const updateLeadService = (params: any) =>
  new RequestHandler("apiServer", updateLead(params))
    .call()
    .then((data: any) => ({ data: data }))
    .catch((error: any) => {
      throw error;
    });

const deleteLeadService = (params: any) =>
  new RequestHandler("apiServer", deleteLead(params))
    .call()
    .then((data: any) => data)
    .catch((error: any) => {
      throw error;
    });

const exportLeadsService = (params: any) =>
  new RequestHandler("apiServer", exportLeads(params))
    .call()
    .then((data: any) => data)
    .catch((error: any) => {
      throw error;
    });

export { getAllLeadsService, getLeadByIdService, createLeadService, updateLeadService, deleteLeadService, exportLeadsService };

