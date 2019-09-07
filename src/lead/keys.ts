/**
 * zapier-validate sometimes has problems when keys from actions/searches are used in searchOrCreate operations
 */
export const leadActions = {
  createLeadAction: 'lead_create',
  updateLeadAction: 'lead_update'
}

export const leadSearches = {
  leadSearchOrCreate: 'lead_search_v2'
}

export const leadTriggers = {
  newLeadTrigger: 'lead_new_lead_trigger',
  leadListDropdown: 'lead_list_leads_dropdown',
  updatedLeadTrigger: 'lead_update_lead_trigger',
  leadStatusChangeTrigger: 'lead_status_change_trigger',
}

export const leadStatusTriggers = {
  leadStatusDropdown: 'list_lead_status_dropdown'
}
