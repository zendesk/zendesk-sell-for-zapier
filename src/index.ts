import {apiTokenBearer, authentication} from './auth/authentication'
import {version as platformVersion} from 'zapier-platform-core'
import {ListDealsDropdown, NewDealTrigger} from './deal/newDeal.trigger'
import {DealStageChangeTrigger, DeprecatedDealStageChangeTrigger} from './deal/dealStageChange.trigger'
import DealUpdatedTrigger from './deal/updateDeal.trigger'
import UpdateLeadTrigger from './lead/updateLead.trigger'
import UpdatedContactTrigger from './contact/updatedContact.trigger'
import {
  ContactCompanySearch,
  ContactPersonSearch,
  ContactSearch,
  DeprecatedContactSearch
} from './contact/contact.search'
import {
  CreateCompanyAction,
  CreatePersonAction,
  DeprecatedCreateOrUpdateCompanyAction,
  DeprecatedCreateOrUpdatePersonAction,
  UpdateCompanyAction,
  UpdatePersonAction
} from './contact/contact.action'
import ContactResource from './contact/contact.resource'
import {
  ListCompaniesDropdown,
  ListContactDropdown,
  ListPersonsDropdown,
  NewContactTrigger
} from './contact/newContact.trigger'
import {ContactTagsDropdownList, DealTagsDropdownList, LeadTagsDropdownList} from './common/tag/tag.trigger'
import TagResource from './common/tag/tag.resource'
import LeadResource from './lead/lead.resource'
import {CreateLeadAction, DeprecatedCreateOrUpdateLeadAction, UpdateLeadAction} from './lead/lead.action'
import {DeprecatedLeadSearch, LeadSearch} from './lead/lead.search'
import SourceResource from './common/source/source.resource'
import {ListLeadsDropdown, NewLeadTrigger} from './lead/newLead.trigger'
import {CreateDealAction, DeprecatedCreateOrUpdateDealAction, UpdateDealAction} from './deal/deal.action'
import {DealSearch, DeprecatedDealSearch} from './deal/deal.search'
import DealResource from './deal/deal.resource'
import StageResource from './deal/stages/stage.resource'
import PipelineResource from './deal/stages/pipeline.resource'
import {ListUsersDropdown} from './users/user.trigger'
import {UserSearch} from './users/user.search'
import UserResource from './users/user.resource'
import {ContactIndustryDropdown, LeadIndustryDropdown} from './common/industry/industry.trigger'
import {StageSearch} from './deal/stages/stage.search'
import {ListLeadStatusDropdown} from './lead/status/leadStatus.trigger'
import LeadStatusResource from './lead/status/leadStatus.resource'
import IndustryResource from './common/industry/industry.resource'
import {DealSourceDropdownList, LeadSourceDropdownList} from './common/source/source.trigger'
import {DealSourceSearch, LeadSourceSearch} from './common/source/source.search'
import applicationVersion from './version'
import {ListStageDropdown} from './deal/stages/stage.trigger'
import {ListPipelineDropdown} from './deal/stages/pipeline.trigger'
import NoteResource from './notesTasks/notes/note.resouce'
import TaskResource from './notesTasks/tasks/task.resource'
import {CreateTaskAction} from './notesTasks/tasks/task.action'
import {CreateNoteAction} from './notesTasks/notes/note.action'
import {NewNoteTrigger} from './notesTasks/notes/newNote.trigger'
import {applicationMetadataAppender, appSignatureAppender} from './utils/operations'
import {NewTaskTrigger} from './notesTasks/tasks/newTask.trigger'
import {ContactCompanySearchOrCreate, ContactPersonSearchOrCreate} from './contact/contact.searchCreate'
import {LeadSearchOrCreate} from './lead/lead.searchCreate'
import {DealSearchOrCreate} from './deal/deal.searchCreate'
import {ProductResource} from './products/catalog/product.resource'
import {ProductSearch} from './products/catalog/product.search'
import {ProductSearchOrCreate} from './products/catalog/product.searchCreate'
import {CreateProductAction, UpdateProductAction} from './products/catalog/product.action'
import {NewProductInCatalogTrigger} from './products/catalog/newProductsInCatalog.trigger'
import {LeadStatusChangeTrigger} from './lead/leadStatusChange.trigger'

// We can roll up all our behaviors in an App.
const App = {
  // This is just shorthand to reference the installed dependencies you have. Zapier will
  // need to know these before we can upload
  version: applicationVersion,
  platformVersion,
  authentication,

  // All necessary hooks added to HTTP request like: adding header with api token, signature, metadata
  beforeRequest: [
    apiTokenBearer,
    applicationMetadataAppender,
    appSignatureAppender
  ],

  afterResponse: [],

  // If you want to define optional resources to simplify creation of triggers, searches, creates - do that here!
  resources: {
    // Leads
    [LeadResource.key]: LeadResource,

    // Contacts
    [ContactResource.key]: ContactResource,

    // Deals
    [DealResource.key]: DealResource,
    [PipelineResource.key]: PipelineResource,
    [StageResource.key]: StageResource,

    // Notes & Tasks
    [NoteResource.key]: NoteResource,
    [TaskResource.key]: TaskResource,

    // Products
    [ProductResource.key]: ProductResource,

    // Common
    [TagResource.key]: TagResource,
    [UserResource.key]: UserResource,
    [IndustryResource.key]: IndustryResource,
    [LeadStatusResource.key]: LeadStatusResource,
    [SourceResource.key]: SourceResource
  },

  // If you want your trigger to show up, you better include it here!
  triggers: {
    // Triggers
    // Leads triggers
    [NewLeadTrigger.key]: NewLeadTrigger,
    [UpdateLeadTrigger.key]: UpdateLeadTrigger,
    [LeadStatusChangeTrigger.key]: LeadStatusChangeTrigger,

    // Contacts triggers
    [NewContactTrigger.key]: NewContactTrigger,
    [UpdatedContactTrigger.key]: UpdatedContactTrigger,

    // Deals triggers
    [NewDealTrigger.key]: NewDealTrigger,
    [DealStageChangeTrigger.key]: DealStageChangeTrigger,
    [DealUpdatedTrigger.key]: DealUpdatedTrigger,
    [DeprecatedDealStageChangeTrigger.key]: DeprecatedDealStageChangeTrigger,

    // Note triggers
    [NewNoteTrigger.key]: NewNoteTrigger,

    // Task triggers
    [NewTaskTrigger.key]: NewTaskTrigger,

    // Products
    [NewProductInCatalogTrigger.key]: NewProductInCatalogTrigger,

    // Dropdowns
    // Leads dropdowns
    [ListLeadsDropdown.key]: ListLeadsDropdown,

    // Contact dropdowns
    [ListPersonsDropdown.key]: ListPersonsDropdown,
    [ListCompaniesDropdown.key]: ListCompaniesDropdown,
    [ListContactDropdown.key]: ListContactDropdown,

    // Deal dropdowns
    [ListDealsDropdown.key]: ListDealsDropdown,
    [ListStageDropdown.key]: ListStageDropdown,
    [ListPipelineDropdown.key]: ListPipelineDropdown,

    // Tags dropdowns
    [LeadTagsDropdownList.key]: LeadTagsDropdownList,
    [ContactTagsDropdownList.key]: ContactTagsDropdownList,
    [DealTagsDropdownList.key]: DealTagsDropdownList,

    // Industry dropdowns
    [LeadIndustryDropdown.key]: LeadIndustryDropdown,
    [ContactIndustryDropdown.key]: ContactIndustryDropdown,

    // User dropdowns
    [ListUsersDropdown.key]: ListUsersDropdown,

    // Lead status dropdowns
    [ListLeadStatusDropdown.key]: ListLeadStatusDropdown,

    // Lead/Deal sources
    [LeadSourceDropdownList.key]: LeadSourceDropdownList,
    [DealSourceDropdownList.key]: DealSourceDropdownList
  },

  // If you want your searches to show up, you better include it here!
  searches: {
    // Leads
    [LeadSearch.key]: LeadSearch,
    [DeprecatedLeadSearch.key]: DeprecatedLeadSearch,

    // Contacts
    [ContactSearch.key]: ContactSearch,
    [ContactPersonSearch.key]: ContactPersonSearch,
    [ContactCompanySearch.key]: ContactCompanySearch,
    [DeprecatedContactSearch.key]: DeprecatedContactSearch,

    // Deals
    [DealSearch.key]: DealSearch,
    [DeprecatedDealSearch.key]: DeprecatedDealSearch,

    // Users
    [UserSearch.key]: UserSearch,

    // Stages
    [StageSearch.key]: StageSearch,

    // Lead/Deal sources
    [LeadSourceSearch.key]: LeadSourceSearch,
    [DealSourceSearch.key]: DealSourceSearch,

    // Products
    [ProductSearch.key]: ProductSearch
  },

  // If you want your creates to show up, you better include it here!
  creates: {
    // Leads
    [CreateLeadAction.key]: CreateLeadAction,
    [UpdateLeadAction.key]: UpdateLeadAction,

    // Contacts
    [CreatePersonAction.key]: CreatePersonAction,
    [CreateCompanyAction.key]: CreateCompanyAction,
    [UpdatePersonAction.key]: UpdatePersonAction,
    [UpdateCompanyAction.key]: UpdateCompanyAction,

    // Deals
    [CreateDealAction.key]: CreateDealAction,
    [UpdateDealAction.key]: UpdateDealAction,

    // Notes
    [CreateNoteAction.key]: CreateNoteAction,

    // Tasks
    [CreateTaskAction.key]: CreateTaskAction,

    // Products
    [CreateProductAction.key]: CreateProductAction,
    [UpdateProductAction.key]: UpdateProductAction,

    // Deprecated and hidden
    [DeprecatedCreateOrUpdateLeadAction.key]: DeprecatedCreateOrUpdateLeadAction,
    [DeprecatedCreateOrUpdatePersonAction.key]: DeprecatedCreateOrUpdatePersonAction,
    [DeprecatedCreateOrUpdateCompanyAction.key]: DeprecatedCreateOrUpdateCompanyAction,
    [DeprecatedCreateOrUpdateDealAction.key]: DeprecatedCreateOrUpdateDealAction,
  },

  searchOrCreates: {
    // Leads
    [LeadSearchOrCreate.key]: LeadSearchOrCreate,

    // Contacts
    [ContactPersonSearchOrCreate.key]: ContactPersonSearchOrCreate,
    [ContactCompanySearchOrCreate.key]: ContactCompanySearchOrCreate,

    // Deals
    [DealSearchOrCreate.key]: DealSearchOrCreate,

    // Products
    [ProductSearchOrCreate.key]: ProductSearchOrCreate
  }
}

// Finally, export the app.
export default App
